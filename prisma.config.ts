import 'dotenv/config'
import { defineConfig } from 'prisma/config'

// Prisma 7.x configuration.
// - When DATABASE_URL is set: migrate + generate work fully.
// - When DATABASE_URL is absent (demo / Vercel without DB): only generate works;
//   migrate commands will fail with a clear message.
const databaseUrl = process.env.DATABASE_URL

export default defineConfig({
    schema: './prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    ...(databaseUrl ? { datasource: { url: databaseUrl } } : {}),
})
