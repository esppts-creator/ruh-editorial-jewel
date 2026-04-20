// Loads Cashfree v3 JS SDK and returns the cashfree instance.
// Docs: https://www.cashfree.com/docs/payments/online/web/integration

declare global {
  interface Window {
    Cashfree?: (opts: { mode: "sandbox" | "production" }) => CashfreeInstance;
  }
}

export interface CashfreeInstance {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_modal" | "_top";
  }) => Promise<unknown> | void;
}

const SDK_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";
let loaderPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.Cashfree) return Promise.resolve();
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Cashfree SDK")));
      return;
    }
    const s = document.createElement("script");
    s.src = SDK_URL;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loaderPromise = null;
      reject(new Error("Failed to load Cashfree SDK"));
    };
    document.head.appendChild(s);
  });

  return loaderPromise;
}

export async function getCashfree(mode: "sandbox" | "production" = "sandbox"): Promise<CashfreeInstance> {
  await loadScript();
  if (!window.Cashfree) throw new Error("Cashfree SDK not available on window");
  return window.Cashfree({ mode });
}
