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
data/
  activities.json     活動実績のデータ（管理画面から更新）
  members.json        メンバーのデータ（管理画面から更新）
.pages.yml            管理画面（Pages CMS）の設定
.github/workflows/    承認の仕組み（自動処理）
sitemap.xml / robots.txt   検索エンジン向け
```

## 更新のしかた（管理画面）

活動実績とメンバーは、管理画面 **Pages CMS** から更新します。HTML を触る必要はありません。

- メンバー用の入口（下書き）：https://app.pagescms.org/Tomohiro20/k1-taskforce/draft
- 保存した内容は「下書き」に入り、管理者が承認するとサイトに公開されます。

- **活動実績**：「活動実績」を開き、「追加」で1件増やして、タイトル・開催日・種別・場所・本文・写真・リンクを入力して保存する。
  - 並び順は気にしなくてよい（サイトでは開催日の新しい順に自動で並ぶ）。
  - トップページの「最新の活動」にも新しい4件が自動で出る。
  - 写真はアップロード前に横幅 1600px 程度まで縮小する（スマホの写真そのままだとページが重くなる）。
- **メンバー**：「メンバー」を開き、大学ごとのリストで追加・編集・削除して保存する。人数表示は自動。

### 承認のしかた（管理者）

1. メンバーが保存すると、GitHub から「サイト更新の承認依頼」のメールが届く。
2. メールのリンク（または https://github.com/Tomohiro20/k1-taskforce/pulls ）から承認依頼を開く。
3. 「Files changed」タブで変更内容を確認する（緑が追加、赤が削除）。
4. 問題なければ **Merge pull request** → **Confirm merge** を押す。1〜2分でサイトに公開される。

公開したくないときは Merge を押さず、管理画面の下書きで内容を直す。

### 管理者（藍原）の初回設定

1. https://app.pagescms.org を開き、GitHub アカウントでサインインする。
2. Pages CMS の GitHub App を、`Tomohiro20/k1-taskforce` リポジトリにインストールする（このリポジトリだけを選ぶ）。
3. リポジトリを開くと、`.pages.yml` の設定どおりに「活動実績」「メンバー」「活動写真」が表示される。
4. Collaborators（共同編集者）の画面で、メンバーのメールアドレスを入力して招待する。招待された人は GitHub アカウントなしで編集できる。
5. 招待した人には、上の「メンバー用の入口（下書き）」の URL を伝える。

### 手元のフォルダで編集するとき

管理画面からの更新は GitHub 上に直接保存されます。手元で作業を始める前に、必ず最新版を取り込んでください。

```bash
git pull
```

## 仕組み

- `data/activities.json` と `data/members.json` が内容の本体。`assets/js/main.js` がこれを読み込んでページに表示する。
- 承認の仕組み：メンバーの保存先は `draft` ブランチ。本番の `main` ブランチは保護ルールで管理者以外が直接書き込めない。`.github/workflows/` の自動処理が、承認依頼の作成と、公開後に下書きを本番に揃える作業を行う。
- `.pages.yml` が管理画面の入力欄の定義。項目を増やしたいときはここと `main.js` を直す。
- ヘッダー・フッター: 各ページに同じ内容が入っているので、変更時は5ページすべてを直す。
- トップのスライドショー: `assets/img/hero/` の `01.jpg`〜`04.jpg` を同じ名前で差し替える。
- 色やフォント: `assets/css/style.css` 冒頭の `:root` の変数を変える。

## 手元で確認する

```bash
python3 -m http.server 8765
```

を実行して http://localhost:8765 を開く（ファイルを直接ダブルクリックで開くと、活動実績とメンバーが表示されません）。
