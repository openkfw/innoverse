# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

## setup

based on the[ setup guide](https://docs.strapi.io/dev-docs/quick-start) here but without the `--quickstart`` flag

- start posgres server with docker-compose `docker-compose -f docker-compose.db.yaml up`
- set the correct env vars in the .env file
- then run `npm run build` and `npm start` (for production) or `npm run dev` for development
- then you can open the strapi UI on http://localhost:1337/ and start creating collection types and entries

## setup with docker
 Run the `docker-compose.yml` file in this folder, this builds a new strapi API container along with the postgres container