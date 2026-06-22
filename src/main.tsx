import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AffiliateApp from "./affiliate/AffiliateApp.tsx";
import "./index.css";

const params =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : null;

const isAffiliatePath =
  typeof window !== "undefined" &&
  window.location.pathname.replace(/\/$/, "") === "/affiliate" ||
  (typeof window !== "undefined" && window.location.pathname.startsWith("/affiliate/"));

const isAffiliateHost =
  typeof window !== "undefined" &&
  (/^affiliates?\./i.test(window.location.hostname) ||
    params?.get("affiliate") === "1" ||
    isAffiliatePath);

// Redirect deep affiliate paths landing on the main domain (because the
// affiliates.* subdomain is forced to redirect to the primary domain) over
// to the /affiliate/* path-based portal so users keep their destination.
if (!isAffiliateHost && typeof window !== "undefined") {
  const path = window.location.pathname.replace(/\/$/, "");
  const affiliateOnlyPaths = ["/referrals", "/link", "/earnings"];
  if (affiliateOnlyPaths.includes(path)) {
    window.location.replace("/affiliate" + path + window.location.search + window.location.hash);
  }
}

// Capture ?ref= and signup attribution on the main site so we can link the new signup later
if (!isAffiliateHost && typeof window !== "undefined") {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref) localStorage.setItem("rasgoal_ref_code", ref.trim().toUpperCase());

  // Capture signup attribution (UTM params + referrer) on first landing.
  // Persisted so it survives navigation, email-verification redirect, and OAuth round-trips.
  try {
    const existing = localStorage.getItem("rasgoal_signup_attribution");
    if (!existing) {
      const utm: Record<string, string> = {};
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
        const v = params.get(k);
        if (v) utm[k] = v;
      });
      const referrer = document.referrer || "";
      const landing_path = window.location.pathname + window.location.search;
      if (Object.keys(utm).length > 0 || referrer) {
        localStorage.setItem(
          "rasgoal_signup_attribution",
          JSON.stringify({ ...utm, referrer, landing_path, captured_at: new Date().toISOString() })
        );
      }
    }
  } catch {
    /* ignore */
  }
}

createRoot(document.getElementById("root")!).render(
  isAffiliateHost ? <AffiliateApp basename={isAffiliatePath ? "/affiliate" : undefined} /> : <App />
);
