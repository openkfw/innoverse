# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

## Setup

Based on the [official strapi setup guide](https://docs.strapi.io/dev-docs/quick-start) here but without the `--quickstart`` flag

- set the correct env vars in the .env file
- then run `pnpm run build` and `pnpm start` (for production) or `pnpm run dev` for development
- then you can open the strapi UI on http://localhost:1337/ and start creating collection types and entries

## Setup with docker

Run the `docker-compose.yml` in the root folder to start strapi and optionally other services

## Add Collection Types

Add a new folder in the `./src/api` folder (similar to e.g. `/test`), with the following files: a schema.json file, a controller, a route and a service. Then you need to run `pnpm run strapi ts:generate-types` to generate the necessary types.

## Export & Import

Using the command `pnpm run strapi export -- --no-encrypt --file my-strapi-export` you can create an export from strapi, which includes all types and entities. Optionally you can set an encryption key for more security.

This exported file can be imported e.g. in a new strapi instance using the command `pnpm run strapi import -- --file my-strapi-export.tar.gz`.
