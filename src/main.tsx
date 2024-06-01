import ReactDOM from 'react-dom/client';
import './index.scss';
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { KobbleProvider } from "@kobbleio/react";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://45ff375eab442716790fbea95a8b1e49@o4504435541409792.ingest.us.sentry.io/4507356778397696",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  // tracePropagationTargets: ["localhost", /^https:\/\/3d-pages\.com/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <KobbleProvider
    domain={import.meta.env.VITE_KOBBLE_DOMAIN}
    clientId={import.meta.env.VITE_KOBBLE_CLIENT_ID}
    redirectUri={import.meta.env.VITE_KOBBLE_REDIRECT_URI}
  >
    <RouterProvider router={router} />
  </KobbleProvider>
);