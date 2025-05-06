# Key TypeScript Interfaces

```typescript
export interface TableMetadata {
  name: string;
  displayName?: string;
  description?: string;
  type?: string;
}

export interface ColumnMetadata {
  name: string;
  displayName: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isNullable: boolean;
}

export interface TableSchema {
  tableName: string;
  columns?: ColumnMetadata[];
  schema?: any;
}

export interface Record {
  [key: string]: any;
}
```