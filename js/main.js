/* MR.Clean Lab — LP interactions (依存なし) */
(function () {
  "use strict";

  /* スクロール出現 */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* FAQ アコーディオン */
  document.querySelectorAll(".faq-acc .item").forEach(function (item) {
    var q = item.querySelector(".q");
    var a = item.querySelector(".a");
    if (!q || !a) return;
    q.setAttribute("aria-expanded", "false");
    q.addEventListener("click", function () {
      var open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", String(open));
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
    });
  });
  window.addEventListener("resize", function () {
    document.querySelectorAll(".faq-acc .item.open .a").forEach(function (a) {
      a.style.maxHeight = a.scrollHeight + "px";
    });
  });

  /* ページトップ表示 */
  var top = document.querySelector(".pagetop");
  if (top) {
    window.addEventListener("scroll", function () {
      top.classList.toggle("show", (window.scrollY || window.pageYOffset) > 600);
    }, { passive: true });
  }
})();
