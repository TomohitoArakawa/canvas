var path = require('path');

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/js')
    },
    module: {
    	rules: [
    	{
    	// 拡張子 .js の場合
    	test: /\.js$/,
        use: [
        {
        	// Babel を利用する
        	loader: "babel-loader",
        	// Babel のオプションを指定する
        	options: {
        		presets: [
                // プリセットを指定することで、ES2019 を ES5 に変換
                "@babel/preset-env"
              ]
            }
          }
        ]
      }
    ]
  }
};