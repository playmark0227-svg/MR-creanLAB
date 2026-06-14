# MR.Clean Lab ウェブサイト

株式会社MR.クリーンラボのコーポレートサイト（静的HTML/CSS/JS）。
提供されたスクリーンショットを元に内容を再現し、納品レベルへフルデザインしたものです。
画像は外部ネット制限・ライセンスの都合により**すべてオリジナルSVGイラスト**で制作しています。

> サイト所有者の許諾のもと、改修作業用に制作・公開しています。

## 公開URL（GitHub Pages）

https://playmark0227-svg.github.io/MR-creanLAB/

ブランチ `claude/vigilant-cerf-1z8czi`（root）から自動デプロイ。プッシュのたびに自動更新されます。

## ページ構成

| ファイル | 内容 |
|---|---|
| `index.html` | ホーム |
| `pest-control.html` | 害虫害獣 駆除・防除 |
| `drainage.html` | 排水管洗浄・グリーストラップ清掃 |
| `reform.html` | リフォーム・ハウスクリーニング |
| `company.html` | 会社概要（代表メッセージ・会社概要テーブル） |
| `news.html` | お知らせ |
| `contact.html` | お問い合わせ（フォーム） |
| `404.html` | Not Found ページ |

## 技術・構成

- **ビルド不要**の静的サイト。ブラウザで `index.html` を開くだけで確認可。
- `css/style.css` … デザインシステム（配色・余白・角丸・影をすべて `:root` 変数化）。
- `js/main.js` … モバイルメニュー / FAQアコーディオン / スクロール出現 / ページトップ（依存なし）。
- `images/*.svg` … オリジナルSVGイラスト一式（`images/README.md` 参照）。
- フォント … Google Fonts（Noto Sans JP / Zen Kaku Gothic New / Poppins）。
- SEO … 各ページ `title` / `description` / OGP、`favicon.svg`、`robots.txt`、`sitemap.xml`。
- レスポンシブ・アクセシビリティ（`prefers-reduced-motion`、フォーカスリング、`alt`）対応。

ローカルでサーバ表示する場合：

```bash
python3 -m http.server 8000   # → http://localhost:8000/
```

## デザインのカスタマイズ

配色は `css/style.css` の `:root` 変数を変えるだけでサイト全体に反映されます。

| 用途 | 変数 | 値 |
|---|---|---|
| 濃紺（ヒーロー・見出し） | `--navy` | `#0c2a5e` |
| プライマリブルー | `--blue` | `#1668d8` |
| アクセント（シアン） | `--cyan` | `#16b6c9` |
| CTAオレンジ | `--orange` | `#ff7a1a` |

## 納品前に差し替え・確認したい項目

1. **画像** … オリジナルSVGで完成済み。御社スタッフ・施工写真に差し替えると更に効果的（`images/README.md` 参照）。
2. **お問い合わせフォーム** … 現在はデモ。実際の送信先（メール／フォームサービス）への接続が必要。
3. **アクセスマップ** … `company.html` の地図枠を Google マップ埋め込みに置き換え。
4. **お客様の声・FAQ回答** … スクショで読み取れない部分はサンプル文。実内容に差し替え推奨（該当箇所に注記あり）。
5. **電話番号・住所・社名** … スクショから転記済み。最終確認をお願いします。
