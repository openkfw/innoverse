# Strapi healthcheck plugin

Creates an endpoint `GET /health`

If strapi is ready, it returns the http status `200 (OK)` and this body:

```json
{ "status": "ready" }
```

Otherwise, the endpoint is not reachable
