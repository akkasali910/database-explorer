import React, { useState } from 'react';
import { AppLayout, ContentLayout, SideNavigation } from '@cloudscape-design/components';
import TablesList from './TablesList';
import RecordsList from './RecordsList';
import RecordDetails from './RecordDetails';
import Header from './Header';
import Footer from './Footer';
import { TableMetadata, Record } from '../types/types';

const TablesExplorer: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<TableMetadata | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleTableSelect = (table: TableMetadata) => {
    setSelectedTable(table);
    setSelectedRecord(null);
    setIsEditing(false);
  };

  const handleRecordSelect = (record: Record) => {
    setSelectedRecord(record);
    setIsEditing(record.isNew === true);
  };

  const handleBackToTables = () => {
    setSelectedTable(null);
    setSelectedRecord(null);
    setIsEditing(false);
  };

  const handleBackToRecords = () => {
    setSelectedRecord(null);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const renderContent = () => {
    if (selectedRecord) {
      return (
        <RecordDetails
          tableName={selectedTable!.name}
          record={selectedRecord}
          onBack={handleBackToRecords}
          isEditing={isEditing}
          onEditToggle={handleEditToggle}
        />
      );
    } else if (selectedTable) {
      return (
        <RecordsList
          table={selectedTable}
          onRecordSelect={handleRecordSelect}
          onBack={handleBackToTables}
        />
      );
    } else {
      return <TablesList onTableSelect={handleTableSelect} />;
    }
  };

  return (
    <div className="App">
      <Header />
      <AppLayout
        navigation={
          <SideNavigation
            header={{ text: 'Database Explorer', href: '#' }}
            items={[
              {
                type: 'section',
                text: 'Navigation',
                items: [
                  {
                    type: 'link',
                    text: 'Tables',
                    href: '#tables',
                    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      handleBackToTables();
                    }
                  }
                ]
              },
              {
                type: 'section',
                text: 'Database',
                items: [
                  {
                    type: 'link',
                    text: 'Schema Browser',
                    href: '#schema',
                  },
                  {
                    type: 'link',
                    text: 'Query Editor',
                    href: '#query',
                  },
                  {
                    type: 'link',
                    text: 'Saved Queries',
                    href: '#saved-queries',
                  }
                ]
              },
              {
                type: 'section',
                text: 'Administration',
                items: [
                  {
                    type: 'link',
                    text: 'Settings',
                    href: '#settings',
                  },
                  {
                    type: 'link',
                    text: 'Users',
                    href: '#users',
                  },
                  {
                    type: 'link',
                    text: 'Permissions',
                    href: '#permissions',
                  }
                ]
              }
            ]}
            activeHref="#tables"
          />
        }
        navigationOpen={navigationOpen}
        onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
        content={
          <ContentLayout>
            {renderContent()}
          </ContentLayout>
        }
      />
      <Footer />
    </div>
  );
};

export default TablesExplorer;