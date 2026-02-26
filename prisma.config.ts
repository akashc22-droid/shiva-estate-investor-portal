import { defineConfig } from 'prisma/config'

// Prisma 7.x configuration
// Note: DATABASE_URL is read from process.env by the pg Pool in lib/prisma/client.ts
// and prisma/seed.ts at runtime.
export default defineConfig({
    schema: './prisma/schema.prisma',
})
