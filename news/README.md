# お知らせの追加方法（画像付き）

お知らせは「一覧ページ（`news.html`）」と「記事ページ（`news/` フォルダ内の1記事＝1ファイル）」でできています。
新しいお知らせを載せるときは、次の **3ステップ** で作業します。GitHubのWeb画面だけで完結します。

---

## ステップ1：画像をアップロードする

1. `images/news/` フォルダを開き、「Add file → Upload files」で画像をアップロードします。
2. **ファイル名は半角英数字とハイフンのみ**にしてください（日本語・スペースは不可）。
   - 例：`2026-10-01-aircon.jpg`、`2026-10-01-aircon-before.jpg`
3. 推奨サイズ：**横長 1600×1000px（16:10）／JPG／1枚500KB以下**
   - 縦長やサイズ違いの写真も表示できますが、一覧のサムネイルは16:10に自動で切り抜かれます。
   - 画像が無い記事は `noimage.jpg`（ロゴ入りの共通画像）を指定できます。

## ステップ2：記事ページを作る

1. `news/_template.html` を開き、中身をすべてコピーします。
2. `news/` フォルダで「Add file → Create new file」を選び、ファイル名を
   **`日付-英字.html`**（例：`2026-10-01-aircon.html`）にして貼り付けます。
3. ファイル内を次の文字で検索し、**見つかった箇所をすべて**置き換えます（GitHubの編集画面なら Ctrl+F／⌘+F で検索できます）。

| 検索する文字 | 置き換える内容 | 例 |
|---|---|---|
| `★ここに記事のタイトル` | 記事タイトル | エアコンクリーニングのご案内 |
| `★ここに一覧やSNSで表示される要約` から始まる文 | 要約（60〜90文字） | 暖房シーズン前の分解洗浄がおすすめです。… |
| `YYYY-MM-DD-kiji` | このファイルの名前（`.html` の前まで） | 2026-10-01-aircon |
| `2026-01-01` と `2026.01.01` | 公開日 | 2026-10-01 ／ 2026.10.01 |
| `noimage.jpg` | アイキャッチ画像のファイル名 | 2026-10-01-aircon.jpg |

   さらに、カテゴリ（`data-cat="info"` と タグの「お知らせ」）を必要に応じて変更し、本文（`article-body` の中）を書き換えます。
   アイキャッチが**写真**の場合は、`article-hero` の画像の `alt=""` に写っている内容を書きます（例：`alt="施工後のキッチン"`）。文字だけの画像なら `alt=""` のままで構いません（タイトルと読み上げが重複しないため）。

4. **公開前に `<meta name="robots" content="noindex">` の1行を必ず削除**してください（テンプレートが検索に出ないための行です）。

### カテゴリ

| `data-cat` の値 | 表示名 | 色 |
|---|---|---|
| `info` | お知らせ | 紺 |
| `season` | 季節のご案内 | オレンジ |
| `pest` | 害虫害獣 | 青 |
| `works` | 施工事例 | 緑 |
| `campaign` | キャンペーン | 赤 |

一覧ページの絞り込みボタンは、記事に使われているカテゴリから自動で作られます。

### 本文で使えるパーツ（画像の載せ方）

記事ページの本文では、`src` の先頭に **`../images/news/`** を付けます。

**画像1枚（キャプション付き）**
```html
<figure>
  <img src="../images/news/ファイル名.jpg" alt="画像の説明" width="1600" height="1000" loading="lazy" decoding="async">
  <figcaption>キャプション（不要なら行ごと削除）</figcaption>
</figure>
```

**画像を2枚並べる**（施工前・施工後など）／3枚並べる場合は `class="article-gallery is-3"`
```html
<div class="article-gallery">
  <figure><img src="../images/news/before.jpg" alt="施工前" width="1600" height="1000" loading="lazy" decoding="async"><figcaption>施工前</figcaption></figure>
  <figure><img src="../images/news/after.jpg" alt="施工後" width="1600" height="1000" loading="lazy" decoding="async"><figcaption>施工後</figcaption></figure>
</div>
```

**画像と文章を横並び**（スマホでは縦並び）／画像を右にする場合は `class="article-media is-reverse"`
```html
<div class="article-media">
  <figure><img src="../images/news/ファイル名.jpg" alt="画像の説明" width="1600" height="1000" loading="lazy" decoding="async"></figure>
  <div>
    <h3>見出し</h3>
    <p>文章</p>
  </div>
</div>
```

**文章・見出し・箇条書き・注意書き**
```html
<p>段落の文章</p>
<h2>見出し（大）</h2>
<h3>見出し（小）</h3>
<ul><li>箇条書き</li></ul>
<div class="article-note"><p>補足・注意書き</p></div>
```

> `alt`（画像の説明）は、目の不自由な方の読み上げや検索に使われます。写っている内容を短く書いてください。

## ステップ3：一覧ページにカードを追加する

`news.html` を開き、`<div class="news-grid">` の **一番上** に、既存の
`<article class="news-card" …> 〜 </article>` を1つコピーして貼り付け、次を書き換えます。

- `data-cat`（2か所）とタグの文字 … カテゴリ
- `href="news/ファイル名.html"` … 記事ページ
- `src="images/news/画像ファイル名.jpg"` … サムネイル（一覧は `../` を付けない）
- `datetime` と表示日付（`2026.10.01` 形式）
- タイトル・要約

### あわせて行うと良いこと（任意）

- 記事ページの下にある「新しい記事／前の記事」のリンクを、前後の記事どうしでつなぎ直す
  - 新しく作った記事の **1つ目の `<span></span>`** はそのまま（これより新しい記事が無いため）、
    **2つ目の `<span></span>`** を、ひとつ前の記事へのリンクに置き換えます。
    ```html
    <a class="article-pager__next" href="2026-08-30-renewal.html"><span class="k">前の記事</span><span class="t">ホームページをリニューアルしました</span></a>
    ```
  - ひとつ前の記事を開き、**1つ目の `<span></span>`** を新しい記事へのリンクに置き換えます。
    ```html
    <a class="article-pager__prev" href="2026-10-01-aircon.html"><span class="k">新しい記事</span><span class="t">新しい記事のタイトル</span></a>
    ```
- `sitemap.xml` に記事のURLを1行追加する（検索エンジンに早く見つけてもらえます）

---

### うまく表示されないときのチェック

- 画像が出ない → ファイル名の大文字・小文字、拡張子（`.jpg` / `.JPG`）、`../` の有無を確認
- 記事ページのデザインが崩れる → テンプレートの `../css/` `../js/` などのパスを消していないか確認
- 反映されない → GitHub Pagesの反映に1〜2分かかります。ブラウザを再読み込みしてください
