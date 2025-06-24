// Mainly used for Server and API Routes. Refer to AppInsights.ts for client side instrumentation.
// Has to be at the root of the app.
import { AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter';
import { registerOTel } from '@vercel/otel';

import { clientConfig } from '@/config/client';
import { isAppInsightsConfigured, serverConfig } from '@/config/server';

export async function register() {
  // required as on bootstrap runs in  runtime 'edge'. App runs in runtime 'nodejs'
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (serverConfig.NODE_ENV === 'production' && isAppInsightsConfigured) {
      registerOTel({
        serviceName: serverConfig.APP_INSIGHTS_SERVICE_NAME,
        traceExporter: new AzureMonitorTraceExporter({
          connectionString: clientConfig.NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING,
        }),
        instrumentationConfig: {
          fetch: {
            attributesFromRequestHeaders: {
              'graphql.operation.name': 'graphql-operation-name',
            },
          },
        },
      });
    }
  }
}
