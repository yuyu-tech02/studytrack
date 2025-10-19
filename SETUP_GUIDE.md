# StudyTrack セットアップガイド

このガイドでは、StudyTrackプロジェクトのセットアップから開発開始までの手順を説明します。

## 前提条件

- Node.js 18以上がインストールされていること
- npmまたはyarnがインストールされていること
- Supabaseアカウント（無料で作成可能）

## ステップ1: 依存関係のインストール

プロジェクトルートで以下のコマンドを実行します：

```bash
npm install
```

## ステップ2: Supabaseプロジェクトのセットアップ

### 2.1 Supabaseアカウントの作成

1. [Supabase](https://supabase.com/)にアクセス
2. 「Start your project」をクリック
3. GitHubまたはメールでサインアップ

### 2.2 新規プロジェクトの作成

1. ダッシュボードで「New Project」をクリック
2. プロジェクト名: `studytrack`（任意）
3. Database Password を設定（強力なパスワードを使用）
4. Region を選択（日本なら `Northeast Asia (Tokyo)` を推奨）
5. 「Create new project」をクリック

プロジェクトの作成には1〜2分かかります。

### 2.3 データベースのセットアップ

1. Supabaseダッシュボードの左メニューから「SQL Editor」を選択
2. 「New query」をクリック
3. プロジェクトルートの `supabase-setup.sql` の内容をコピー&ペースト
4. 「Run」をクリックして実行

以下のテーブルとポリシーが作成されます：
- `profiles` テーブル
- `study_sessions` テーブル
- Row Level Security (RLS) ポリシー
- インデックス
- 自動プロファイル作成トリガー

### 2.4 認証設定

1. 左メニューから「Authentication」→「Settings」を選択
2. 「Email Auth」セクションで以下を確認：
   - ✅ Enable Email provider
   - ✅ Confirm email（テスト時はOFFでも可）
3. 「Email Templates」で必要に応じてメールテンプレートをカスタマイズ
4. 「URL Configuration」で以下を設定：
   - Site URL: `http://localhost:5173`（開発時）
   - Redirect URLs: `http://localhost:5173/**`

## ステップ3: 環境変数の設定

### 3.1 Supabase認証情報の取得

1. Supabaseダッシュボードの「Settings」→「API」を開く
2. 「Project URL」をコピー
3. 「Project API keys」の「anon public」キーをコピー

### 3.2 .envファイルの作成

プロジェクトルートで以下を実行：

```bash
cp .env.example .env
```

`.env` ファイルを開いて、以下のように設定：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**重要**: `.env` ファイルは `.gitignore` に含まれているため、GitHubにプッシュされません。

## ステップ4: 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:5173](http://localhost:5173) を開きます。

## ステップ5: 動作確認

### 5.1 ログインテスト

1. ログイン画面でメールアドレスを入力
2. メールボックスを確認し、マジックリンクをクリック
3. 自動的にダッシュボードにリダイレクトされる

### 5.2 学習記録の追加

1. 右下のFABボタン（+）をクリック
2. 科目、時間、開始時刻を入力
3. 「保存」をクリック
4. ダッシュボードに記録が表示される

### 5.3 グラフの確認

複数の学習記録を追加すると、グラフが自動的に更新されます。

## トラブルシューティング

### エラー: "Missing Supabase environment variables"

- `.env` ファイルが存在し、正しい値が設定されているか確認
- 開発サーバーを再起動（`.env` の変更後は再起動が必要）

### ログインリンクが届かない

- Supabaseダッシュボードの「Authentication」→「Logs」でエラーを確認
- スパムフォルダを確認
- Supabaseの「Email Templates」が正しく設定されているか確認

### グラフが表示されない

- ブラウザのコンソールでエラーを確認
- 学習記録が少なくとも1件以上あるか確認
- ページをリロード

### オフライン同期がうまくいかない

- ブラウザのローカルストレージをクリア
- Supabaseの接続状態を確認
- ネットワークタブでAPIリクエストを確認

## 次のステップ

### ビルド

本番用ビルドを作成：

```bash
npm run build
```

ビルド結果は `dist/` ディレクトリに出力されます。

### プレビュー

本番ビルドをローカルでプレビュー：

```bash
npm run preview
```

### デプロイ

Vercelへのデプロイ方法は [README.md](./README.md) を参照してください。

## 開発のヒント

### コンポーネント構造

```
src/
├── components/     # 再利用可能なUIコンポーネント
├── hooks/         # カスタムReactフック
├── lib/           # 外部サービス設定
├── pages/         # ページコンポーネント
├── types/         # TypeScript型定義
└── utils/         # ユーティリティ関数
```

### 新機能の追加

1. `src/types/index.ts` で必要な型を定義
2. `src/components/` または `src/pages/` にコンポーネントを追加
3. 必要に応じて `src/hooks/` にカスタムフックを追加
4. `src/utils/` にビジネスロジックを追加

### デバッグ

- React Developer Tools を使用
- Supabaseダッシュボードの「Table Editor」でデータを直接確認
- ブラウザのNetwork タブでAPIリクエストを確認

## サポート

問題が発生した場合：

1. このガイドとREADME.mdを再確認
2. GitHubのIssuesで報告
3. Supabase公式ドキュメントを確認

Happy Coding! 🚀
