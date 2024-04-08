// Mainly used for Server and API Routes. Refer to AppInsights.ts for client side instrumentation.
// Has to be at the root of the app.
import { AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter';
import { registerOTel } from '@vercel/otel';

export async function register() {
  // required as on bootstrap runs in  runtime 'edge'. App runs in runtime 'nodejs'
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === 'production') {
    registerOTel({
      serviceName: process.env.APP_INSIGHTS_SERVICE_NAME,
      traceExporter: new AzureMonitorTraceExporter({
        connectionString: process.env.NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING,
      }),
    });
  }
}
