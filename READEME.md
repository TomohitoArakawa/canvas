■実装フロー
①FileAPIでcanvasに画像描画
L削除機能

②遷移して編集
Lstore

③ピンチで拡大縮小
L解像度検知

④ドラッグ・タッチムーブで移動
L倍率を保持して移動

⑤レンチで回転
Lデザイン(css:oocss)
L画像アップロードまでdisabled

⑥LocalStrageに保存

⑦プレビュー・保存時にクリッピングマスク？
L印刷範囲外も見えるようにする -> img? = imgにも同じイベント処理?
L印刷範囲内外の区切りを明確にする

⑧送信時に必要データを渡す
LLocalStrage or input value
Laxios
・デバイス情報
・元画像
・サンプル画像
・縮尺比
・xy座標
・角度

■Javascript
□canvas
setTransform(a, b, c, d, e, f)
drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)