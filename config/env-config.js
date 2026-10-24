require('dotenv').config();

module.exports = {
  // Databases
  // MongoDB is the only database in this project.
  database_mongo: {
    // MONGO_URI is the primary source. If missing, it is built from the parts below.
    uri: process.env.MONGO_URI || '',
    port: process.env.MONGO_PORT || 27017,
    user: process.env.MONGO_USER || '',
    pass: process.env.MONGO_PASS || '',
    host: process.env.MONGO_HOST || 'localhost',
    name: process.env.MONGO_DB_NAME || 'clinic',
    reconnectStrategy: process.env.CACHE_DB_RECOUNECTION || true
  },

  database_redis: {
    url: process.env.CACHE_URL || '',
    port: process.env.CACHE_DB_PORT || 6379,
    user: process.env.CACHE_DB_USER || '',
    pass: process.env.CACHE_DB_PASS || '',
    host: process.env.CACHE_DB_HOST || 'localhost',
    name: process.env.CACHE_DB_NAME || '0',
    secret: process.env.CACHE_SESSION_SECRET || 'super_redis_secret_key',
    reconnectStrategy: process.env.CACHE_DB_RECOUNECTION || true
  },

  // Server & CORS & Middlewares & Env
  server: {
    global: {
      port: process.env.PORT || 3000,
      env: process.env.NODE_ENV || 'development',
      public_file: process.env.PUBLIC_FILE || 'public',
      backup: process.env.BACKUP_DIR || 'backups',
      ssr: process.env.SSR === 'true' || false,
    },

    // Super Admin Account
    admin: {
      email: process.env.ADMIN_MAIL || 'admin@app.com',
      password: process.env.ADMIN_PASS || 'Admin123456!',
      username: process.env.ADMIN_USER || 'SuperAdmin',
      phone: process.env.ADMIN_PHONE || '+200000000000'
    },

    cors: {
      origins: process.env.CORS_DOMAINS ? process.env.CORS_DOMAINS.split(',') : ['http://localhost:3000', 'http://localhost:5173'],
      credentials: process.env.CORS_CREDENTIALS === 'true' || true,
      httpOnly: process.env.CORS_HTTP_ONLY === 'true' || true,
      maxAge: parseInt(process.env.CORS_MAX_AGE) || 86400
    }
  },

  // Upload Files
  upload: {
    uploadDir: process.env.UPLOAD_DIR || 'uploads/',
    size_file: parseInt(process.env.UPLOAD_SIZE) || 5 * 1024 * 1024,
    allowedMimeTypes: process.env.UPLOAD_FILTER_MIMETYPE 
      ? process.env.UPLOAD_FILTER_MIMETYPE.split(',') 
      : ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    
    cloudinary: {
      name: process.env.CLOUDINARY_CLOUD_NAME || '',
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      secret: process.env.CLOUDINARY_API_SECRET || '',
    }
  },

  // Auth & Bcrypt
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET || 'super_jwt_access_secret_key',
      expires_in: process.env.JWT_EXPIRES_IN || '1d',
      refresh_secret: process.env.JWT_REFRESH_SECRET || 'super_jwt_refresh_secret_key',
      refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    },
    bcrypt: {
      salt: parseInt(process.env.SALT_ROUNDS) || 12
    }
  },

  // AI Configuration
  ai: {
    baseUrl: process.env.BASEURL || 'https://openrouter.ai/api/v1',
    key: process.env.OPENROUTER_API_KEY || '',
    urlSite: process.env.SITE_URL || 'http://localhost:5000',
    siteName: process.env.SITE_NAME || 'Doctory App',
    modelName: process.env.MODEL_NAME || 'anthropic/claude-3.5-sonnet',
    temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
    max_tokens: parseInt(process.env.MAX_TOKENS) || 1000
  },

  // RATELIMITE Configuration
  security: {
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100
  },

  //EMAIL Configuration
  email:{
    host:process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port:parseInt(process.env.EMAIL_PORT) || 2525,
    user:process.env.EMAIL_USER || '',
    pass:process.env.EMAIL_PASS || '',
    from:process.env.EMAIL_FROM || 'no-reply@app.com'
  },

  logging:{
    dir: process.env.NODE_ENV === 'production' ? process.env.LOG_DIR: 'logs',
    level:process.env.NODE_ENV === 'production' ? process.env.LEVEL :'info'
  }
};