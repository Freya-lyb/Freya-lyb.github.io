// Small progressive enhancements. The page works fully without this file.
(function () {
  "use strict";

  // 0) Display settings: theme, text size, high contrast, color-blind mode.
  //    Saved in this visitor's browser only. Defaults follow the OS settings.
  (function displaySettings() {
    var KEY = "display-prefs";
    var root = document.documentElement;
    var btn = document.querySelector(".settings-btn");
    var panel = document.getElementById("display-panel");
    if (!btn || !panel) return;

    var mq = function (q) { return window.matchMedia ? window.matchMedia(q) : { matches: false }; };
    var darkMQ = mq("(prefers-color-scheme: dark)");
    var hcMQ = mq("(prefers-contrast: more)");
    var meta = document.querySelector('meta[name="theme-color"]');

    var prefs = {};
    try { prefs = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
    var save = function () {
      try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {}
    };

    var apply = function () {
      var theme = prefs.theme || "auto";
      root.setAttribute("data-theme", theme === "auto" ? (darkMQ.matches ? "dark" : "light") : theme);
      root.setAttribute("data-contrast", prefs.contrast || (hcMQ.matches ? "high" : "normal"));
      root.setAttribute("data-cvd", prefs.cvd ? "on" : "off");
      root.setAttribute("data-size", prefs.size || "m");
      if (meta) meta.setAttribute("content", getComputedStyle(document.body).backgroundColor);

      // Sync the controls with the current state.
      panel.querySelectorAll('input[name="theme"]').forEach(function (i) { i.checked = i.value === theme; });
      panel.querySelectorAll('input[name="size"]').forEach(function (i) { i.checked = i.value === (prefs.size || "m"); });
      panel.querySelector('input[name="contrast"]').checked = root.getAttribute("data-contrast") === "high";
      panel.querySelector('input[name="cvd"]').checked = !!prefs.cvd;
    };

    panel.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "theme") prefs.theme = t.value;
      else if (t.name === "size") prefs.size = t.value;
      else if (t.name === "contrast") prefs.contrast = t.checked ? "high" : "normal";
      else if (t.name === "cvd") prefs.cvd = t.checked;
      save(); apply();
    });

    panel.querySelector(".panel-reset").addEventListener("click", function () {
      prefs = {};
      try { localStorage.removeItem(KEY); } catch (e) {}
      apply();
    });

    var onOsChange = function () { apply(); };
    [darkMQ, hcMQ].forEach(function (m) {
      if (m.addEventListener) m.addEventListener("change", onOsChange);
      else if (m.addListener) m.addListener(onOsChange);
    });

    // Open / close
    var open = function () {
      panel.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      var first = panel.querySelector("input:checked") || panel.querySelector("input");
      if (first) first.focus();
    };
    var close = function (returnFocus) {
      if (panel.hidden) return;
      panel.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      if (returnFocus) btn.focus();
    };
    btn.addEventListener("click", function () { panel.hidden ? open() : close(true); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(true); });
    document.addEventListener("click", function (e) {
      if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) close(false);
    });

    btn.hidden = false;   // only show the button when JS is running
    apply();
  })();

  // 1) Profile photo: show the "YL" monogram if the image is missing.
  var img = document.querySelector("[data-photo]");
  if (img) {
    var fig = img.closest(".photo");
    var showFallback = function () { fig.classList.add("no-photo"); };
    if (img.complete && img.naturalWidth === 0) showFallback();
    img.addEventListener("error", showFallback);
  }

  // 2) CV: if the PDF isn't uploaded yet, grey out the CV links instead of
  //    sending visitors to a 404. (Only checked when served over http/https.)
  var cvLinks = document.querySelectorAll("a[data-cv]");
  if (cvLinks.length && /^https?:$/.test(location.protocol) && window.fetch) {
    var markPending = function () {
      cvLinks.forEach(function (a) {
        a.removeAttribute("href");
        a.removeAttribute("target");
        a.classList.add("is-pending");
        a.setAttribute("aria-disabled", "true");
        a.title = "CV coming soon";
      });
    };
    fetch(cvLinks[0].getAttribute("href"), { method: "HEAD", cache: "no-store" })
      .then(function (r) {
        var type = r.headers.get("content-type") || "";
        if (!r.ok || type.indexOf("text/html") !== -1) markPending();
      })
      .catch(markPending);
  }

  // 3) Highlight the nav item for the section in view.
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!("IntersectionObserver" in window) || !navLinks.length) return;
  var byId = {};
  navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });

  var setActive = function (id) {
    navLinks.forEach(function (a) { a.classList.remove("active"); });
    if (byId[id]) byId[id].classList.add("active");
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: "-40% 0px -55% 0px" });

  Object.keys(byId).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // At the very bottom the last section may never reach the trigger line.
  window.addEventListener("scroll", function () {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) setActive("awards");
  }, { passive: true });
})();
