# gbc_course_selector

This is a second build of the George Brown College course selector app.

It uses Next.js, Drizzle, and Postgres to search George Brown Continuing Education course data.

## Database

The app connects through a single `POSTGRES_URL` environment variable, so changing providers does not require application code changes.

This project is set up to work with Neon:

1. Create a Neon project and database.
2. Copy the Neon connection string into `POSTGRES_URL`.
3. Use the same `POSTGRES_URL` locally and in your hosting provider.

Example:

```env
POSTGRES_URL=postgresql://username:password@ep-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

The scraper-owned schema contract is documented in [COURSE_SCRAPER_SCHEMA.md](/Users/michalmalyska/Projects/gbc_course_selector/COURSE_SCRAPER_SCHEMA.md).

## Local development

```bash
pnpm install
pnpm dev
```
