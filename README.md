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

## Containerization

When a build is run on the main branch, new docker images are pushed to ghcr.io.
Both images are tagged with the current git commit hash and latest.

Two containers are created: `net-worth-tracker-runner` and `net-worth-tracker-migrator`.
The migrator handles prisma migrations and the runner contains the actual runtime applicaiton.
The migrator image must be run before the runner image to ensure the postgres schema is up to date.

The migrator container and postgres must be on the same docker network.
Run the migrator container with the following command:

```
docker run \
--network <network> \
-e DATABASE_URL=<postgres-connection-string> \
ghcr.io/jackagtual/net-worth-tracker-migrator:latest
```

The runner container and postgres must be on the same docker network.
Run the container with the following command:

```
docker run -d \
-p <port>:3000 \
--network <network> \
--name <desired-container-name> \
-e BETTER_AUTH_SECRET=<better-auth-secret> \
-e BETTER_AUTH_URL=<app-base-url> \
-e DATABASE_URL=<postgres-url> \
ghcr.io/jackagtual/net-worth-tracker-runner:latest
```
