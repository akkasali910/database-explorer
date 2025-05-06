# Error Handling

```jsx
// API error handling
try {
  const response = await axios.get(`${API_BASE_URL}/tables/${tableName}/records`);
  return response.data.records || [];
} catch (error: any) {
  if (error.response?.status === 401) {
    throw new Error(`Authentication required for table ${tableName}`);
  }
  if (error.response?.status === 404) {
    throw new Error(`Records endpoint not found for table ${tableName}`);
  }
  throw new Error(`Failed to fetch records: ${error.message}`);
}

// Component error display
{error ? (
  <Alert type="error" header="Error loading records">
    {error}
    <Box padding={{ top: 's' }}>
      <Button onClick={loadData}>Try Again</Button>
    </Box>
  </Alert>
) : (
  'No records to display.'
)}

// Special case handling
{!hasPrimaryKey && (
  <Alert type="info" header="Table has no primary key">
    This table does not have a primary key defined. Some operations 
    like viewing record details may not be available.
  </Alert>
)}
```