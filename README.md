# Net Worth Tool

## Local development

System requirements:

- node 25.x
- npm 11.x
- Docker

Set the following environment variables

In .env.local

```
MONGODB_URI=mongodb://127.0.0.1:27017/dev?replicaSet=rs0
```

in .env

```
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET # should be generated
```

To start

```
npm i
docker compose up -d
npm run seed # If you want to populate database with data
npm run dev
```
