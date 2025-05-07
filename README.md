# Database Explorer

A modern database management interface built with React, TypeScript, and AWS Cloudscape Design System.

## Features

- Browse database tables
- View and filter table records
- Create, update, and delete records
- Responsive design using AWS Cloudscape Design System
- Type-safe development with TypeScript

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/akkasali910/database-explorer.git
   cd database-explorer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## API Configuration

The application connects to a REST API at:
```
https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/api/explorer
```

To use a different API, update the `API_BASE_URL` in `src/services/dataService.ts`.

## Project Structure

- `src/components/`: React components
- `src/services/`: API and data services
- `src/types/`: TypeScript interfaces
- `src/utils/`: Utility functions

## Key Components

- `TablesExplorer`: Main component that orchestrates the application
- `TablesList`: Displays available database tables
- `RecordsList`: Shows records in a selected table
- `RecordDetails`: Displays and allows editing of a record

## License

MIT License
