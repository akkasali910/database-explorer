# Tables Explorer Component

```jsx
const TablesList: React.FC<TablesListProps> = ({ onTableSelect }) => {
  const [tables, setTables] = useState<TableMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Collection hooks for filtering, sorting, pagination
  const { items, filteredItemsCount, collectionProps, 
          filterProps, paginationProps } = useCollection(tables, {
    filtering: { ... },
    pagination: { pageSize: 10 },
    selection: {},
    sorting: { ... }
  });
  
  return (
    <Table
      columnDefinitions={[
        { id: 'name', header: 'Table Name', ... },
        { id: 'type', header: 'Type', ... },
        { id: 'description', header: 'Description', ... }
      ]}
      items={items}
      filter={<TextFilter {...filterProps} />}
      pagination={<Pagination {...paginationProps} />}
    />
  );
};
```

![Tables Explorer](https://cloudscape.design/images/components/table-dense.png)