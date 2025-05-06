/**
 * Format a date value for display
 */
export const formatDate = (value: string | Date): string => {
  if (!value) return '';
  
  try {
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(value);
  }
};

/**
 * Format a datetime value for display
 */
export const formatDateTime = (value: string | Date): string => {
  if (!value) return '';
  
  try {
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleString();
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return String(value);
  }
};

/**
 * Format a number value for display
 */
export const formatNumber = (value: number | string): string => {
  if (value === null || value === undefined || value === '') return '';
  
  try {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString();
  } catch (error) {
    console.error('Error formatting number:', error);
    return String(value);
  }
};

/**
 * Format a currency value for display
 */
export const formatCurrency = (value: number | string, currency: string = 'USD'): string => {
  if (value === null || value === undefined || value === '') return '';
  
  try {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(num);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return String(value);
  }
};

/**
 * Format a boolean value for display
 */
export const formatBoolean = (value: boolean | string | number): string => {
  if (value === null || value === undefined) return '';
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (typeof value === 'string') {
    const lowercaseValue = value.toLowerCase();
    if (['true', 'yes', '1', 'y'].includes(lowercaseValue)) {
      return 'Yes';
    }
    if (['false', 'no', '0', 'n'].includes(lowercaseValue)) {
      return 'No';
    }
  }
  
  if (typeof value === 'number') {
    return value === 1 ? 'Yes' : 'No';
  }
  
  return String(value);
};

/**
 * Format any value based on its type
 */
export const formatValue = (value: any, type: string): string => {
  if (value === null || value === undefined) return '';
  
  // Normalize the type to lowercase for comparison
  const normalizedType = type.toLowerCase();
  
  // Handle different data types
  if (normalizedType.includes('date') || normalizedType.includes('timestamp')) {
    return formatDateTime(value);
  }
  
  if (normalizedType.includes('int') || normalizedType === 'number') {
    return formatNumber(value);
  }
  
  if (normalizedType.includes('decimal') || normalizedType.includes('float') || 
      normalizedType.includes('double') || normalizedType.includes('money')) {
    return formatNumber(value);
  }
  
  if (normalizedType === 'boolean' || normalizedType === 'bool') {
    return formatBoolean(value);
  }
  
  if (normalizedType.includes('json') || normalizedType === 'object') {
    return typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
  }
  
  // Default to string representation
  return String(value);
};