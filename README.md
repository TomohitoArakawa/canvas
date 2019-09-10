## ■実装タスク

### ①FileAPIでcanvasに画像描画
* 描画範囲
 * 場合によってはcanvasタグは2つ必要になる
* 削除機能
* ファイル形式制御
* ファイル容量制御
* 初回表示画像サイズ制御　※大きすぎる場合
 * アップロード後の初回描画時の最大幅を決めたい　→　初回が大きすぎるとユーザー・製作者共々に弊害が大きい

### ②ピンチで拡大縮小
* 解像度検知
 * 元サイズ / 現サイズ が1を下回るかつ以下の判定条件？
 * 想定元画像画素の72dpi・印刷に必要な300dpi・印刷範囲の寸法などから算出？
* PC時のイベント処理
 * マウスウィール？
 * レンチ？

### ③ドラッグ・タッチムーブで移動
* デバイスでイベント分ける
 * addEventListener関数には複数のイベントタイプにまとめて同じイベントハンドラ関数を設定する方法はない -> どちらにしても2回呼び出す必要性はありそう
* 編集中の倍率を保持して移動

### ④レンチで回転
* input type=rangeのcssスタイリングはゼロベースだと結構工数がかかる
 * Uikit使用？　※どちらにしても参照はする必要がある
* 画像アップロードまでdisabled
* 画像削除後も再びdisabled

### ⑤プレビュー時にクリッピングマスク？
* 印刷範囲外も見えるようにする -> img? = imgにも同じイベント処理?
* 印刷範囲内外の区切りを明確にする

### ⑥保存・送信時に必要データを渡す
* store(Local storage)
 1. ユーザーID(遷移元によるがある場合)
 2. 選択ケース(デバイス機種)情報
 3. 元画像
 4. サンプル画像
 5. 縮尺比(元画像との)
 6. xy座標
 7. 角度
* store(Local strage)保存情報の削除
 * 保存・送信時に削除が望ましいと判断
* axios
 * keyとvalueの連想配列
 * 非同期通信で送信

### ⑦保存一覧からの再起
* api
 * ⑥storeの1～7に加えて商品ID的な識別子が必要？　※保存時にバックエンド側で生成する
 * 上記をカスタマイズ画面遷移時にセット(関数実行・描画)
 * 再保存した場合のDB保存先 ※上書き or 新規？

### ■Javascript
#### □canvas
setTransform(a, b, c, d, e, f)
drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)