FROM node:20.9.0-alpine as builder
LABEL stage=builder
# compile ts files
COPY . .
RUN npm install
RUN npm run build

FROM node:20.9.0-alpine

WORKDIR /app
RUN chown node:node .
USER node

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
# copy project descriptor(s)
COPY package*.json ./
# install dependencies
RUN npm ci && npm cache clean --force
# copy compiled code
COPY --from=builder dist dist

ARG PORT=3000
EXPOSE $PORT

CMD ["node", "dist/index.js"]
