const path = require('path');
const express = require('express');
// const forceSsl = require('force-ssl-heroku');
// const exec = require('child_process').exec;
// サーバをインスタンス化する 
const app = express();


// http ⇒ https リダイレクト
// app.use(forceSsl);

// // 以下の設定だけで dist/index.html も返せてはいる
app.use(express.static(`${__dirname}/dist`));
// app.use(express.static(`${__dirname}`));

// // ルートへのアクセス時は念のため dist/index.html を確実に返すようにしておく
app.get('/*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/dist/index.html`));
  // res.sendFile(path.join(`${__dirname}/index.html`));
});
// // サーバ起動
// const server = app.listen(process.env.PORT || 8080, () => {
const server = app.listen(process.env.PORT || 3001, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Listening at http://${host}:${port}`);
  });