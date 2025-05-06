# Records List Component

```jsx
const RecordsList: React.FC<RecordsListProps> = ({ 
  table, onRecordSelect, onBack 
}) => {
  const [records, setRecords] = useState<Record[]>([]);
  const [schema, setSchema] = useState<TableSchema | null>(null);
  
  // Dynamic column definitions based on schema
  const getColumnDefinitions = () => {
    if (!schema || !schema.columns) {
      // Fallback to using record properties
      return Object.keys(records[0] || {}).map(key => ({
        id: key,
        header: key,
        cell: item => formatValue(item[key], typeof item[key])
      }));
    }
    
    // Use schema information for columns
    return schema.columns.slice(0, 5).map(column => ({
      id: column.name,
      header: column.displayName || column.name,
      cell: item => formatValue(item[column.name], column.type)
    }));
  };
  
  return (
    <Table
      columnDefinitions={getColumnDefinitions()}
      items={items}
      header={
        <Header actions={
          <Button onClick={onBack}>Back to Tables</Button>
        }>
          {table.name} Records
        </Header>
      }
    />
  );
};
```