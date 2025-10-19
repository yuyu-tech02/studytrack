# StudyTrack プロジェクト概要

## プロジェクト情報

**プロジェクト名**: StudyTrack
**バージョン**: 1.0.0
**ライセンス**: MIT
**目的**: 学習時間の記録・可視化によるモチベーション向上

## 技術スタック詳細

### フロントエンド
- **React 18**: 最新のReact機能を活用したUI構築
- **TypeScript**: 型安全性による開発効率向上
- **Vite**: 高速な開発サーバーとビルド
- **Tailwind CSS**: ユーティリティファーストのスタイリング

### バックエンド/インフラ
- **Supabase**: PostgreSQL + Auth + Storage
  - Row Level Security (RLS) による安全なデータアクセス
  - Email OTP認証
  - リアルタイムデータベース

### ライブラリ
- **React Router**: SPAルーティング
- **Chart.js + react-chartjs-2**: グラフ描画
- **date-fns**: 日付処理
- **react-hot-toast**: トースト通知

### PWA
- **vite-plugin-pwa**: Service Worker生成
- **Workbox**: キャッシュ戦略

## アーキテクチャ

### データフロー

```
User Input
    ↓
React Component
    ↓
Custom Hook (useStudySessions)
    ↓
Supabase Client
    ↓
Supabase Database (PostgreSQL)
    ↓
Local Storage (オフライン時)
```

### 認証フロー

```
1. User enters email
2. Supabase sends magic link
3. User clicks link
4. Session created
5. Redirect to Dashboard
```

### オフライン同期フロー

```
Online:
  Add Session → Supabase → Update UI

Offline:
  Add Session → LocalStorage → Update UI

Online復帰:
  Sync LocalStorage → Supabase → Clear LocalStorage
```

## データベース設計

### profiles テーブル
- `id`: UUID (Primary Key, auth.users参照)
- `display_name`: TEXT
- `created_at`: TIMESTAMPTZ

### study_sessions テーブル
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key → profiles.id)
- `subject`: TEXT (科目名)
- `minutes`: INTEGER (1-1440)
- `started_at`: TIMESTAMPTZ (学習開始時刻)
- `note`: TEXT (メモ、任意)
- `created_at`: TIMESTAMPTZ

### インデックス
- `idx_study_sessions_user_id`: user_idでの高速検索
- `idx_study_sessions_started_at`: 日付での高速ソート
- `idx_study_sessions_user_started`: ユーザー別の日付ソート

## セキュリティ

### Row Level Security (RLS)
各ユーザーは自分のデータのみアクセス可能：
- SELECT: `auth.uid() = user_id`
- INSERT: `auth.uid() = user_id`
- UPDATE: `auth.uid() = user_id`
- DELETE: `auth.uid() = user_id`

### 環境変数
機密情報は環境変数で管理：
- `VITE_SUPABASE_URL`: Supabase URL
- `VITE_SUPABASE_ANON_KEY`: 公開APIキー

## パフォーマンス最適化

### フロントエンド
- React.memo によるコンポーネント再レンダリング防止
- useMemo による統計計算のメモ化
- 遅延ローディング（必要に応じて追加可能）

### データベース
- インデックスによるクエリ高速化
- RLSによる不要なデータフェッチの防止

### PWA
- Service Worker によるアセットキャッシュ
- オフラインファースト設計

## 開発ガイドライン

### コーディング規約
- ESLint + Prettier による自動フォーマット
- TypeScript strict モード
- 関数型プログラミング優先
- コンポーネントは小さく保つ

### Git フロー
```
main (本番環境)
  ↓
develop (開発環境)
  ↓
feature/* (機能ブランチ)
```

### コミットメッセージ
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル修正
refactor: リファクタリング
test: テスト追加・修正
chore: ビルド・ツール関連
```

## テスト戦略（今後の実装推奨）

### ユニットテスト
- Vitest によるユーティリティ関数テスト
- React Testing Library によるコンポーネントテスト

### E2Eテスト
- Playwright によるユーザーフローテスト

### テストカバレッジ目標
- 80%以上

## デプロイメント

### 開発環境
- Vercel Preview Deployment
- 各プルリクエストごとに自動デプロイ

### 本番環境
- Vercel Production
- `main` ブランチへのマージで自動デプロイ

### CI/CD
```
Push to GitHub
    ↓
Vercel Build
    ↓
TypeScript Compilation
    ↓
Vite Build
    ↓
Deploy
```

## モニタリング（推奨）

### フロントエンド
- Vercel Analytics
- Sentry (エラートラッキング)

### バックエンド
- Supabase Dashboard
- データベースクエリパフォーマンス

## 今後の拡張計画

### Phase 2
- [ ] タグ機能
- [ ] 目標設定機能
- [ ] 週次/月次レポート

### Phase 3
- [ ] SNS共有機能
- [ ] チーム機能
- [ ] カレンダービュー

### Phase 4
- [ ] AI学習推奨
- [ ] ゲーミフィケーション
- [ ] モバイルアプリ（React Native）

## 貢献ガイド

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## ライセンス

MIT License - 詳細は [LICENSE](./LICENSE) ファイルを参照

## 連絡先

プロジェクトに関する質問や提案は、GitHubのIssuesまでお願いします。

---

**作成日**: 2025年10月
**最終更新**: 2025年10月
