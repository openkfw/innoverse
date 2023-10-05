declare global {
  interface Window {
    umami: any;
  }
}

export default function triggerAnalyticsEvent(action: string, project: string, info?: string) {
  if (window && window.umami) {
    window.umami.track(action + '-' + project + (info ? '-' + info : ''));
  }
}
