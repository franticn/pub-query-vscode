const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
exports.activate = function (context) {
	console.log('插件被激活了')
	// console.log(vscode)

	require('./completion')(context) // 查询依赖库
	require('./completion-version')(context) // 查询库所对应的版本号
	// require('./hover')(context) // 查询悬浮
}

exports.deactivate = function (context) {
	console.log('your extension "pub-query" is now deactivate!')
}

