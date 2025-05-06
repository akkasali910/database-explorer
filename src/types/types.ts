export interface TableMetadata {
  name: string;
  displayName?: string;
  description?: string;
  recordCount?: number;
  lastUpdated?: string;
  type?: string;
}

export interface ColumnMetadata {
  name: string;
  displayName: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isNullable: boolean;
  referencedTable?: string;
  referencedColumn?: string;
}

export interface TableSchema {
  tableName: string;
  columns?: ColumnMetadata[];
  schema?: any; // For flexible schema formats
}

export interface Record {
  [key: string]: any;
}

export interface EditableField {
  name: string;
  value: any;
  type: string;
  isRequired: boolean;
  options?: any[];
}