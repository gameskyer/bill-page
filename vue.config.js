const { defineConfig } = require('@vue/cli-service')
const path = require('path');
const resolve = (dir) => {
  return path.join(__dirname, dir);
};
module.exports = defineConfig({
  lintOnSave: false,
  //   client: { 
  //     overlay: false  // 关闭浏览器中的红色错误提示层
  // },
  //是否在保存时检查
  devServer: {
    host: 'localhost', //本机ip
    port: 8081, //本机端口
    open: true,
    // proxy: {
    // 	'/api': {
    // 		//代理别名
    // 		target: 'http://localhost:8004', //代理目标值
    // 		changeOrigin: true,
    // 		secure: true,
    // 		pathRewrite: {
    // 			//替换路径中的/api
    // 			'^/api': '',
    // 		},
    // 		/*pathRequiresRewrite: {
    //       '^/api': ''
    //     }*/
    // 	},
    // },
   

  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [resolve('path/to/global.less')],
    },
  },
  transpileDependencies: true,
})
