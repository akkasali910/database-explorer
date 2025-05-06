Database Explorer Application - Changes Summary

## API Endpoint Changes
- Updated API base URL from '/api' to '/api/explorer'
- All API endpoints now follow the pattern '/api/explorer/...'

## Application Name Changes
- Updated application name from 'Tables Explorer' to 'Database Explorer'
- Updated package.json name to 'database-explorer'

## Updated Files
- src/services/dataService.ts - Updated API base URL
- src/components/Header.tsx - Updated title
- src/components/Footer.tsx - Updated copyright text
- src/components/TablesExplorer.tsx - Updated navigation header
- README.md - Updated API endpoint documentation
- package.json - Updated application name

## API Endpoints
- List tables: '/api/explorer/tables'
- Get table schema: '/api/explorer/tables/{tableName}/schema'
- List records: '/api/explorer/tables/{tableName}/records'
- Get record: '/api/explorer/tables/{tableName}/records/{recordId}'
- Create record: '/api/explorer/tables/{tableName}/records'
- Update record: '/api/explorer/tables/{tableName}/records/{recordId}'
- Delete record: '/api/explorer/tables/{tableName}/records/{recordId}'
