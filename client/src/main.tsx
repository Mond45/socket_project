import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router-dom";
import "@fontsource/inter";
import "./index.css";

import routes from "~react-pages";
import { SocketProvider } from "./socketProvider";

export function App() {
  return <Suspense fallback={<p>Loading...</p>}>{useRoutes(routes)}</Suspense>;
}

const app = createRoot(document.getElementById("root")!);

app.render(
  <StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <App />
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>
);
