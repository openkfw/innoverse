import  { Core }  from "@strapi/strapi";

export default ({ strapi }: { strapi: Core.Strapi }) => {
  const route: Core.Route = {
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
