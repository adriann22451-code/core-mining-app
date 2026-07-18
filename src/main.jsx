import React from "react";
import ReactDOM from "react-dom/client";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import CoreMiningApp from "./CoreMiningApp.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl="https://core-mining-app.vercel.app/tonconnect-manifest.json">
      <CoreMiningApp />
    </TonConnectUIProvider>
  </React.StrictMode>
);
