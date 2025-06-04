FROM node:18-alpine
RUN npm install -g pnpm
ENV NODE_ENV production
WORKDIR /opt/
COPY package.json pnpm-lock.yaml ./
RUN pnpm config set fetch-retry-maxtimeout 600000 -g && pnpm install
ENV PATH /opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN chown -R node:node /opt/app
USER node
RUN ["pnpm", "run", "build"]
EXPOSE 1337
CMD ["pnpm", "run", "start"]