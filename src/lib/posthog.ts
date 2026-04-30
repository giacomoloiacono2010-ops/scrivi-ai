/* eslint-disable @typescript-eslint/no-explicit-any */
declare const posthog: any;

export function captureEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  if (typeof posthog !== "undefined") {
    posthog.capture(event, properties);
  }
}

export function identifyUser(userId: string, email: string) {
  if (typeof posthog !== "undefined") {
    posthog.identify(userId, { email });
  }
}