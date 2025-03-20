ARG NODE_VERSION=20

################################################################################
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

################################################################################
FROM base as deps

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

################################################################################
FROM deps as build

COPY . .
RUN yarn prisma generate
RUN yarn build

################################################################################
FROM base as final

ENV NODE_ENV production

USER node

COPY tsconfig.json ./

COPY package.json yarn.lock ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 4200

CMD ["yarn", "start"]
