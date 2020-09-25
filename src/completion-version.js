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
    // 只截取到光标位置为止，防止一些特殊情况
    const fileName = document.fileName;
    const editor = vscode.window.activeTextEditor;
    const posline = editor.selection.active;
    const { text } = document.lineAt(posline);
    // 是否有且只有一个冒号
    const onlyOneSym = (text.split(':').length - 1) == 1
    const correctLeadStr = text.startsWith('  ')
    if (/\/pubspec\.yaml$/.test(fileName) && onlyOneSym && correctLeadStr && isInDependenciesBlock(document)) {
        let versions = await api.queryPackageVersions(text)
        const currentLineReplaceRange = new vscode.Range(new vscode.Position(posline.line, position.character), new vscode.Position(posline.line, text.length))
        return versions.map(getCompletionItem(currentLineReplaceRange))
    }
}
const getCompletionItem = (range) => (version, index) => {
    let versionStr = index == 0 ? `${version} (latestStable)` : version
    const content = new vscode.CompletionItem(versionStr, vscode.CompletionItemKind.Value)
    content.sortText = `${index}`

    content.additionalTextEdits = [vscode.TextEdit.insert(range.end, ` ${version}`)]
    content.insertText = ` ${version}`
    return content
}


const isInDependenciesBlock = (document) => {
    // 遍历当前文档的总行数 找到 dev_dependencies: dependencies:所在位置(depBlockLine devDepBlockLine)
    // 还需要保存下这2个顶级block所在的下一个顶级block的位置(depNextBlockLine devDepNextBlockLine)
    let result = false
    try {
        let totalCount = document.lineCount - 1
        let depBlockLine
        let devDepBlockLine
        let depNextBlockLine
        let devDepNextBlockLine
        let lastBlockLine
        while (totalCount >= 0) {
            if (document.lineAt(totalCount) === undefined
                || document.lineAt(totalCount).text === undefined
                || document.lineAt(totalCount).text.length == 0
                || document.lineAt(totalCount).text.startsWith(' ')) {

            } else {
                let findLineText = document.lineAt(totalCount).text
                findLineText.toString()
                if (findLineText.startsWith('dependencies:')) {
                    depBlockLine = document.lineAt(totalCount).lineNumber
                    depNextBlockLine = lastBlockLine
                }
                if (findLineText.startsWith('dev_dependencies:')) {
                    devDepBlockLine = document.lineAt(totalCount).lineNumber
                    devDepNextBlockLine = lastBlockLine
                }
                lastBlockLine = document.lineAt(totalCount).lineNumber
            }
            totalCount--

        }
        const editor = vscode.window.activeTextEditor
        const currentLine = editor.selection.active.line
        result = (currentLine > devDepBlockLine && currentLine < devDepNextBlockLine) || (currentLine > depBlockLine && currentLine < depNextBlockLine)
    } catch (error) {
        util.error(error)
    } finally {
        return result
    }
}

/**
 * 光标选中当前自动补全item时触发动作，一般情况下无需处理
 * @param {*} item 
 * @param {*} token 
 */
function resolveCompletionItem(item, token) {
    return item;
}

module.exports = function (context) {
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('yaml', {
        provideCompletionItems,
        resolveCompletionItem
    }, ':'))
}