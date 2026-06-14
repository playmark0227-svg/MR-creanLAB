# MR.Clean Lab ウェブサイト

株式会社MR.クリーンラボのコーポレートサイト（静的HTML/CSS/JS）。
提供されたスクリーンショットを元に内容を再現し、納品レベルへフルデザインしたものです。

**デザインテーマ：ダーク・エディトリアル／ミニマル**（黒基調 × 明朝体の上質感 × 大胆な余白 ×
ヘアラインと大きなインデックス番号による非対称レイアウト）。アクセントはクリーンなミントを要所のみ。
装飾はCSSとインラインSVGで構成し、重い画像に依存しません。

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
- `images/*.svg` … ロゴ・favicon（その他の装飾はCSS／インラインSVG。`images/README.md` 参照）。
- フォント … Google Fonts（Shippori Mincho〔見出し・数字〕／ Zen Kaku Gothic New ／ Noto Sans JP ／ Space Grotesk〔英字ラベル〕）。
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
| 背景（黒） | `--bg` | `#0b0b0c` |
| パネル面 | `--panel` | `#141417` |
| テキスト（オフホワイト） | `--fg` | `#f4f2ec` |
| アクセント（ミント） | `--acc` | `#8fe6cf` |

> 差し色を変えたい場合は `--acc` の1行を変更するだけで全体に反映されます。

## 納品前に差し替え・確認したい項目

1. **写真** … `.media` 枠にプレースホルダを使用。御社スタッフ・施工写真を入れると更に効果的（`images/README.md` 参照）。
2. **お問い合わせフォーム** … 現在はデモ。実際の送信先（メール／フォームサービス）への接続が必要。
3. **アクセスマップ** … `company.html` の地図枠を Google マップ埋め込みに置き換え。
4. **お客様の声・FAQ回答** … スクショで読み取れない部分はサンプル文。実内容に差し替え推奨（該当箇所に注記あり）。
5. **電話番号・住所・社名** … スクショから転記済み。最終確認をお願いします。
