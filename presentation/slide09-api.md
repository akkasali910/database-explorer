# API Integration

- **RESTful Endpoints**: Standard HTTP methods
- **Error Handling**: Comprehensive error management
- **Response Transformation**: Adapting API data to application needs
- **Pagination Support**: Handling large datasets

```typescript
// API endpoints
const API_BASE_URL = '/api/explorer';

// API functions
export const fetchTables = async (): Promise<TableMetadata[]> => {
  const response = await axios.get(`${API_BASE_URL}/tables`);
  return response.data;
};

export const fetchRecords = async (tableName: string): Promise<Record[]> => {
  const response = await axios.get(`${API_BASE_URL}/tables/${tableName}/records`);
  
  // Handle paginated response format
  if (response.data && response.data.records) {
    return response.data.records;
  }
  
  return response.data;
};
```