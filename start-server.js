/**
 * Script para iniciar el servidor con verificaciones, chatgpt para ir más rápido
 *hay que ejecutar: node start-server.js (cmd)
 */

require("dotenv").config();

// Verificar variables de entorno
console.log("Verificando configuración...\n");

if (!process.env.MONGODB_URI) {
  console.error("ERROR: MONGODB_URI no está definida en .env");
  console.log("Agrega: MONGODB_URI=tu_uri_de_mongodb\n");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET no está definida en .env");
  console.log("Agrega: JWT_SECRET=tu_secret_key_segura\n");
  process.exit(1);
}

console.log("Variables de entorno configuradas");
console.log(`   MongoDB URI: ${process.env.MONGODB_URI.substring(0, 20)}...`);
console.log(`   JWT Secret: ${process.env.JWT_SECRET ? "✅ Configurado" : "❌ No configurado"}`);
console.log(`   Puerto: ${process.env.PORT || 3000}\n`);

// Verificar dependencias
console.log("🔍 Verificando dependencias...\n");

try {
  require("ejs");
  require("express-session");
  require("cookie-parser");
  console.log("Todas las dependencias están instaladas\n");
} catch (error) {
  console.error("ERROR: Faltan dependencias");
  console.log("   Ejecuta: pnpm install o npm install\n");
  process.exit(1);
}

// Iniciar servidor
console.log("Iniciando servidor...\n");
require("./src/server.js");

