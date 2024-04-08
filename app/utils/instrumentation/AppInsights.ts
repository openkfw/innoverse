import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

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

const appInsights = new ApplicationInsights({
  config: {
    connectionString: process.env.NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING,
    instrumentationKey: process.env.NEXT_PUBLIC_APP_INSIGHTS_INSTRUMENTATION_KEY,
    disableTelemetry: process.env.NODE_ENV !== 'production',
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history: browserHistory },
    },
  },
});
if (typeof window !== 'undefined') {
  appInsights.loadAppInsights();
}
export { appInsights, reactPlugin };
