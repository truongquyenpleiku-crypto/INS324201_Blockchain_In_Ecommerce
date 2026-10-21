import React, { useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Ready");
  const [loading, setLoading] = useState(false);

  async function getAddress() {
    setLoading(true);
    setStatus("Loading...");
    setAddress("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/getMAddress"
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (typeof data.MAddress !== "string") {
        throw new Error("Invalid API response");
      }

      setAddress(data.MAddress);
      setStatus(`Success - HTTP ${response.status}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Dynamic Merchant Address</h1>
      <p>Generate an Ethereum payment address using HD Wallets.</p>
      <button onClick={getAddress} disabled={loading}>
        {loading ? "Loading..." : "Get Payment Address"}
      </button>
      <p>Status: {status}</p>
      {address && <pre>{JSON.stringify({ MAddress: address }, null, 2)}</pre>}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
