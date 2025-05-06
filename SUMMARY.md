# Database Explorer Application

## Overview
This application is a generic database explorer built with React, TypeScript, and AWS Cloudscape Design System. It allows users to browse database tables, view records, and edit data with a professional user interface.

## API Integration
The application connects directly to the following API endpoint:
```
https://4uqc08pq93.execute-api.eu-west-1.amazonaws.com/api/explorer
```

## Features
- Browse database tables
- View records in a selected table
- View and edit record details
- Create new records
- Delete records
- Filter and sort data
- Responsive design

## Components
- **TablesExplorer**: Main component that orchestrates the application
- **TablesList**: Displays available database tables
- **RecordsList**: Shows records in a selected table
- **RecordDetails**: Displays and allows editing of a record

## Technical Implementation
- **React & TypeScript**: For type-safe development
- **AWS Cloudscape Design System**: For professional UI components
- **Axios**: For API requests
- **React Hooks**: For state management

## How to Run
```bash
cd /Users/aliakkas/apps/vscode/tables-explorer
./start.sh
```

## Notes
- Some API endpoints may require authentication
- The application includes fallbacks for missing schema information
- Error handling is implemented throughout the application
