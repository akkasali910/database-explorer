# Record Details Component

```jsx
const RecordDetails: React.FC<RecordDetailsProps> = ({ 
  tableName, record, onBack, isEditing, onEditToggle 
}) => {
  const [recordData, setRecordData] = useState<Record | null>(null);
  const [editableFields, setEditableFields] = useState<EditableField[]>([]);
  
  // Render appropriate field editor based on data type
  const renderEditableField = (field: EditableField) => {
    switch (field.type.toLowerCase()) {
      case 'string':
        return (
          <FormField label={field.name}>
            <Input
              value={field.value || ''}
              onChange={e => handleFieldChange(field.name, e.detail.value)}
            />
          </FormField>
        );
      case 'number':
        return (
          <FormField label={field.name}>
            <Input
              type="number"
              value={field.value?.toString() || ''}
              onChange={e => handleFieldChange(field.name, e.detail.value)}
            />
          </FormField>
        );
      // Other field types...
    }
  };
  
  return (
    <Container>
      <Header actions={
        <Button onClick={onBack}>Back to Records</Button>
      }>
        Record Details
      </Header>
      
      {isEditing ? (
        <Form>
          {editableFields.map(field => renderEditableField(field))}
          <Button onClick={handleSave}>Save</Button>
        </Form>
      ) : (
        <ColumnLayout columns={2}>
          {editableFields.map(field => (
            <div key={field.name}>
              <Box variant="awsui-key-label">{field.name}</Box>
              <div>{formatValue(field.value, field.type)}</div>
            </div>
          ))}
          <Button onClick={onEditToggle}>Edit</Button>
        </ColumnLayout>
      )}
    </Container>
  );
};
```