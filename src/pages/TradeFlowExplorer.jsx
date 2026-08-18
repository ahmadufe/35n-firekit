import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// FILE: pages/TradeFlowExplorer.jsx  (FALLBACK VERSION)
// Trade Flow Explorer - 35N Ventures
//
// Use this ONLY if the full inline version is too large to paste into Base44.
//
// How it works: the HTML file you already uploaded to Base44 is served with a
// header that tells the browser to download it instead of display it. fetch()
// ignores that header, so we read the file as text and hand it to an iframe
// via srcDoc - which renders it instead of downloading it.
//
// STEP 1: upload gulf-egypt-trade-flows.html to Base44 file storage.
// STEP 2: copy its public URL and paste it into TOOL_URL below.
// ---------------------------------------------------------------------------

const TOOL_URL = "https://media.base44.com/files/public/695a4c3829d04b83a5c959f0/a33785ea9_gulf-egypt-trade-flows1.html";

export default function TradeFlowExplorer() {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    fetch(TOOL_URL)
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then((t) => {
        if (alive) setHtml(t);
      })
      .catch((e) => {
        if (alive) setError(String(e.message || e));
      });
    return () => {
      alive = false;
    };
  }, []);

  if (error) {
    return (
      <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif", color: "#B91C1C" }}>
        Could not load the tool: {error}
        <div style={{ color: "#64748B", marginTop: 8, fontSize: 13 }}>
          This usually means the file URL is wrong or the storage bucket blocks
          cross-origin reads. If so, use the full inline version instead.
        </div>
      </div>
    );
  }

  if (!html) {
    return (
      <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif", color: "#64748B" }}>
        Loading Trade Flow Explorer...
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "calc(100vh - 64px)", minHeight: "600px" }}>
      <iframe
        title="Trade Flow Explorer"
        srcDoc={html}
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
      />
    </div>
  );
}