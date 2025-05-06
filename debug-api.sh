#!/bin/bash
# Script to test API endpoints for the Database Explorer application

API_BASE_URL="https://4uqc08pq93.execute-api.eu-west-1.amazonaws.com/api/explorer"
TABLE_NAME="employees"
RECORD_ID="1"

echo "=== Database Explorer API Debug Tool ==="
echo ""

# Test tables endpoint
echo "Testing GET /tables endpoint..."
curl -s "$API_BASE_URL/tables" | head -n 20
echo -e "\n\n"

# Test table schema endpoint
echo "Testing GET /tables/$TABLE_NAME endpoint..."
curl -s "$API_BASE_URL/tables/$TABLE_NAME" | head -n 20
echo -e "\n\n"

# Test records endpoint
echo "Testing GET /tables/$TABLE_NAME/records endpoint..."
curl -s "$API_BASE_URL/tables/$TABLE_NAME/records" | head -n 20
echo -e "\n\n"

# Test single record endpoint
echo "Testing GET /tables/$TABLE_NAME/records/$RECORD_ID endpoint..."
curl -s "$API_BASE_URL/tables/$TABLE_NAME/records/$RECORD_ID"
echo -e "\n\n"

# Test update record endpoint (dry run)
echo "Testing PUT /tables/$TABLE_NAME/records/$RECORD_ID endpoint (dry run)..."
echo "Would send: { \"name\": \"Updated Name\", \"department\": \"Engineering\" }"
echo -e "\n"

# Test create record endpoint (dry run)
echo "Testing POST /tables/$TABLE_NAME/records endpoint (dry run)..."
echo "Would send: { \"name\": \"New Employee\", \"department\": \"Marketing\" }"
echo -e "\n"

echo "=== Debug Complete ==="
echo "To test update/create operations, uncomment the relevant sections in this script."
