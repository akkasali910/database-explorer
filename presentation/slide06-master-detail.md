# Master-Detail Pattern

- **Tables List**: Browse available database tables
- **Records List**: View records in selected table
- **Record Details**: View and edit individual records
- **Seamless Navigation**: Intuitive flow between views
- **State Management**: React useState for view state

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Tables List    │────▶│  Records List   │────▶│  Record Details │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                      ▲                       ▲
        │                      │                       │
        └──────────────────────┴───────────────────────┘
                          Back Navigation
```