#!/bin/bash

# Script para probar la API de TurifyTasks sin frontend
# Asegúrate de que el servidor esté corriendo (npm start)

BASE_URL="http://localhost:3000/api"
COOKIE_JAR="cookies.txt"

echo "🚀 Iniciando pruebas de la API de TurifyTasks"
echo "=============================================="

# Limpiar cookies anteriores
rm -f $COOKIE_JAR

echo ""
echo "1️⃣ Probando Health Check..."
curl -s -X GET "$BASE_URL/health" | jq '.'

echo ""
echo "3️⃣ Iniciando sesión..."
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "xxxxxxx",
    "password": "xxxxxx"
  }' \
  -c $COOKIE_JAR | jq '.'

echo ""
echo "4️⃣ Verificando sesión..."
curl -s -X GET "$BASE_URL/auth/me" \
  -b $COOKIE_JAR | jq '.'

echo ""
echo "5️⃣ Creando listas de tareas..."

echo "   📝 Creando lista 'Trabajo'..."
LIST1_RESPONSE=$(curl -s -X POST "$BASE_URL/task-lists" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trabajo",
    "description": "Tareas relacionadas con el trabajo"
  }' \
  -b $COOKIE_JAR)
echo $LIST1_RESPONSE | jq '.'
LIST1_ID=$(echo $LIST1_RESPONSE | jq -r '.data.id')

echo "   📝 Creando lista 'Personal'..."
LIST2_RESPONSE=$(curl -s -X POST "$BASE_URL/task-lists" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Personal",
    "description": "Tareas personales"
  }' \
  -b $COOKIE_JAR)
echo $LIST2_RESPONSE | jq '.'
LIST2_ID=$(echo $LIST2_RESPONSE | jq -r '.data.id')

echo ""
echo "6️⃣ Obteniendo todas las listas..."
curl -s -X GET "$BASE_URL/task-lists" \
  -b $COOKIE_JAR | jq '.'

echo ""
echo "7️⃣ Creando tareas en las listas..."

echo "   ✅ Tarea en lista Trabajo..."
TASK1_RESPONSE=$(curl -s -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Completar proyecto\",
    \"description\": \"Finalizar el desarrollo del proyecto X\",
    \"priority\": \"alta\",
    \"due_date\": \"2024-09-10\",
    \"list_id\": $LIST1_ID
  }" \
  -b $COOKIE_JAR)
echo $TASK1_RESPONSE | jq '.'

echo "   ✅ Tarea en lista Personal..."
TASK2_RESPONSE=$(curl -s -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Comprar víveres\",
    \"description\": \"Ir al supermercado\",
    \"priority\": \"media\",
    \"list_id\": $LIST2_ID
  }" \
  -b $COOKIE_JAR)
echo $TASK2_RESPONSE | jq '.'

echo "   ✅ Tarea sin lista (huérfana)..."
TASK3_RESPONSE=$(curl -s -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tarea sin lista",
    "description": "Esta tarea no tiene lista asignada",
    "priority": "baja"
  }' \
  -b $COOKIE_JAR)
echo $TASK3_RESPONSE | jq '.'

echo ""
echo "8️⃣ Obteniendo todas las tareas..."
curl -s -X GET "$BASE_URL/tasks" \
  -b $COOKIE_JAR | jq '.'

echo ""
echo "9️⃣ Obteniendo tareas de una lista específica..."
curl -s -X GET "$BASE_URL/task-lists/$LIST1_ID/tasks" \
  -b $COOKIE_JAR | jq '.'

echo ""
echo "🔟 Obteniendo tareas huérfanas..."
curl -s -X GET "$BASE_URL/tasks/orphaned" \
  -b $COOKIE_JAR | jq '.'

echo ""
echo "1️⃣1️⃣ Actualizando una lista..."
curl -s -X PUT "$BASE_URL/task-lists/$LIST1_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trabajo Actualizado",
    "description": "Tareas de trabajo con descripción actualizada"
  }' \
  -b $COOKIE_JAR | jq '.'

echo ""
echo "1️⃣2️⃣ Obteniendo estadísticas de tareas..."
curl -s -X GET "$BASE_URL/tasks/stats" \
  -b $COOKIE_JAR | jq '.'

echo ""
echo "1️⃣3️⃣ Probando eliminación de lista..."
echo "   📝 Creando lista temporal para eliminar..."
LIST_TEMP_RESPONSE=$(curl -s -X POST "$BASE_URL/task-lists" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lista Temporal",
    "description": "Para probar eliminación"
  }' \
  -b $COOKIE_JAR)
LIST_TEMP_ID=$(echo $LIST_TEMP_RESPONSE | jq -r '.data.id')

echo "   🗑️ Eliminando lista temporal..."
curl -s -X DELETE "$BASE_URL/task-lists/$LIST_TEMP_ID" \
  -b $COOKIE_JAR | jq '.'

echo ""
echo "1️⃣4️⃣ Estado final - Todas las listas:"
curl -s -X GET "$BASE_URL/task-lists" \
  -b $COOKIE_JAR | jq '.'

echo ""
echo "✅ Pruebas completadas!"
echo "=============================================="

# Limpiar cookies
rm -f $COOKIE_JAR
