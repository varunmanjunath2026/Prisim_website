// Works out where the site lives, so paths work both on a root domain
// (https://prisim.co.in/) and in a sub-folder (https://user.github.io/Prisim_website/).
// Sets window.__PB to "" or e.g. "/Prisim_website". This file sits in the site root.
(() => {
  const src = document.currentScript && document.currentScript.src;
  window.__PB = src ? new URL(".", src).pathname.replace(/\/$/, "") : "";
})();
