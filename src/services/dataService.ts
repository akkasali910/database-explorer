import axios from 'axios';
import { TableMetadata, TableSchema, Record, ColumnMetadata } from '../types/types';

// Using the full URL for the API
const API_BASE_URL = 'https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/api/explorer';

// Enhanced axios instance with logging
const api = axios.create({
  baseURL: API_BASE_URL
});

// Request interceptor for logging
api.interceptors.request.use(request => {
  console.log('API Request:', {
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers
  });
  return request;
});

// Response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// API functions without mock data fallback
export const fetchTables = async (): Promise<TableMetadata[]> => {
  const response = await api.get(`/tables`);
  return response.data;
};

export const fetchTableSchema = async (tableName: string): Promise<TableSchema> => {
  // Updated to use /tables/{tableName} instead of /tables/{tableName}/schema
  const response = await api.get(`/tables/${tableName}`);
  
  // Transform the response to match our TableSchema interface
  const apiResponse = response.data;
  
  // Create a standardized schema object
  const schema: TableSchema = {
    tableName: apiResponse.name,
    schema: apiResponse.schema, // Keep the original schema info
  };
  
  // Transform columns if they exist
  if (apiResponse.columns && Array.isArray(apiResponse.columns)) {
    schema.columns = apiResponse.columns.map((col: any): ColumnMetadata => ({
      name: col.name,
      displayName: col.name,
      type: col.type || 'string',
      isPrimaryKey: Array.isArray(apiResponse.primaryKey) && apiResponse.primaryKey.includes(col.name),
      isForeignKey: false, // API doesn't provide this info
      isNullable: col.nullable === true,
      // Add any other properties needed
    }));
  }
  
  return schema;
};

export const fetchRecords = async (tableName: string): Promise<Record[]> => {
  try {
    // Using the correct endpoint format: /api/explorer/tables/{table_name}/records
    const response = await api.get(`/tables/${tableName}/records`);
    
    // Check if the response has a records property (pagination format)
    if (response.data && response.data.records && Array.isArray(response.data.records)) {
      return response.data.records;
    }
    
    // If it's just an array, return it directly
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // If we can't find records, return an empty array
    console.error('Unexpected response format for records:', response.data);
    return [];
  } catch (error: any) {
    console.error(`Error fetching records for ${tableName}:`, error);
    
    // If it's an authentication error, provide a helpful message
    if (error.response && error.response.status === 401) {
      throw new Error(`Authentication required to access records for table ${tableName}`);
    }
    
    // If it's a 404, the endpoint might not exist
    if (error.response && error.response.status === 404) {
      throw new Error(`Records endpoint not found for table ${tableName}. The API might not support this operation.`);
    }
    
    throw new Error(`Failed to fetch records for table ${tableName}: ${error.message}`);
  }
};

export const fetchRecord = async (tableName: string, recordId: string): Promise<Record> => {
  try {
    // Using the correct endpoint format: /api/explorer/tables/{table_name}/records/{id}
    const response = await api.get(`/tables/${tableName}/records/${recordId}`);
    
    // Check if the response has a record property (nested format)
    if (response.data && response.data.record && typeof response.data.record === 'object') {
      return response.data.record;
    }
    
    // If it's just an object, return it directly
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      // Check if it's an error response
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    }
    
    throw new Error(`Unexpected response format for record: ${JSON.stringify(response.data)}`);
  } catch (error: any) {
    console.error(`Error fetching record ${recordId} from ${tableName}:`, error);
    
    if (error.response && error.response.status === 404) {
      throw new Error(`Record ${recordId} not found in table ${tableName}`);
    }
    
    // If the API returns an error message directly
    if (error.message) {
      throw error;
    }
    
    throw new Error(`Failed to fetch record ${recordId} from table ${tableName}: ${error.message}`);
  }
};

export const updateRecord = async (tableName: string, recordId: string, data: Record): Promise<Record> => {
  try {
    console.log(`Updating record ${recordId} in table ${tableName} with data:`, data);
    
    // First, check if the table has a primary key
    const schema = await fetchTableSchema(tableName);
    const primaryKey = schema.columns?.find(col => col.isPrimaryKey);
    
    if (!primaryKey) {
      throw new Error(`Cannot update record: Table ${tableName} does not have a primary key`);
    }
    
    // Ensure the primary key is included in the data
    const updatedData = {
      ...data,
      [primaryKey.name]: recordId
    };
    
    // Try different request formats
    
    // Format 1: Standard PUT request
    try {
      const response = await api.put(`/tables/${tableName}/records/${recordId}`, updatedData);
      
      // Check if the response has a record property (nested format)
      if (response.data && response.data.record && typeof response.data.record === 'object') {
        return response.data.record;
      }
      
      return response.data;
    } catch (putError: any) {
      console.warn('Standard PUT request failed:', putError.message);
      
      // If it's a 405 Method Not Allowed, try POST with _method=PUT
      if (putError.response && putError.response.status === 405) {
        console.log('Trying POST with _method=PUT...');
        
        // Format 2: POST with _method=PUT (common API convention)
        const postResponse = await api.post(`/tables/${tableName}/records/${recordId}`, {
          ...updatedData,
          _method: 'PUT'
        });
        
        if (postResponse.data && postResponse.data.record && typeof postResponse.data.record === 'object') {
          return postResponse.data.record;
        }
        
        return postResponse.data;
      }
      
      // If it's not a 405, rethrow the original error
      throw putError;
    }
  } catch (error: any) {
    console.error(`Error updating record ${recordId} in ${tableName}:`, error);
    
    // If the API returns an error message directly
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    
    throw new Error(`Failed to update record: ${error.response?.data?.message || error.message}`);
  }
};

export const createRecord = async (tableName: string, data: Record): Promise<Record> => {
  try {
    console.log(`Creating record in table ${tableName} with data:`, data);
    
    // First, check if the table has a primary key
    const schema = await fetchTableSchema(tableName);
    const primaryKey = schema.columns?.find(col => col.isPrimaryKey);
    
    if (!primaryKey) {
      throw new Error(`Cannot create record: Table ${tableName} does not have a primary key`);
    }
    
    // Remove any null or undefined primary key value to let the server generate it
    const createData = { ...data };
    if (primaryKey && (createData[primaryKey.name] === null || createData[primaryKey.name] === undefined)) {
      delete createData[primaryKey.name];
    }
    
    // Try different request formats
    
    // Format 1: Standard POST request
    try {
      const response = await api.post(`/tables/${tableName}/records`, createData);
      
      // Check if the response has a record property (nested format)
      if (response.data && response.data.record && typeof response.data.record === 'object') {
        return response.data.record;
      }
      
      return response.data;
    } catch (postError: any) {
      console.warn('Standard POST request failed:', postError.message);
      
      // If it's a specific error that suggests a different format is needed, we could try alternatives here
      throw postError;
    }
  } catch (error: any) {
    console.error(`Error creating record in ${tableName}:`, error);
    
    // If the API returns an error message directly
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    
    throw new Error(`Failed to create record: ${error.response?.data?.message || error.message}`);
  }
};

export const deleteRecord = async (tableName: string, recordId: string): Promise<void> => {
  try {
    console.log(`Deleting record ${recordId} from table ${tableName}`);
    
    // First, check if the table has a primary key
    const schema = await fetchTableSchema(tableName);
    const primaryKey = schema.columns?.find(col => col.isPrimaryKey);
    
    if (!primaryKey) {
      throw new Error(`Cannot delete record: Table ${tableName} does not have a primary key`);
    }
    
    await api.delete(`/tables/${tableName}/records/${recordId}`);
  } catch (error: any) {
    console.error(`Error deleting record ${recordId} from ${tableName}:`, error);
    
    // If the API returns an error message directly
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    
    throw new Error(`Failed to delete record: ${error.response?.data?.message || error.message}`);
  }
};
