// src/environments/environment.ts
import 'dotenv/config'

export const environment = {
  production: false,
  apiKey: process.env['API_KEY'] || 'default_api_key'
};
