import { registerSW } from "virtual:pwa-register";

export function registerServiceWorker() {
  const update = registerSW({
    onNeedRefresh() {
      window.dispatchEvent(
        new CustomEvent("sp:sw-update-ready", { detail: { update } }),
      );
    },
    onOfflineReady() {
      window.dispatchEvent(new CustomEvent("sp:sw-offline-ready"));
    },
  });
  return update;
}
