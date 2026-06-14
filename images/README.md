# 画像・素材について（クリーン／ライトテーマ）

白基調の清潔感あるデザイン。装飾は **CSSとインラインSVGアイコン** で構成し、重い画像に依存しません。
同梱画像は最小限です。

## 同梱アセット

| ファイル | 用途 |
|---|---|
| `logo.svg` | ロゴ（濃いインク文字／白ヘッダー用） |
| `logo-light.svg` | ロゴ（白文字／暗いフッター・CTA用） |
| `favicon.svg` | ブラウザタブのアイコン（ティール） |

## 写真を入れる（推奨：御社スタッフ・施工写真）

各ページの `.media`（角丸の写真枠）に、御社の実写を入れるとさらに効果的です。
枠は `object-fit:cover` でフィットします。

```html
<!-- 変更前（プレースホルダ） -->
<div class="media" data-label="Photo / 施工"><span class="ic">…icon…</span></div>
<!-- 変更後（写真を入れるだけ。data-label の枠は外してOK） -->
<div class="media"><img src="images/photo.jpg" alt="施工の様子"></div>
```

推奨サイズの目安：`.media` 4:3／`.media--wide` 16:10／`.media--tall` 3:4。
サービスカードの画像は `.svc-card__media` の `<span class="ic">…</span>` を `<img>` に差し替え。
会社概要のアクセスは `company.html` の `.map` を Google マップ埋め込み `<iframe>` に置換してください。

## アクセントカラーの変更
`css/style.css` の `:root` 内 `--acc`（既定 `#0bb3a6` ティール）を変えるだけで全体の差し色が変わります。

## ライセンス
ロゴ・favicon・アイコンはすべて本プロジェクト用に新規制作したオリジナルです。
