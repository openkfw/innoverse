import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

import { clientConfig, validAppInsightsConfig } from '@/config/client';

const defaultBroserHistory = {
  url: '/',
  location: { pathname: '' },
  state: { url: '' },
  listen: () => {},
};
let browserHistory = defaultBroserHistory;

if (typeof window !== 'undefined') {
  browserHistory = { ...defaultBroserHistory, ...window.history };
  browserHistory.location.pathname = browserHistory?.state?.url;
}
const reactPlugin = new ReactPlugin();
const clickPluginInstance = new ClickAnalyticsPlugin();
const clickPluginConfig = {
  autoCapture: true,
};
const appInsights = new ApplicationInsights({
  config: {
    connectionString: clientConfig.NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING,
    instrumentationKey: clientConfig.NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY,
    disableTelemetry: process.env.NODE_ENV !== 'production',
    extensions: [reactPlugin, clickPluginInstance],
    extensionConfig: {
      [reactPlugin.identifier]: { history: browserHistory },
      [clickPluginInstance.identifier]: clickPluginConfig,
    },
  },
});

console.log('validAppInsightsConfig', validAppInsightsConfig);

if (typeof window !== 'undefined' && validAppInsightsConfig) {
  appInsights.loadAppInsights();
}
export { appInsights, reactPlugin };
