# K-1 TASK FORCE 公式サイト

公開URL: https://tomohiro20.github.io/k1-taskforce/

ビルド不要の静的サイトです。`main` ブランチにプッシュすると、1〜2分で GitHub Pages に反映されます。

## フォルダ構成

```
index.html            トップ（ABOUT）
representative.html   代表紹介
members.html          メンバー
activity.html         活動実績
contact.html          お問い合わせ
assets/
  css/style.css       全ページ共通のデザイン
  js/main.js          メニュー開閉・スクロール演出・トップの「最新の活動」
  img/                ロゴ・ファビコン・代表写真など
  img/activity/       活動実績の写真（YYYYMMDD.jpg）
  img/hero/           トップのスライドショー写真（01〜04.jpg、横幅1920px）
sitemap.xml / robots.txt   検索エンジン向け
```

## 活動実績を追加する

1. 写真を `assets/img/activity/` に `開催日.jpg`（例: `20261101.jpg`）で保存する。横幅 1200px 程度に縮小しておく。
2. `activity.html` の `<div class="activity-list">` のすぐ下（いちばん上）に次のブロックを貼り、中身を書き換える。

```html
<article class="activity-item reveal" id="a20261101">
    <div class="activity-item__thumb"><img src="assets/img/activity/20261101.jpg" alt="イベント名" loading="lazy"></div>
    <div class="activity-item__body">
        <div class="activity-item__meta">
            <span class="date">2026.11.01</span>
            <span class="tag">EVENT</span>
        </div>
        <h2 class="activity-item__title">タイトル</h2>
        <p class="activity-item__place">開催場所</p>
        <p class="activity-item__text">本文</p>
        <div class="activity-item__links">
            <a href="https://example.com/" target="_blank" rel="noopener" class="text-link">詳しく見る</a>
        </div>
    </div>
</article>
```

- `id` は `a` + 開催日（ページ内で重複させない）。
- 受賞は `<span class="tag tag--award">AWARD</span>` にすると緑のタグになる。
- トップページの「最新の活動」は `activity.html` の上から4件を自動表示するので、トップ側の編集は不要。

## そのほかの更新

- メンバー: `members.html` の `member-card` ブロックをコピーして編集（見出し横の人数表示も直す）。
- ヘッダー・フッター: 各ページに同じ内容が入っているので、変更時は5ページすべてを直す。
- トップのスライドショー: `assets/img/hero/` の `01.jpg`〜`04.jpg` を同じ名前で差し替える。
- 色やフォント: `assets/css/style.css` 冒頭の `:root` の変数を変える。

## 手元で確認する

```bash
python3 -m http.server 8765
```

を実行して http://localhost:8765 を開く（ファイルを直接ダブルクリックで開くと「最新の活動」だけ表示されません）。
