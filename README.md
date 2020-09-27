# pub-query README

这是一个帮助Flutter/Dart开发者在pubspec.yaml上快速依赖所需要库的VSCode的插件

## 快速预览

![使用预览](https://github.com/franticn/pub-query-vscode/blob/dev/preview/preview1.gif?raw=true)

## 使用帮助

此插件只支持在`pubspec.yaml`文件当中的`dependencies`及`dev_dependencies`代码块当中进行使用，前面必须空2格，第一次会根据输入的关键字搜索插件库，再选中对应插件之后，当你按下`:`会再次根据你当前`:`之前的插件名查询对应的版本号

这样做的原因是pub.dev没有直接根据关键字查询插件和对应版本的api

## 插件设置

如果发现在安装插件后插件不工作或者suggestion弹窗不显示，请依次打开**命令面板->搜索json->打开设置(json)**，在打开的`settings.json`中设置如下代码

```json
"[yaml]": {
        "editor.quickSuggestions": {
            "other": true,
            "comments": true,
            "strings": true
        }
    },
```



## 已知问题

- 暂不支持自定义某些api的私有pub

## 即将到来

- 支持部分自定义Api
- 加入错误提醒



## 参考

[VSCode插件开发全攻略](https://github.com/sxei/vscode-plugin-demo)






