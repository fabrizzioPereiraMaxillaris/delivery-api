#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando Delivery API...\n');

// Crear archivo .env si no existe
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('⚠️  Archivo .env no encontrado');
  console.log('📝 Crea un archivo .env con las variables necesarias');
  console.log('📋 Usa .env.example como referencia\n');
} else {
  console.log('✅ Archivo .env encontrado');
}

// Verificar si .env.example existe
if (!fs.existsSync(envExamplePath)) {
  console.log('⚠️  Archivo .env.example no encontrado');
  console.log('📝 Crea un archivo .env.example como referencia\n');
} else {
  console.log('✅ Archivo .env.example encontrado');
}

console.log('\n📋 Instrucciones:');
console.log('1. Asegúrate de tener MySQL instalado y corriendo');
console.log('2. Crea tu archivo .env con las variables necesarias');
console.log('3. Crea tu archivo .env.example como referencia');
console.log('4. Para desarrollo: npm start');
console.log('5. Para producción: npm run prod');
console.log('6. La base de datos se creará automáticamente al iniciar el servidor\n');

console.log('🎉 Configuración completada!');
