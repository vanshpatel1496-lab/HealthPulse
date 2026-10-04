import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment from current dir or workspace root
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const EnvSchema = z.object({
  PORT: z
    .string()
    .default('3001')
    .transform((val) => parseInt(val, 10)),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_LIVE_CALLS_ENABLED: z
    .string()
    .default('false')
    .transform((val) => val.toLowerCase() === 'true' || val === '1'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  UPLOAD_MAX_FILE_SIZE_MB: z
    .string()
    .default('25')
    .transform((val) => parseInt(val, 10)),
});

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
