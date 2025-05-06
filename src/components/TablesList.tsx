import React, { useState, useEffect } from 'react';
import {
  Table,
  Box,
  SpaceBetween,
  Button,
  Pagination,
  TextFilter,
  Header,
  StatusIndicator,
  Alert,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { TableMetadata } from '../types/types';
import { fetchTables } from '../services/dataService';
import { formatDateTime } from '../utils/formatters';

interface TablesListProps {
  onTableSelect: (table: TableMetadata) => void;
}

const TablesList: React.FC<TablesListProps> = ({ onTableSelect }) => {
  const [tables, setTables] = useState<TableMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<TableMetadata[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadTables = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching tables from API...');
      const data = await fetchTables();
      console.log('Received tables:', data);
      setTables(data);
    } catch (err) {
      console.error('Failed to load tables:', err);
      setError('Failed to load tables. Please check the API endpoint configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const { items, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
    tables,
    {
      filtering: {
        empty: (
          <Box textAlign="center" color="inherit">
            <b>No tables</b>
            <Box padding={{ bottom: 's' }} variant="p" color="inherit">
              {error ? (
                <Alert type="error" header="Error loading tables">
                  {error}
                  <Box padding={{ top: 's' }}>
                    <Button onClick={loadTables}>Try Again</Button>
                  </Box>
                </Alert>
              ) : (
                'No tables to display.'
              )}
            </Box>
          </Box>
        ),
        noMatch: (
          <Box textAlign="center" color="inherit">
            <b>No matches</b>
            <Box padding={{ bottom: 's' }} variant="p" color="inherit">
              No tables matched the filter.
            </Box>
          </Box>
        ),
      },
      pagination: { pageSize: 10 },
      selection: {},
    }
  );

  const handleSelectionChange = (event: any) => {
    setSelectedItems(event.detail.selectedItems);
    if (event.detail.selectedItems.length === 1) {
      onTableSelect(event.detail.selectedItems[0]);
    }
  };

  return (
    <Table
      {...collectionProps}
      loading={loading}
      loadingText="Loading tables"
      columnDefinitions={[
        {
          id: 'name',
          header: 'Table Name',
          cell: item => item.displayName || item.name,
          sortingField: 'name',
        },
        {
          id: 'type',
          header: 'Type',
          cell: item => item.type || 'table',
          sortingField: 'type',
        },
        {
          id: 'description',
          header: 'Description',
          cell: item => item.description || '-',
        },
        {
          id: 'recordCount',
          header: 'Records',
          cell: item => item.recordCount?.toLocaleString() || '-',
          sortingField: 'recordCount',
        },
        {
          id: 'lastUpdated',
          header: 'Last Updated',
          cell: item => item.lastUpdated ? formatDateTime(item.lastUpdated) : '-',
          sortingField: 'lastUpdated',
        },
      ]}
      items={items}
      selectionType="single"
      selectedItems={selectedItems}
      onSelectionChange={handleSelectionChange}
      header={
        <Header
          counter={`(${filteredItemsCount})`}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={loadTables}>
                Refresh
              </Button>
              <Button disabled={selectedItems.length === 0} onClick={() => onTableSelect(selectedItems[0])}>
                View records
              </Button>
            </SpaceBetween>
          }
        >
          Database Tables
        </Header>
      }
      filter={
        <TextFilter
          {...filterProps}
          filteringPlaceholder="Find tables"
          countText={`${filteredItemsCount} matches`}
        />
      }
      pagination={<Pagination {...paginationProps} />}
    />
  );
};

export default TablesList;