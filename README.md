# Net Worth Tool

## Local development

System requirements:

- node 26.x
- npm 11.x
- Docker

Set the following environment variables in `.env`

```
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET # should be generated
DATABASE_URL="postgresql://admin:password@localhost:5432/db?schema=public"
```

To start

```
npm i
docker compose up -d
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```
