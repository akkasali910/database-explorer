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
  Modal,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { TableMetadata, TableSchema, Record } from '../types/types';
import { fetchRecords, fetchTableSchema, deleteRecord } from '../services/dataService';
import { formatValue } from '../utils/formatters';

interface RecordsListProps {
  table: TableMetadata;
  onRecordSelect: (record: Record) => void;
  onBack: () => void;
}

const RecordsList: React.FC<RecordsListProps> = ({ table, onRecordSelect, onBack }) => {
  const [records, setRecords] = useState<Record[]>([]);
  const [schema, setSchema] = useState<TableSchema | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<Record[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recordToDelete, setRecordToDelete] = useState<Record | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching data for table ${table.name}...`);
      
      try {
        const schemaData = await fetchTableSchema(table.name);
        console.log(`Received schema for table ${table.name}:`, schemaData);
        setSchema(schemaData);
      } catch (schemaErr) {
        console.error(`Failed to load schema for table ${table.name}:`, schemaErr);
        // Continue with records fetch even if schema fails
      }
      
      try {
        const recordsData = await fetchRecords(table.name);
        console.log(`Received ${recordsData.length} records for table ${table.name}`);
        setRecords(recordsData);
      } catch (recordsErr: any) {
        console.error(`Failed to load records for table ${table.name}:`, recordsErr);
        setError(`Failed to load records for table ${table.name}. ${recordsErr.message || 'Please try again later.'}`);
        setRecords([]);
      }
    } catch (err) {
      console.error(`Failed to load data for table ${table.name}:`, err);
      setError(`Failed to load data for table ${table.name}. Please check the API endpoint configuration.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [table.name]);

  const handleDeleteClick = (record: Record) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!schema || !recordToDelete) return;
    
    const primaryKey = schema.columns?.find(col => col.isPrimaryKey);
    if (!primaryKey) {
      setError('Cannot delete record: No primary key found in schema');
      setShowDeleteModal(false);
      return;
    }
    
    try {
      await deleteRecord(table.name, recordToDelete[primaryKey.name]);
      setRecords(records.filter(r => r[primaryKey.name] !== recordToDelete[primaryKey.name]));
      setShowDeleteModal(false);
      setRecordToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete record:', err);
      setError(`Failed to delete record: ${err.message}`);
      setShowDeleteModal(false);
    }
  };

  const { items, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
    records,
    {
      filtering: {
        empty: (
          <Box textAlign="center" color="inherit">
            <b>No records</b>
            <Box padding={{ bottom: 's' }} variant="p" color="inherit">
              {error ? (
                <Alert type="error" header="Error loading records">
                  {error}
                  <Box padding={{ top: 's' }}>
                    <Button onClick={loadData}>Try Again</Button>
                  </Box>
                </Alert>
              ) : (
                `No records in table ${table.displayName || table.name}.`
              )}
            </Box>
          </Box>
        ),
        noMatch: (
          <Box textAlign="center" color="inherit">
            <b>No matches</b>
            <Box padding={{ bottom: 's' }} variant="p" color="inherit">
              No records matched the filter.
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
      onRecordSelect(event.detail.selectedItems[0]);
    }
  };

  const getColumnDefinitions = () => {
    if (!schema || !schema.columns) {
      // If schema is not available, use the first record to determine columns
      if (records.length > 0) {
        const firstRecord = records[0];
        return Object.keys(firstRecord).slice(0, 5).map(key => ({
          id: key,
          header: key,
          cell: (item: Record) => {
            const value = item[key];
            if (value === null || value === undefined) return '-';
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value);
          },
          sortingField: key
        }));
      }
      return [];
    }
    
    // Get primary key column
    const primaryKeyColumn = schema.columns.find(col => col.isPrimaryKey);
    
    // Start with primary key column if it exists
    const columns = primaryKeyColumn 
      ? [{ 
          id: primaryKeyColumn.name, 
          header: primaryKeyColumn.displayName || primaryKeyColumn.name,
          cell: (item: Record) => formatValue(item[primaryKeyColumn.name], primaryKeyColumn.type),
          sortingField: primaryKeyColumn.name
        }] 
      : [];
    
    // Add up to 4 more columns (excluding primary key if already added)
    const additionalColumns = schema.columns
      .filter(col => !col.isPrimaryKey)
      .slice(0, 4)
      .map(column => ({
        id: column.name,
        header: column.displayName || column.name,
        cell: (item: Record) => formatValue(item[column.name], column.type),
        sortingField: column.name
      }));
    
    return [...columns, ...additionalColumns];
  };

  // Check if the table has a primary key
  const hasPrimaryKey = schema?.columns?.some(col => col.isPrimaryKey);

  return (
    <>
      <Table
        {...collectionProps}
        loading={loading}
        loadingText={`Loading records from ${table.name}`}
        columnDefinitions={getColumnDefinitions()}
        items={items}
        selectionType="single"
        selectedItems={selectedItems}
        onSelectionChange={handleSelectionChange}
        header={
          <Header
            counter={`(${filteredItemsCount})`}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={onBack}>
                  Back to Tables
                </Button>
                <Button onClick={loadData}>
                  Refresh
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => onRecordSelect({ isNew: true })}
                  disabled={!hasPrimaryKey}
                  title={!hasPrimaryKey ? "Table must have a primary key to create records" : undefined}
                >
                  Create Record
                </Button>
                <Button 
                  disabled={selectedItems.length === 0} 
                  onClick={() => onRecordSelect(selectedItems[0])}
                >
                  View details
                </Button>
                <Button 
                  disabled={selectedItems.length === 0 || !hasPrimaryKey}
                  variant="normal"
                  onClick={() => handleDeleteClick(selectedItems[0])}
                  title={!hasPrimaryKey ? "Table must have a primary key to delete records" : undefined}
                >
                  Delete
                </Button>
              </SpaceBetween>
            }
          >
            {table.displayName || table.name} Records
          </Header>
        }
        filter={
          <TextFilter
            {...filterProps}
            filteringPlaceholder="Find records"
            countText={`${filteredItemsCount} matches`}
          />
        }
        pagination={<Pagination {...paginationProps} />}
      />

      {!hasPrimaryKey && records.length > 0 && (
        <Alert type="info" header="Table has no primary key">
          This table does not have a primary key defined. Some operations like viewing record details, creating, or deleting records may not be available.
        </Alert>
      )}

      {/* Delete confirmation modal */}
      <Modal
        visible={showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        header="Confirm deletion"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        Are you sure you want to delete this record? This action cannot be undone.
      </Modal>
    </>
  );
};

export default RecordsList;