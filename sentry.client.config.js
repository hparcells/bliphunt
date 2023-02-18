import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://4e76377c64bd473a996a035d0c2f4c06@o187283.ingest.sentry.io/4504697052069888',
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  replaysOnErrorSampleRate: 1.0,
  integrations: [new Sentry.Replay()],
  beforeSend(event, hint) {
    if (event.exception) {
      Sentry.showReportDialog({ eventId: event.event_id });
    }
    return event;
  }
});
