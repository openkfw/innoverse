import { Common, Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => {
  const route: Common.Route = {
    method: "GET",
    path: "/health",
    handler: (ctx) => {
      ctx.body = { status: "ready" };
    },
    info: {
      pluginName: "healthcheck",
    },
    config: {
      auth: false,
    },
  };
  strapi.server.routes({ type: "admin", routes: [route] });
};
