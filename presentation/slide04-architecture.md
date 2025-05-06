# Architecture Overview

- **Frontend**: React with TypeScript
- **UI Framework**: AWS Cloudscape Design System
- **API Integration**: RESTful API endpoints
- **State Management**: React Hooks
- **Data Fetching**: Axios HTTP client

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  REST API       │────▶│  Database       │
│  (TypeScript)   │◀────│  Endpoints      │◀────│                 │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```