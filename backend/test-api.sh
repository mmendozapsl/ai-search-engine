#!/bin/bash

# Simple API test script for AI Search Engine
echo "🧪 Testing AI Search Engine API endpoints..."

BASE_URL="http://localhost:3000"

# Test health check
echo "Testing health check..."
curl -s "$BASE_URL/health" | jq .

echo -e "\nTesting API documentation..."
curl -s "$BASE_URL/api" | jq .message

echo -e "\nTesting user endpoints (will show database errors, which is expected)..."
curl -s "$BASE_URL/api/users" | jq .

echo -e "\nTesting search endpoints (will show database errors, which is expected)..."
curl -s "$BASE_URL/api/search" | jq .

echo -e "\n✅ API tests completed. Database errors are expected without MySQL setup."