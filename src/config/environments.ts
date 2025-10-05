import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuraciones por entorno
const environments = {
  development: {
    // Base de datos
    DB_HOST_DEV: process.env.DB_HOST_DEV,
    DB_USER_DEV: process.env.DB_USER_DEV,
    DB_PASSWORD_DEV: process.env.DB_PASSWORD_DEV,
    DB_NAME_DEV: process.env.DB_NAME_DEV,
    
    // Servidor
    PORT_DEV: process.env.PORT_DEV,
    NODE_ENV_DEV: process.env.NODE_ENV_DEV,
    
    // CORS
    FRONTEND_URL_DEV: process.env.FRONTEND_URL_DEV,
    
    // Logs
    LOG_LEVEL_DEV: process.env.LOG_LEVEL_DEV
  },
  
  production: {
    // Base de datos
    DB_HOST_PROD: process.env.DB_HOST_PROD,
    DB_USER_PROD: process.env.DB_USER_PROD,
    DB_PASSWORD_PROD: process.env.DB_PASSWORD_PROD,
    DB_NAME_PROD: process.env.DB_NAME_PROD,
    
    // Servidor
    PORT_PROD: process.env.PORT_PROD,
    NODE_ENV_PROD: process.env.NODE_ENV_PROD,
    
    // CORS
    FRONTEND_URL_PROD: process.env.FRONTEND_URL_PROD,
    
    // Logs
    LOG_LEVEL_PROD: process.env.LOG_LEVEL_PROD
  }
};

// Obtener el entorno actual
const currentEnv = (process.env.NODE_ENV as keyof typeof environments) || 'development';

// Configuración actual
const config = {
  // Base de datos
  DB_HOST: process.env.DB_HOST || (currentEnv === 'production' ? environments.production.DB_HOST_PROD : environments.development.DB_HOST_DEV),
  DB_USER: process.env.DB_USER || (currentEnv === 'production' ? environments.production.DB_USER_PROD : environments.development.DB_USER_DEV),
  DB_PASSWORD: process.env.DB_PASSWORD || (currentEnv === 'production' ? environments.production.DB_PASSWORD_PROD : environments.development.DB_PASSWORD_DEV),
  DB_NAME: process.env.DB_NAME || (currentEnv === 'production' ? environments.production.DB_NAME_PROD : environments.development.DB_NAME_DEV),
  
  // Servidor
  PORT: process.env.PORT ? parseInt(process.env.PORT) : (currentEnv === 'production' ? environments.production.PORT_PROD : environments.development.PORT_DEV),
  NODE_ENV: process.env.NODE_ENV || (currentEnv === 'production' ? environments.production.NODE_ENV_PROD : environments.development.NODE_ENV_DEV),
  
  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || (currentEnv === 'production' ? environments.production.FRONTEND_URL_PROD : environments.development.FRONTEND_URL_DEV),
  
  // Logs
  LOG_LEVEL: process.env.LOG_LEVEL || (currentEnv === 'production' ? environments.production.LOG_LEVEL_PROD : environments.development.LOG_LEVEL_DEV)
};

// Función para obtener la configuración
export function getConfig() {
  return config;
}

// Función para obtener configuración de base de datos
export function getDatabaseConfig() {
  return {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME
  };
}

// Función para obtener configuración de CORS
export function getCorsConfig() {
  return {
    origin: config.FRONTEND_URL ? [config.FRONTEND_URL] : ['*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
}

// Función para mostrar la configuración actual
export function displayConfig() {
  console.log(`\n🔧 Configuración actual:`);
  console.log(`📊 Entorno: ${config.NODE_ENV}`);
  console.log(`🌐 Puerto: ${config.PORT}`);
  console.log(`🗄️  Base de datos: ${config.DB_NAME}@${config.DB_HOST}`);
  console.log(`🔗 Frontend: ${config.FRONTEND_URL}`);
  console.log(`📝 Log level: ${config.LOG_LEVEL}\n`);
}

export default config;
