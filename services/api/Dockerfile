FROM node:20-alpine

RUN apk add --no-cache git

WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

EXPOSE 4000
CMD ["yarn", "start"]
