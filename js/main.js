/* MR.Clean Lab — LP interactions (依存なし) */

/* ローディング画面：読み込み完了でフェードアウト */
(function () {
  "use strict";
  var pl = document.getElementById("preloader");
  if (!pl) return;
  var done = false;
  function hide() {
    if (done) return;
    done = true;
    pl.classList.add("is-done");
    setTimeout(function () { if (pl.parentNode) pl.parentNode.removeChild(pl); }, 650);
  }
  if (document.readyState === "complete") { hide(); }
  else { window.addEventListener("load", hide); }
  /* 念のための保険（画像が極端に遅くても固まらない） */
  setTimeout(hide, 4000);
})();

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

/* モバイル：ハンバーガーメニュー（ヘッダーに動的挿入） */
(function () {
  "use strict";
  var headerTop = document.querySelector(".header-top");
  var nav = document.querySelector(".global-nav");
  if (!headerTop || !nav || headerTop.querySelector(".nav-toggle")) return;
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "nav-toggle";
  btn.setAttribute("aria-label", "メニューを開閉");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = "<span></span>";
  headerTop.appendChild(btn);
  function close() {
    nav.classList.remove("is-open");
    btn.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    btn.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
  window.addEventListener("resize", function () { if (window.innerWidth > 768) close(); });
  window.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
})();
