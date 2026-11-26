FROM dhi.io/node:26.13.1-alpine3.24-dev AS migrator
# Need dev image to run npx

WORKDIR /app

COPY package.json prisma7.config.ts ./
COPY node_modules ./node_modules
COPY prisma ./prisma

CMD ["npx", "prisma", "migrate", "deploy"]

FROM dhi.io/node:26.13.1-alpine3.24 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Assumes "npm ci", "npm run build", and "npx prisma generate" were already run
COPY --chown=node:node /.next/standalone ./
COPY --chown=node:node /.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]