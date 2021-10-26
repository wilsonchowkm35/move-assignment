FROM node:16.5.0-alpine AS development

MAINTAINER wilson.chow

WORKDIR /app

COPY package*.json ./

RUN npm install glob rimraf
RUN npm install --force --production=false

COPY . .

RUN npm run build

FROM node:alpine AS production

ARG DB_PASS
ARG DB_USER

ENV USER=${DB_USER}
ENV PASS=${DB_PASS}
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

COPY --from=development /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]

