# StudyTrack - 学習時間記録・可視化アプリ

![StudyTrack](https://via.placeholder.com/1200x600/38B2AC/ffffff?text=StudyTrack)

## 概要

**StudyTrack** は、個人の学習時間を簡単に記録・可視化できるWebアプリケーションです。「どの科目を」「何分学習したか」を登録し、その履歴を自動集計・グラフ化して進捗を確認できます。

「毎日の学習を見える化し、モチベーションを継続させる」ことを目的としています。

## 主な機能

### 📝 学習記録管理
- 科目、時間、開始時刻、メモを記録
- 学習記録の追加・編集・削除（CRUD操作）
- オフライン時はローカルストレージに一時保存し、オンライン復帰時に自動同期

### 📊 統計・可視化
- 日別・週別・月別の学習時間推移（棒グラフ）
- 科目別学習時間の割合（円グラフ）
- 統計カード表示
  - 今日の学習時間
  - 連続学習日数
  - 平均学習時間
  - 総学習時間

### 🔐 認証機能
- Supabase Email OTP認証（マジックリンク）
- セキュアなRow Level Security（RLS）適用

### 📱 PWA対応
- スマートフォンのホーム画面に追加可能
- オフラインでも閲覧可能（Service Worker）
- モバイル・PC両対応（レスポンシブデザイン）

### 🌙 ダークモード対応
- システム設定に応じた自動切り替え

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フロントエンド | React 18 + TypeScript |
| ビルドツール | Vite |
| スタイリング | Tailwind CSS |
| グラフ描画 | Chart.js + react-chartjs-2 |
| 認証・DB | Supabase |
| ルーティング | React Router v6 |
| 通知 | react-hot-toast |
| 日付処理 | date-fns |
| PWA | vite-plugin-pwa |
| デプロイ | Vercel（推奨） |

## セットアップ手順

### 1. リポジトリをクローン

```bash
git clone https://github.com/yourusername/studytrack.git
cd studytrack
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. Supabaseプロジェクトのセットアップ

#### 3.1 Supabaseアカウント作成
[Supabase](https://supabase.com/)でアカウントを作成し、新しいプロジェクトを作成します。

#### 3.2 データベーステーブルの作成

SupabaseのSQL Editorで以下のSQLを実行してください：

```sql
-- profiles テーブル
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- study_sessions テーブル
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  minutes INTEGER NOT NULL CHECK (minutes > 0 AND minutes <= 1440),
  started_at TIMESTAMPTZ NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security を有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- profiles のポリシー
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- study_sessions のポリシー
CREATE POLICY "Users can view own sessions"
  ON study_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON study_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON study_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- インデックス作成
CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX idx_study_sessions_started_at ON study_sessions(started_at);
```

#### 3.3 認証設定

Supabaseダッシュボードの `Authentication > Settings` で以下を設定：
- Enable Email OTP
- Site URL を設定（ローカル開発時は `http://localhost:5173`）

### 4. 環境変数の設定

`.env.example` をコピーして `.env` を作成し、Supabaseの認証情報を設定します：

```bash
cp .env.example .env
```

`.env` ファイルを編集：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Supabaseダッシュボードの `Settings > API` から取得できます。

### 5. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

### 6. ビルド

```bash
npm run build
```

### 7. プレビュー

```bash
npm run preview
```

## デプロイ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com/)にログイン
2. 新しいプロジェクトをインポート
3. 環境変数を設定：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. デプロイ

## プロジェクト構造

```
studytrack/
├── public/                # 静的ファイル
├── src/
│   ├── components/        # Reactコンポーネント
│   │   ├── AddSessionModal.tsx
│   │   ├── Charts.tsx
│   │   ├── SessionList.tsx
│   │   └── StatsCards.tsx
│   ├── hooks/            # カスタムフック
│   │   ├── useAuth.ts
│   │   └── useStudySessions.ts
│   ├── lib/              # 外部サービス設定
│   │   └── supabase.ts
│   ├── pages/            # ページコンポーネント
│   │   ├── Dashboard.tsx
│   │   └── Login.tsx
│   ├── types/            # TypeScript型定義
│   │   └── index.ts
│   ├── utils/            # ユーティリティ関数
│   │   ├── statistics.ts
│   │   └── storage.ts
│   ├── App.tsx           # アプリケーションルート
│   ├── main.tsx          # エントリーポイント
│   └── index.css         # グローバルスタイル
├── .env.example          # 環境変数テンプレート
├── index.html            # HTMLテンプレート
├── package.json
├── tailwind.config.js    # Tailwind CSS設定
├── tsconfig.json         # TypeScript設定
└── vite.config.ts        # Vite設定
```

## 使い方

1. **ログイン**: メールアドレスを入力してマジックリンクを受信
2. **記録追加**: 右下のFABボタンから学習記録を追加
3. **統計確認**: ダッシュボードでグラフと統計を確認
4. **記録編集**: 各記録の編集・削除ボタンで管理

## 今後の拡張案

- [ ] タグ／カテゴリ別の分析
- [ ] 学習目標設定と達成率表示
- [ ] SNS共有機能（Twitter/X, Threads）
- [ ] モチベーション通知機能
- [ ] CSVエクスポート
- [ ] 週次・月次レポート機能

## ライセンス

MIT License

## 作者

Your Name

## 謝辞

このプロジェクトは、学習習慣の定着とモチベーション維持を支援するために作成されました。
# studytrack
# studytrack
