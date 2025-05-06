import React, { useState, useEffect } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  ColumnLayout,
  Box,
  Spinner,
  StatusIndicator,
  Form,
  FormField,
  Input,
  Select,
  Textarea,
  DatePicker,
  Toggle,
  Alert,
} from '@cloudscape-design/components';
import { Record, TableSchema, EditableField } from '../types/types';
import { fetchTableSchema, fetchRecord, updateRecord, createRecord } from '../services/dataService';
import { formatValue } from '../utils/formatters';

interface RecordDetailsProps {
  tableName: string;
  record: Record;
  onBack: () => void;
  isEditing: boolean;
  onEditToggle: () => void;
}

const RecordDetails: React.FC<RecordDetailsProps> = ({ 
  tableName, 
  record, 
  onBack, 
  isEditing, 
  onEditToggle 
}) => {
  const [schema, setSchema] = useState<TableSchema | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recordData, setRecordData] = useState<Record | null>(null);
  const [editableFields, setEditableFields] = useState<EditableField[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const isNewRecord = record.isNew === true;

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setSaveSuccess(false);
      
      console.log(`Fetching schema for table ${tableName}...`);
      
      try {
        const schemaData = await fetchTableSchema(tableName);
        console.log(`Received schema for table ${tableName}:`, schemaData);
        setSchema(schemaData);
        
        // Check if the table has a primary key
        const hasPrimaryKey = schemaData.columns?.some(col => col.isPrimaryKey);
        if (!hasPrimaryKey) {
          throw new Error(`Table ${tableName} does not have a primary key. Cannot edit records.`);
        }
        
        if (!isNewRecord) {
          // Find the primary key field
          const primaryKey = schemaData.columns?.find(col => col.isPrimaryKey);
          const idField = primaryKey?.name || 'id'; // Default to 'id' if no primary key is defined
          
          console.log(`Fetching record details for ${tableName}/${record[idField]}...`);
          try {
            const recordData = await fetchRecord(tableName, record[idField]);
            console.log(`Received record details:`, recordData);
            setRecordData(recordData);
            
            // Create editable fields from record data and schema
            if (schemaData.columns) {
              const fields = schemaData.columns.map(column => ({
                name: column.name,
                value: recordData[column.name],
                type: column.type,
                isRequired: !column.isNullable && !column.isPrimaryKey,
              }));
              
              setEditableFields(fields);
            } else {
              // If no schema columns, create fields from record data
              const fields = Object.entries(recordData).map(([key, value]) => ({
                name: key,
                value: value,
                type: typeof value === 'number' ? 'number' : 'string',
                isRequired: key === idField, // Assume only ID is required
              }));
              
              setEditableFields(fields);
            }
          } catch (recordErr) {
            console.error(`Failed to load record details:`, recordErr);
            throw recordErr;
          }
        } else {
          // Create empty editable fields for new record
          if (schemaData.columns) {
            const fields = schemaData.columns.map(column => ({
              name: column.name,
              value: column.isPrimaryKey ? null : '',
              type: column.type,
              isRequired: !column.isNullable && !column.isPrimaryKey,
            }));
            
            setEditableFields(fields);
            setRecordData({});
          } else {
            // Can't create fields without schema
            throw new Error('Cannot create a new record without schema information');
          }
        }
      } catch (schemaErr: any) {
        console.error(`Failed to load schema for table ${tableName}:`, schemaErr);
        throw schemaErr;
      }
    } catch (err: any) {
      console.error(`Failed to load record details:`, err);
      setError(`Failed to load record details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tableName, record]);

  const handleFieldChange = (name: string, value: any) => {
    setEditableFields(fields => 
      fields.map(field => 
        field.name === name ? { ...field, value } : field
      )
    );
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(errors => {
        const newErrors = { ...errors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    editableFields.forEach(field => {
      if (field.isRequired && (field.value === null || field.value === '')) {
        errors[field.name] = 'This field is required';
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      setError(null);
      
      const updatedData = editableFields.reduce((obj, field) => {
        // Skip null values for primary keys in new records (they'll be auto-generated)
        if (isNewRecord && schema?.columns?.find(col => col.name === field.name && col.isPrimaryKey) && field.value === null) {
          return obj;
        }
        
        // Convert string numbers to actual numbers if the field type is numeric
        const column = schema?.columns?.find(col => col.name === field.name);
        if (column && ['number', 'integer', 'decimal', 'float', 'double precision', 'bigint'].includes(column.type.toLowerCase())) {
          const numValue = parseFloat(field.value);
          if (!isNaN(numValue)) {
            obj[field.name] = numValue;
            return obj;
          }
        }
        
        obj[field.name] = field.value;
        return obj;
      }, {} as Record);
      
      console.log(`Saving record data:`, updatedData);
      
      let savedRecord;
      if (isNewRecord) {
        savedRecord = await createRecord(tableName, updatedData);
        console.log(`Created new record:`, savedRecord);
      } else {
        const primaryKey = schema?.columns?.find(col => col.isPrimaryKey);
        const idField = primaryKey?.name || 'id';
        
        savedRecord = await updateRecord(tableName, record[idField], updatedData);
        console.log(`Updated record:`, savedRecord);
      }
      
      setRecordData(savedRecord);
      setSaveSuccess(true);
      
      // If it's a new record, stay in edit mode
      if (!isNewRecord) {
        onEditToggle();
      }
    } catch (err: any) {
      console.error('Failed to save record:', err);
      setError(`Failed to save record: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const renderFieldValue = (field: EditableField) => {
    const value = field.value;
    
    if (value === null || value === undefined) {
      return <span className="text-muted">NULL</span>;
    }
    
    return formatValue(value, field.type);
  };

  const renderEditableField = (field: EditableField) => {
    const error = formErrors[field.name];
    const isPrimaryKey = schema?.columns?.find(col => col.name === field.name && col.isPrimaryKey);
    
    // Disable editing of primary key fields for existing records
    const isDisabled = !isNewRecord && isPrimaryKey;
    
    switch (field.type.toLowerCase()) {
      case 'string':
      case 'varchar':
      case 'char':
      case 'text':
        return (
          <FormField
            label={field.name}
            errorText={error}
          >
            <Input
              value={field.value || ''}
              onChange={e => handleFieldChange(field.name, e.detail.value)}
              disabled={isDisabled}
            />
          </FormField>
        );
      case 'number':
      case 'integer':
      case 'decimal':
      case 'float':
      case 'double precision':
      case 'bigint':
        return (
          <FormField
            label={field.name}
            errorText={error}
          >
            <Input
              type="number"
              value={field.value?.toString() || ''}
              onChange={e => handleFieldChange(field.name, e.detail.value)}
              disabled={isDisabled}
            />
          </FormField>
        );
      case 'date':
        return (
          <FormField
            label={field.name}
            errorText={error}
          >
            <DatePicker
              value={field.value || ''}
              onChange={e => handleFieldChange(field.name, e.detail.value)}
              disabled={isDisabled}
            />
          </FormField>
        );
      case 'boolean':
        return (
          <FormField
            label={field.name}
            errorText={error}
          >
            <Toggle
              checked={!!field.value}
              onChange={e => handleFieldChange(field.name, e.detail.checked)}
              disabled={isDisabled}
            />
          </FormField>
        );
      case 'longtext':
        return (
          <FormField
            label={field.name}
            errorText={error}
          >
            <Textarea
              value={field.value || ''}
              onChange={e => handleFieldChange(field.name, e.detail.value)}
              disabled={isDisabled}
            />
          </FormField>
        );
      default:
        return (
          <FormField
            label={field.name}
            errorText={error}
          >
            <Input
              value={field.value?.toString() || ''}
              onChange={e => handleFieldChange(field.name, e.detail.value)}
              disabled={isDisabled}
            />
          </FormField>
        );
    }
  };

  if (loading) {
    return (
      <Container>
        <Box textAlign="center" padding="l">
          <Spinner size="large" />
          <Box variant="p" padding={{ top: 's' }}>
            Loading record details...
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box textAlign="center" padding="l">
          <StatusIndicator type="error">
            {error}
          </StatusIndicator>
          <Box padding={{ top: 'm' }}>
            <Button onClick={onBack}>Back to Records</Button>
          </Box>
        </Box>
      </Container>
    );
  }

  const primaryKey = schema?.columns?.find(col => col.isPrimaryKey);
  const idField = primaryKey?.name || 'id';
  const recordTitle = isNewRecord 
    ? 'New Record' 
    : recordData
      ? `Record: ${recordData[idField]}` 
      : 'Record Details';

  return (
    <Container>
      <SpaceBetween size="l">
        <Header
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={onBack} variant="link">
                Back to Records
              </Button>
              {isEditing ? (
                <>
                  <Button onClick={onEditToggle} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSave} loading={isSaving}>
                    Save
                  </Button>
                </>
              ) : (
                <Button onClick={onEditToggle}>
                  Edit
                </Button>
              )}
            </SpaceBetween>
          }
        >
          {recordTitle}
        </Header>

        {saveSuccess && (
          <Alert type="success">
            Record saved successfully.
          </Alert>
        )}

        {isEditing ? (
          <Form>
            <SpaceBetween size="l">
              {editableFields.map(field => (
                <div key={field.name}>
                  {renderEditableField(field)}
                </div>
              ))}
            </SpaceBetween>
          </Form>
        ) : (
          <ColumnLayout columns={2} variant="text-grid">
            {editableFields.map(field => (
              <div key={field.name}>
                <Box variant="awsui-key-label">{field.name}</Box>
                <div>
                  {renderFieldValue(field)}
                </div>
              </div>
            ))}
          </ColumnLayout>
        )}
      </SpaceBetween>
    </Container>
  );
};

export default RecordDetails;