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

/* =========================================================
   v7 プレビュー用プロトタイプ JS（依存なし・IIFE・既存と非競合）
   - 既存(preloader/reveal/FAQ/pagetop/ハンバーガー)に手を加えない。
   - エッジマーキー生成 / cursor-tilt / ヒーロースライドショー(プレースホルダ動作)。
   ========================================================= */

/* グローバル ON/OFF（久保さん調整ポイント） */
var MRCL_ANIM = {
  MARQUEE_ENABLED: true,
  TILT_ENABLED: true,
  SLIDESHOW_ENABLED: false /* 顔入り実画像が用意できるまでOFF（現状の顔表紙を維持）。画像投入後に true */
};

/* --- (A) エッジ・マーキー：CLEAN / LABO を縁に流す（DOM生成） --- */
(function () {
  "use strict";
  if (!MRCL_ANIM.MARQUEE_ENABLED) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return; /* 動く帯は静止だと無意味なので生成しない */
  if (document.querySelector(".edge-marquee")) return; /* 二重生成防止 */

  function rowHtml(words) {
    var s = "";
    for (var k = 0; k < 8; k++) { s += "<i>" + words[k % words.length] + "</i>"; }
    return s;
  }
  function build(pos, words) {
    var bar = document.createElement("div");
    bar.className = "edge-marquee edge-marquee--" + pos;
    bar.setAttribute("aria-hidden", "true");
    var track = document.createElement("div");
    track.className = "edge-marquee__track";
    var r1 = document.createElement("span");
    r1.className = "edge-marquee__row";
    r1.innerHTML = rowHtml(words);
    var r2 = r1.cloneNode(true);
    track.appendChild(r1); track.appendChild(r2);
    bar.appendChild(track);
    document.body.appendChild(bar);
  }
  /* 下帯=既定表示。上帯はCSS変数 --marq-top で制御（生成はしておく） */
  build("top", ["CLEAN", "LABO"]);
  build("bottom", ["LABO", "CLEAN"]);
})();

/* --- (B) cursor-tilt：対象カードを触ると微傾き＋浮き出し --- */
(function () {
  "use strict";
  if (!MRCL_ANIM.TILT_ENABLED) return;
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduce) return;

  var SELECTOR = ".svc-o"; /* まずは事業内容カードのみ（“ここぞ感”） */
  var rootMax = getComputedStyle(document.documentElement).getPropertyValue("--tilt-max");
  var MAX = parseFloat(rootMax) || 4.5;
  var LIFT = 6;

  var cards = document.querySelectorAll(SELECTOR);
  if (!cards.length) return;

  cards.forEach(function (card) {
    if (card.querySelector(":scope > .tilt-inner")) return; /* 二重ラップ防止 */
    var inner = document.createElement("div");
    inner.className = "tilt-inner";
    while (card.firstChild) { inner.appendChild(card.firstChild); }
    card.appendChild(inner);
    card.classList.add("tilt-host");

    var raf = 0, pending = null;
    function apply() {
      raf = 0;
      if (!pending) return;
      var r = card.getBoundingClientRect();
      var px = (pending.x - r.left) / r.width;
      var py = (pending.y - r.top) / r.height;
      var ry = (px - 0.5) * 2 * MAX;
      var rx = (0.5 - py) * 2 * MAX;
      inner.style.transform =
        "perspective(800px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) +
        "deg) translateZ(" + LIFT + "px)";
    }
    card.addEventListener("pointermove", function (e) {
      pending = { x: e.clientX, y: e.clientY };
      card.classList.add("is-tilting");
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    card.addEventListener("pointerleave", function () {
      pending = null;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      card.classList.remove("is-tilting");
      inner.style.transform = "";
    }, { passive: true });
  });
})();

/* --- (C) ヒーロー スライドショー（プレースホルダ動作・クロスフェード） ---
   実画像未生成のため、既存 .cover__bg を slide0 とし、
   既存の他画像(hero-pest/drain/reform)をプレースホルダ slide として
   動的に append する。実画像が揃ったら HTML を本実装に差し替える（notes参照）。 */
(function () {
  "use strict";
  if (!MRCL_ANIM.SLIDESHOW_ENABLED) return;
  var frame = document.querySelector(".cover__frame");
  if (!frame) return;
  var baseImg = frame.querySelector(".cover__bg");
  if (!baseImg) return;
  if (frame.classList.contains("has-slideshow")) return;

  /* プレビュー用プレースホルダ（既存画像を流用）。
     ※実装時は images/cover/slide-2..4.* に差し替え（notes参照）。 */
  var PLACEHOLDERS = [
    { src: "images/hero-pest.jpg?v=20260630a",   alt: "害虫害獣の調査を行うスタッフ（プレースホルダ）" },
    { src: "images/hero-drain.jpg?v=20260630a",  alt: "排水管洗浄・グリーストラップ清掃（プレースホルダ）" },
    { src: "images/hero-reform.jpg?v=20260630a", alt: "ハウスクリーニング・内装リフォーム（プレースホルダ）" }
  ];

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* slide 群コンテナを作り、既存 .cover__bg を slide0 として内包 */
  var slides = document.createElement("div");
  slides.className = "cover__slides";
  slides.setAttribute("aria-hidden", "true");
  baseImg.parentNode.insertBefore(slides, baseImg);
  slides.appendChild(baseImg);          /* slide0 = LCP（既存imgそのまま） */
  baseImg.classList.add("cover__slide", "is-active");
  frame.classList.add("has-slideshow");

  /* 追加スライド（遅延読込・LCP非関与） */
  PLACEHOLDERS.forEach(function (p) {
    var img = document.createElement("img");
    img.className = "cover__slide";
    img.src = p.src;
    img.alt = p.alt;
    img.loading = "lazy";
    img.decoding = "async";
    try { img.fetchPriority = "low"; } catch (e) {}
    img.onerror = function () { if (img.parentNode) img.parentNode.removeChild(img); rebuild(); };
    slides.appendChild(img);
  });

  var items = [], dots = [], i = 0, timer = null, paused = false, dotsWrap = null;
  var INTERVAL = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--cover-slide-interval"), 10) || 6000;

  function rebuild() {
    items = Array.prototype.slice.call(slides.querySelectorAll(".cover__slide"));
  }
  rebuild();
  if (items.length < 2) return; /* 1枚だけなら静止（フォールバック） */

  /* ドット生成 */
  dotsWrap = document.createElement("div");
  dotsWrap.className = "cover__dots";
  dotsWrap.setAttribute("role", "tablist");
  dotsWrap.setAttribute("aria-label", "ヒーロー画像の切り替え");
  frame.appendChild(dotsWrap);
  items.forEach(function (s, idx) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", (idx + 1) + "枚目を表示");
    b.setAttribute("aria-selected", idx === 0 ? "true" : "false");
    if (idx === 0) b.classList.add("is-active");
    b.addEventListener("click", function () { stop(); show(idx); start(); });
    dotsWrap.appendChild(b);
    dots.push(b);
  });

  function show(n) {
    n = (n + items.length) % items.length;
    if (items[i]) items[i].classList.remove("is-active");
    if (items[n]) items[n].classList.add("is-active");
    if (dots[i]) { dots[i].classList.remove("is-active"); dots[i].setAttribute("aria-selected", "false"); }
    if (dots[n]) { dots[n].classList.add("is-active"); dots[n].setAttribute("aria-selected", "true"); }
    i = n;
  }
  function next() { show(i + 1); }
  function start() { if (reduce || paused || timer) return; timer = setInterval(next, INTERVAL); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  if (reduce) return; /* 1枚目で静止・自動送りなし */

  frame.addEventListener("mouseenter", function () { paused = true; stop(); });
  frame.addEventListener("mouseleave", function () { paused = false; start(); });
  frame.addEventListener("focusin", function () { paused = true; stop(); });
  frame.addEventListener("focusout", function () { paused = false; start(); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });

  start();
})();
