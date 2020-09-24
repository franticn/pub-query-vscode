const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
exports.activate = function (context) {
	console.log('插件被激活了')
	// console.log(vscode)

	require('./completion')(context) // 由当前光标所在位置来判断是否需要查询依赖库
	require('./hover')(context) // 查询悬浮
	require('./test')(context) // 查询悬浮
}

exports.deactivate = function (context) {
	console.log('your extension "pub-query" is now deactivate!')
}

