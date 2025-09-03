#!/bin/bash
# Script simple para probar el frontend (sin jq)

BASE_URL="http://localhost:3000/api"
COOKIE_JAR="cookies.txt"

echo "🧪 Test simple de TaskLists API"
echo "================================"

# Limpiar cookies
rm -f $COOKIE_JAR

echo "1. Health check..."
curl -s "$BASE_URL/health"
echo ""

echo "2. Login (usando credenciales existentes)..."
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",  
    "password": "password123"
  }' \
  -c $COOKIE_JAR
echo ""

echo "3. Obtener todas las tareas..."
curl -s "$BASE_URL/tasks" \
  -b $COOKIE_JAR
echo ""

echo "4. Obtener todas las listas..."
curl -s "$BASE_URL/task-lists" \
  -b $COOKIE_JAR
echo ""

# Limpiar
rm -f $COOKIE_JAR
