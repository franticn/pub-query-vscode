const vscode = require('vscode');
const util = require('./util');
const api = require('./query')
/**
 * 自动提示实现，这里模拟一个很简单的操作
 * 当输入 this.dependencies.xxx时自动把package.json中的依赖带出来
 * 当然这个例子没啥实际意义，仅仅是为了演示如何实现功能
 * @param {*} document 
 * @param {*} position 
 */
async function provideCompletionItems(document, position) {
    const line = document.lineAt(position);
    // 只截取到光标位置为止，防止一些特殊情况
    const lineText = line.text.substring(0, position.character);
    console.log("lineText => " + lineText)
    const fileName = document.fileName;
    const editor = vscode.window.activeTextEditor;
    const posline = editor.selection.active;
    const { text } = document.lineAt(posline);
    
    if (/\/pubspec\.yaml$/.test(fileName) && lineText.length != 0) {
        let packages = await api.queryPackage2(lineText)
        const currentLineReplaceRange = new vscode.Range(new vscode.Position(posline.line, position.character), new vscode.Position(posline.line, text.length))

        return packages.map(getCompletionItem(currentLineReplaceRange))
    }
}

const getCompletionItem = (range) => (item) => {
    const packageName = item.package
    const content = new vscode.CompletionItem(packageName,vscode.CompletionItemKind.Module)
    content.additionalTextEdits = [vscode.TextEdit.delete(range)];
	content.insertText = `${packageName}: `;
    return content
}

/**
 * 光标选中当前自动补全item时触发动作，一般情况下无需处理
 * @param {*} item 
 * @param {*} token 
 */
function resolveCompletionItem(item, token) {
    util.log(`select item -> ${item.package}`)
    return item;
}

module.exports = function (context) {
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('yaml', {
        provideCompletionItems,
        resolveCompletionItem
    }))
}