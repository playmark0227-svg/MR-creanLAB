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
  SLIDESHOW_ENABLED: true /* 顔入り実画像(cover-1〜4)で有効化 */
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

/* --- (C) ヒーロー スライドショー（4事業のクロスフェード） ---
   slide1 = 既存 .cover__bg（総合・LCP）。slide2〜4 を遅延読込で動的 append。
   各スライドは object-position を個別指定し、PC（縦クロップ）/スマホ（4:3バンドの
   横クロップ）双方で顔が切れないよう調整。 */
(function () {
  "use strict";
  if (!MRCL_ANIM.SLIDESHOW_ENABLED) return;
  var frame = document.querySelector(".cover__frame");
  if (!frame) return;
  var baseImg = frame.querySelector(".cover__bg");
  if (!baseImg) return;
  if (frame.classList.contains("has-slideshow")) return;

  var VER = "?v=20260830d";
  /* slide2〜4（顔入り実画像）。pos = object-position（x=スマホ横位置 / y=PC縦位置） */
  var SLIDES = [
    { src: "images/cover-2.jpg" + VER, alt: "住まいを点検する害虫害獣防除のスタッフ", pos: "74% 28%" },
    { src: "images/cover-3.jpg" + VER, alt: "キッチンの排水・水まわりを作業するスタッフ", pos: "64% 32%" },
    { src: "images/cover-4.jpg" + VER, alt: "リフォーム・ハウスクリーニングを行うスタッフ", pos: "78% 28%" }
  ];

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* slide 群コンテナを作り、既存 .cover__bg を slide1 として内包 */
  var slides = document.createElement("div");
  slides.className = "cover__slides";
  slides.setAttribute("aria-hidden", "true");
  baseImg.parentNode.insertBefore(slides, baseImg);
  slides.appendChild(baseImg);          /* slide1 = LCP（既存imgそのまま） */
  baseImg.classList.add("cover__slide", "is-active");
  baseImg.style.objectPosition = "72% 28%"; /* 総合カット：女性が右寄り */
  if (!baseImg.getAttribute("alt")) baseImg.alt = "札幌の総合クリーンサービス MR.クリーンラボのスタッフ";
  frame.classList.add("has-slideshow");

  /* 追加スライド（遅延読込・LCP非関与） */
  SLIDES.forEach(function (p) {
    var img = document.createElement("img");
    img.className = "cover__slide";
    img.src = p.src;
    img.alt = p.alt;
    img.loading = "lazy";
    img.decoding = "async";
    img.style.objectPosition = p.pos;
    try { img.fetchPriority = "low"; } catch (e) {}
    img.onerror = function () { if (img.parentNode) img.parentNode.removeChild(img); rebuild(); };
    slides.appendChild(img);
  });

  var items = [], dots = [], i = 0, timer = null, paused = false, userPaused = false, dotsWrap = null;
  var INTERVAL = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--cover-slide-interval"), 10) || 6000;

  function rebuild() {
    items = Array.prototype.slice.call(slides.querySelectorAll(".cover__slide"));
  }
  rebuild();
  if (items.length < 2) return; /* 1枚だけなら静止（フォールバック） */

  /* ドット生成 */
  dotsWrap = document.createElement("div");
  dotsWrap.className = "cover__dots";
  dotsWrap.setAttribute("role", "group");
  dotsWrap.setAttribute("aria-label", "ヒーロー画像の切り替え");
  frame.appendChild(dotsWrap);
  items.forEach(function (s, idx) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", (idx + 1) + "枚目を表示");
    b.setAttribute("aria-current", idx === 0 ? "true" : "false");
    if (idx === 0) b.classList.add("is-active");
    b.addEventListener("click", function () { stop(); show(idx); if (!userPaused) start(); });
    dotsWrap.appendChild(b);
    dots.push(b);
  });
  /* キーボード左右で切替 */
  dotsWrap.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    stop(); show(i + (e.key === "ArrowRight" ? 1 : -1));
    if (dots[i]) dots[i].focus();
    if (!userPaused) start();
  });
  /* 一時停止/再生ボタン（WCAG 2.2.2 自動送りの停止手段） */
  var ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  var ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var pauseBtn = document.createElement("button");
  pauseBtn.type = "button";
  pauseBtn.className = "cover__pause";
  pauseBtn.innerHTML = ICON_PAUSE;
  pauseBtn.setAttribute("aria-label", "スライドショーを一時停止");
  pauseBtn.addEventListener("click", function () {
    userPaused = !userPaused;
    if (userPaused) { stop(); pauseBtn.innerHTML = ICON_PLAY; pauseBtn.setAttribute("aria-label", "スライドショーを再生"); }
    else { pauseBtn.innerHTML = ICON_PAUSE; pauseBtn.setAttribute("aria-label", "スライドショーを一時停止"); start(); }
  });
  frame.appendChild(pauseBtn);

  function show(n) {
    n = (n + items.length) % items.length;
    if (items[i]) items[i].classList.remove("is-active");
    if (items[n]) items[n].classList.add("is-active");
    if (dots[i]) { dots[i].classList.remove("is-active"); dots[i].setAttribute("aria-current", "false"); }
    if (dots[n]) { dots[n].classList.add("is-active"); dots[n].setAttribute("aria-current", "true"); }
    i = n;
  }
  function next() { show(i + 1); }
  function start() { if (reduce || paused || userPaused || timer) return; timer = setInterval(next, INTERVAL); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  if (reduce) return; /* 1枚目で静止・自動送りなし */

  frame.addEventListener("mouseenter", function () { paused = true; stop(); });
  frame.addEventListener("mouseleave", function () { paused = false; start(); });
  frame.addEventListener("focusin", function () { paused = true; stop(); });
  frame.addEventListener("focusout", function () { paused = false; start(); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });

  start();
})();

/* =========================================================
   v8 WOWエフェクト JS（依存なし・IIFE・既存と非競合）
   prefers-reduced-motion / タッチ端末で各演出を安全に無効化。
   ========================================================= */
(function () {
  "use strict";
  var mqReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduce = mqReduce && mqReduce.matches;
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var doc = document, body = doc.body;

  /* ---- 1) スクロール進捗バー ---- */
  if (!reduce) {
    var bar = doc.createElement("div");
    bar.className = "scroll-prog";
    body.appendChild(bar);
    var barRAF = 0;
    function updBar() {
      barRAF = 0;
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY || window.pageYOffset) / h : 0;
      bar.style.width = (p * 100).toFixed(2) + "%";
    }
    window.addEventListener("scroll", function () { if (!barRAF) barRAF = requestAnimationFrame(updBar); }, { passive: true });
    updBar();
  }

  /* ---- 2) ヘッダー縮小 ---- */
  var header = doc.querySelector(".site-header");
  if (header) {
    var hRAF = 0;
    function updH() { hRAF = 0; header.classList.toggle("shrink", (window.scrollY || window.pageYOffset) > 40); }
    window.addEventListener("scroll", function () { if (!hRAF) hRAF = requestAnimationFrame(updH); }, { passive: true });
    updH();
  }

  /* ---- 3) 数字カウントアップ ---- */
  var stats = doc.querySelector(".stats");
  if (stats && "IntersectionObserver" in window) {
    var sObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        sObs.unobserve(e.target);
        doc.querySelectorAll(".stats .n").forEach(function (n) {
          var node = n.firstChild;
          if (!node || node.nodeType !== 3) return;
          var m = node.nodeValue.match(/^(\D*)(\d+)(.*)$/);
          if (!m) return;
          var pre = m[1], target = parseInt(m[2], 10), post = m[3];
          if (!target || reduce) { return; }
          var dur = 1400, t0 = null;
          function step(ts) {
            if (!t0) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            node.nodeValue = pre + Math.round(target * eased) + post;
            if (p < 1) requestAnimationFrame(step);
          }
          node.nodeValue = pre + "0" + post;
          requestAnimationFrame(step);
        });
      });
    }, { threshold: 0.4 });
    sObs.observe(stats);
  }

  /* ---- 4) 方向付きreveal & 見出しスイープ（.in付与） ---- */
  if ("IntersectionObserver" in window) {
    var vObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); vObs.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    doc.querySelectorAll(".reveal-l,.reveal-r,.reveal-zoom,.section-title").forEach(function (el) { vObs.observe(el); });
  } else {
    doc.querySelectorAll(".reveal-l,.reveal-r,.reveal-zoom,.section-title").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- 5) カードのスポットライト（PCのみ） ---- */
  if (fine && !reduce) {
    doc.querySelectorAll(".cred,.feature,.voice-card").forEach(function (card) {
      card.classList.add("spot");
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
      }, { passive: true });
    });
  }

  /* ---- 6) マグネティックボタン（PCのみ） ---- */
  if (fine && !reduce) {
    doc.querySelectorAll(".btn-cta,.cover-cta").forEach(function (btn) {
      var raf = 0, pend = null;
      function move() {
        raf = 0; if (!pend) return;
        btn.style.transform = "translate(" + pend.x.toFixed(1) + "px," + pend.y.toFixed(1) + "px)";
      }
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        pend = { x: mx * 0.25, y: my * 0.32 };
        if (!raf) raf = requestAnimationFrame(move);
      }, { passive: true });
      btn.addEventListener("pointerleave", function () {
        pend = null; if (raf) { cancelAnimationFrame(raf); raf = 0; }
        btn.style.transform = "";
      }, { passive: true });
    });
  }

  /* ---- 7) リップル（クリック波紋） ---- */
  doc.querySelectorAll(".btn-cta,.btn-contact,.cover-cta,.form button").forEach(function (btn) {
    btn.addEventListener("pointerdown", function (e) {
      if (reduce) return;
      var r = btn.getBoundingClientRect();
      var d = Math.max(r.width, r.height);
      var ink = doc.createElement("span");
      ink.className = "ripple-ink";
      ink.style.width = ink.style.height = d + "px";
      ink.style.left = (e.clientX - r.left - d / 2) + "px";
      ink.style.top = (e.clientY - r.top - d / 2) + "px";
      btn.appendChild(ink);
      setTimeout(function () { if (ink.parentNode) ink.parentNode.removeChild(ink); }, 650);
    }, { passive: true });
  });

  /* ---- 8) 表紙の浮遊バブル（PCのみ・控えめ） ---- */
  if (!reduce) {
    var frame = doc.querySelector(".cover__frame");
    if (frame && !frame.querySelector(".cover__fx")) {
      var fx = doc.createElement("div");
      fx.className = "cover__fx"; fx.setAttribute("aria-hidden", "true");
      var scrim = frame.querySelector(".cover__scrim");
      if (scrim && scrim.nextSibling) frame.insertBefore(fx, scrim.nextSibling); else frame.appendChild(fx);
      var N = 7;
      for (var i = 0; i < N; i++) {
        var b = doc.createElement("span");
        b.className = "bubble";
        var sz = 18 + Math.round(Math.random() * 46);
        b.style.width = b.style.height = sz + "px";
        b.style.left = Math.round(Math.random() * 96) + "%";
        b.style.animationDuration = (12 + Math.random() * 12).toFixed(1) + "s";
        b.style.animationDelay = (-Math.random() * 14).toFixed(1) + "s";
        fx.appendChild(b);
      }
    }
  }

  /* ---- 9) カーソルグロウ（PCのみ） ---- */
  if (fine && !reduce) {
    var glow = doc.createElement("div");
    glow.className = "cursor-glow"; glow.setAttribute("aria-hidden", "true");
    body.appendChild(glow);
    var gx = 0, gy = 0, gRAF = 0;
    function gmove() { gRAF = 0; glow.style.transform = "translate(" + gx + "px," + gy + "px)"; }
    window.addEventListener("pointermove", function (e) {
      gx = e.clientX; gy = e.clientY; glow.classList.add("on");
      if (!gRAF) gRAF = requestAnimationFrame(gmove);
    }, { passive: true });
    window.addEventListener("pointerleave", function () { glow.classList.remove("on"); });
  }
})();

/* =========================================================
   v9 リッチモーション JS（依存なし・IIFE・既存と非競合）
   すべて reduced-motion で自動無効。要素が無いページでは何もしない。
   ========================================================= */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var doc = document, body = doc.body;

  /* 共通オブザーバ（v9専用） */
  var obs = ("IntersectionObserver" in window && !reduce)
    ? new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            var el = e.target;
            el.classList.add("anim-in");
            obs.unobserve(el);
            /* 登場完了後に g-item を外し、:hover の transform と競合させない */
            var kids = el.querySelectorAll(".g-item");
            if (kids.length) {
              setTimeout(function () {
                kids.forEach(function (k) { k.classList.remove("g-item"); });
              }, kids.length * 90 + 800);
            }
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" })
    : null;
  function watch(el) { if (obs) obs.observe(el); else el.classList.add("anim-in"); }

  /* ---- 1) グリッドの順次登場（子要素へ自動ステガー付与） ---- */
  if (!reduce) {
    var GRIDS = ".features,.steps,.cards-4,.service-grid,.creds,.svc-over,.stats .grid,.faq-acc,.cities,.tag-list,.problem-list,.checklist,.footer-main,.cta-band,.cta-photo,.sec-head";
    doc.querySelectorAll(GRIDS).forEach(function (grid) {
      var kids = Array.prototype.slice.call(grid.children).filter(function (k) { return k.nodeType === 1; });
      if (!kids.length) return;
      kids.forEach(function (k, i) {
        k.classList.remove("reveal", "d1", "d2", "d3"); /* 旧revealと二重にしない */
        k.classList.add("g-item");
        k.style.setProperty("--gd", (i * 90) + "ms");
      });
      grid.classList.add("g-host");
      watch(grid);
    });
  }

  /* ---- 2) 画像のワイプ登場 ---- */
  if (!reduce) {
    doc.querySelectorAll(".lp-split .media,.svc-o__media,.voice-card .media").forEach(function (m) {
      m.classList.add("wipe");
      watch(m);
    });
  }

  /* ---- 3) 表紙エントランス（文字ステガー＋要素順次＋チェック描画） ---- */
  (function () {
    var frame = doc.querySelector(".cover__frame");
    if (!frame || reduce) return;
    var title = frame.querySelector(".cover__title");
    if (title && !title.querySelector(".ch")) {
      var idx = 0;
      Array.prototype.slice.call(title.childNodes).forEach(function (node) {
        if (node.nodeType !== 3) return; /* <br>は保持 */
        var fragment = doc.createDocumentFragment();
        node.nodeValue.split("").forEach(function (c) {
          if (c === " " || c === "\n") { fragment.appendChild(doc.createTextNode(c)); return; }
          var s = doc.createElement("span");
          s.className = "ch"; s.textContent = c;
          s.style.setProperty("--cd", (120 + idx * 34) + "ms");
          fragment.appendChild(s); idx++;
        });
        title.replaceChild(fragment, node);
      });
    }
    [[".cover__eyebrow", 0], [".cover__lead", 520], [".cover__trust", 660], [".cover__actions", 820]].forEach(function (t) {
      var el = frame.querySelector(t[0]);
      if (el) { el.classList.add("cin"); el.style.setProperty("--cd", t[1] + "ms"); }
    });
    frame.querySelectorAll(".cover__trust .ck path").forEach(function (p, i) {
      try { p.setAttribute("pathLength", "1"); } catch (e) {}
      p.style.setProperty("--cd", (700 + i * 140) + "ms");
    });
    /* スクロールキュー */
    if (!frame.querySelector(".scroll-cue")) {
      var cue = doc.createElement("div");
      cue.className = "scroll-cue"; cue.setAttribute("aria-hidden", "true");
      frame.appendChild(cue);
      window.addEventListener("scroll", function () {
        cue.classList.toggle("hide", (window.scrollY || 0) > 90);
      }, { passive: true });
    }
    function go() { setTimeout(function () { frame.classList.add("cover-in"); }, 250); }
    if (doc.readyState === "complete") go(); else window.addEventListener("load", go);
  })();

  /* ---- 4) 表紙パララックス（PCのみ・スクロールで文字がゆっくり退く） ---- */
  if (!reduce) {
    var pxInner = doc.querySelector(".cover__inner");
    var pxFrame = doc.querySelector(".cover__frame");
    if (pxInner && pxFrame) {
      var pxRAF = 0;
      function pxUpd() {
        pxRAF = 0;
        if (window.innerWidth <= 680) { pxInner.style.transform = ""; pxInner.style.opacity = ""; return; }
        var y = window.scrollY || 0, h = pxFrame.offsetHeight || 1;
        if (y < h) {
          pxInner.style.transform = "translateY(" + (y * 0.18).toFixed(1) + "px)";
          pxInner.style.opacity = Math.max(0, 1 - y / (h * 0.85)).toFixed(3);
        }
      }
      window.addEventListener("scroll", function () { if (!pxRAF) pxRAF = requestAnimationFrame(pxUpd); }, { passive: true });
    }
  }

  /* ---- 5) 信頼バーを無限マーキー化 ---- */
  if (!reduce) {
    doc.querySelectorAll(".trust-bar .in").forEach(function (box) {
      var ul = box.querySelector("ul");
      if (!ul || box.querySelector(".tb-marq")) return;
      var wrap = doc.createElement("div");
      wrap.className = "tb-marq";
      ul.parentNode.insertBefore(wrap, ul);
      wrap.appendChild(ul);
      var clone = ul.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      wrap.appendChild(clone);
    });
  }

  /* ---- 6) ページトップの進捗リング ---- */
  (function () {
    var rRAF = 0;
    function upd() {
      rRAF = 0;
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(100, (window.scrollY || 0) / h * 100) : 0;
      doc.documentElement.style.setProperty("--scrollp", p.toFixed(1));
    }
    window.addEventListener("scroll", function () { if (!rRAF) rRAF = requestAnimationFrame(upd); }, { passive: true });
    upd();
  })();

  /* ---- 7) プリローダー％カウンタ ---- */
  (function () {
    var pl = doc.getElementById("preloader");
    if (!pl || reduce) return;
    var inner = pl.querySelector(".preloader__inner");
    if (!inner) return;
    var num = doc.createElement("div");
    num.className = "preloader__num"; num.textContent = "0%";
    inner.appendChild(num);
    var t0 = null;
    function step(ts) {
      if (!pl.parentNode) return;
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 1000, 1);
      num.textContent = Math.round(100 * (1 - Math.pow(1 - p, 2))) + "%";
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  })();

  /* ---- 8) ページ遷移フェード（内部.htmlリンクのみ） ---- */
  if (!reduce) {
    var veil = doc.createElement("div");
    veil.className = "page-veil"; veil.setAttribute("aria-hidden", "true");
    body.appendChild(veil);
    doc.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest ? e.target.closest("a") : null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      var href = a.getAttribute("href") || "";
      if (!/\.html(\?|#|$)/.test(href) || /^(https?:)?\/\//.test(href)) return;
      e.preventDefault();
      veil.classList.add("show");
      setTimeout(function () { location.href = href; }, 220);
    });
    window.addEventListener("pageshow", function () { veil.classList.remove("show"); });
  }
})();

/* =========================================================
   v10 本番対応 JS（フォームtype連携 / FAQ ARIA / 依存なし・非競合）
   ========================================================= */
(function () {
  "use strict";
  var doc = document;

  /* --- 1) 法人CTA ?type=corporate → お問い合わせ内容を法人にプリセット --- */
  (function () {
    var sel = doc.getElementById("category");
    if (!sel) return;
    var type = null;
    try { type = new URLSearchParams(location.search).get("type"); } catch (e) {}
    if (type === "corporate") {
      var opt = sel.querySelector('option[value="corporate"]');
      if (opt) sel.value = "corporate";
    }
  })();

  /* --- 2) FAQ: aria-controls 付与＋閉時は inert でAT/タブ順から除外 --- */
  doc.querySelectorAll(".faq-acc .item").forEach(function (item, idx) {
    var q = item.querySelector(".q");
    var panel = item.querySelector(".a");
    if (!q || !panel) return;
    var id = panel.id || ("faq-panel-" + (idx + 1));
    panel.id = id;
    q.setAttribute("aria-controls", id);
    function sync() {
      var open = item.classList.contains("open");
      if (open) { panel.removeAttribute("inert"); }
      else { panel.setAttribute("inert", ""); }
    }
    sync();                                  /* 初期（閉）でinert付与 */
    q.addEventListener("click", sync);       /* 既存ハンドラ(.open切替)の後に走り最新状態を反映 */
  });
})();

/* =========================================================
   v11 お問い合わせフォーム送信
   ★設定はここだけ：ENDPOINT に Formspree 等の送信先URLを入れると即稼働します。
     例）ENDPOINT: "https://formspree.io/f/xxxxxxxx"
     空のままの場合は「送信できた」と誤認させず、電話でのご連絡をご案内します。
   ========================================================= */
var MRCL_FORM = {
  ENDPOINT: "",                       /* ← 送信先URL（未設定時は電話案内にフォールバック） */
  TEL: "011-252-7865",
  THANKS: "お問い合わせありがとうございます。担当者より折り返しご連絡いたしますので、少々お待ちください。"
};

(function () {
  "use strict";
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("form-status");

  function setStatus(msg, kind) {
    if (!status) return;
    status.textContent = msg;
    status.classList.remove("is-error", "is-ok");
    if (kind) status.classList.add(kind);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    /* 標準バリデーション（未入力・形式不正・同意未チェック） */
    if (!form.checkValidity()) {
      var bad = form.querySelector(":invalid");
      setStatus("未入力または内容に誤りのある項目があります。ご確認ください。", "is-error");
      if (bad && bad.focus) bad.focus();
      if (bad && bad.reportValidity) bad.reportValidity();
      return;
    }

    /* 送信先が未設定のうちは、成功したように見せずお電話をご案内 */
    if (!MRCL_FORM.ENDPOINT) {
      setStatus("申し訳ありません。ただいまフォームからの送信を準備中です。お急ぎの場合はお電話（" + MRCL_FORM.TEL + "／受付 9:00〜18:00）にてご連絡ください。", "is-error");
      return;
    }

    form.classList.add("is-sending");
    setStatus("送信しています…");

    fetch(MRCL_FORM.ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    }).then(function (res) {
      if (!res.ok) throw new Error("bad status " + res.status);
      form.reset();
      setStatus(MRCL_FORM.THANKS, "is-ok");
    }).catch(function () {
      setStatus("送信に失敗しました。通信環境をご確認のうえ再度お試しいただくか、お電話（" + MRCL_FORM.TEL + "）にてご連絡ください。", "is-error");
    }).then(function () {
      form.classList.remove("is-sending");
    });
  });
})();

/* =========================================================
   v12 オープニング（ロゴ一筆書き → TOPへ）
   - 1セッションに1回のみ／スキップ可／reduced-motionでは再生しない
   - JS不達時はCSS側のフェイルセーフで必ず退場
   ========================================================= */
(function () {
  "use strict";
  var op = document.getElementById("opening");
  if (!op) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var seen = false;
  try { seen = sessionStorage.getItem("mrclOpening") === "1"; } catch (e) {}

  function remove() {
    if (op && op.parentNode) op.parentNode.removeChild(op);
    document.body.classList.remove("is-opening");
  }
  if (reduce || seen) { remove(); return; }
  try { sessionStorage.setItem("mrclOpening", "1"); } catch (e) {}

  document.body.classList.add("is-opening");
  var pl = document.getElementById("preloader");   /* 二重表示を防ぐ */
  if (pl && pl.parentNode) pl.parentNode.removeChild(pl);

  /* 各パスの長さを実測して dash アニメを成立させる */
  var end = 0;
  op.querySelectorAll(".od").forEach(function (p) {
    var L = 1200;
    try { L = p.getTotalLength() || 1200; } catch (e) {}
    p.style.setProperty("--len", L.toFixed(1));
    var cs = getComputedStyle(p);
    var d = parseFloat(cs.getPropertyValue("--d")) || 0;
    var t = parseFloat(cs.getPropertyValue("--t")) || 0.6;
    if (d + t > end) end = d + t;
  });

  var timers = [];
  function finish() {
    timers.forEach(clearTimeout); timers = [];
    op.classList.add("is-out");
    timers.push(setTimeout(remove, 900));
  }

  requestAnimationFrame(function () { op.classList.add("is-run"); });
  timers.push(setTimeout(function () { op.classList.add("is-fill"); }, (end + 0.12) * 1000));
  timers.push(setTimeout(finish, (end + 1.15) * 1000));

  var skip = document.getElementById("opening-skip");
  if (skip) skip.addEventListener("click", function (e) { e.stopPropagation(); finish(); });
  op.addEventListener("click", finish);
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
  });
})();
