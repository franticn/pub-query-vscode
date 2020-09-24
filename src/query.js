const vscode = require('vscode');
const axios = require('axios');
const util = require('./util');

// 根据关键字查询 并返回对应的依赖库列表
exports.queryPackage = function (keyword) {
    let newKeyword = keyword.trim()
    util.log('搜索的关键字 -> ' + newKeyword)
    const baseUrl = vscode.workspace.getConfiguration().get('pub-query.originUrlSetting');
    let requestUrl = `${baseUrl}api/search?q=${newKeyword}`;
    return axios.default
        .get(requestUrl)
    // if (keyword === undefined || keyword.trim() === '') {
    //     vscode.window.showInformationMessage('关键字不能为空');
    //     return packages;
    // } else {
    //     keyword = keyword.trim();
    //     // 获取设置的baseUrl
    //     const baseUrl = vscode.workspace.getConfiguration().get('pub-query.originUrlSetting');
    //     // 校验url是否符合规范
    //     if (!util.isUrl(baseUrl)) {
    //         vscode.window.showErrorMessage("设置里面的url不符合规范");
    //         return Promise.reject;
    //     }
    // }

}

// 根据关键字查询 并返回对应的依赖库列表
exports.queryPackage2 = queryPackageByKeyword


async function queryPackageByKeyword(keyword) {
    let newKeyword = keyword.trim()
    util.log('搜索的关键字 -> ' + newKeyword)
    const baseUrl = vscode.workspace.getConfiguration().get('pub-query.originUrlSetting');
    let requestUrl = `${baseUrl}api/search?q=${newKeyword}`;
    let packages = []
    try {
        let res = await axios.default
            .get(requestUrl)
        packages = res.data.packages
    } catch (error) {
        throw error
    } finally {
        return packages
    }

    // .then((response) => {
    //     if (response != undefined && response.status === 200) {
    //         // 请求成功了
    //         packages = response.data.packages;
    //         util.log(' ==== 获取到的数据为 ==== ')
    //         packages.forEach(item => {
    //             util.log(`package : ${item.package}`)
    //         })
    //         util.log(' ===================== ')
    //     } else {
    //         var errorMsg;
    //         if (response === undefined) {
    //             errorMsg = '未请求到任何数据';
    //         } else {
    //             errorMsg = `请求异常,错误码:${response.status} 错误信息:${response.data}`;
    //         }
    //         vscode.window.showErrorMessage(errorMsg);
    //     }
    // })
    // .catch((error) => {
    //     console.log(`Error : ${error}`);
    // })
    // .finally(() => {
    //     return Promise
    // })
}

// 根据依赖库的名称查询对应库所对应的版本号列表
exports.queryPackageVersions = function (packageName) {
    // 获取设置的baseUrl
    const baseUrl = vscode.workspace.getConfiguration().get('pub-query.originUrlSetting')
    let requestUrl = `${baseUrl}api/documentation/${packageName}`
    var versions = []
    axios.default
        .get(requestUrl)
        .then((response) => {
            if (response != undefined && response.status === 200) {
                // 请求成功了
                versions = response.data.versions
            } else {
                var errorMsg
                if (response === undefined) {
                    errorMsg = '未请求到任何数据'
                } else {
                    errorMsg = `请求异常,错误码:${response.status} 错误信息:${response.data}`
                }
                vscode.window.showErrorMessage(errorMsg)
            }
        }).catch((error) => {
            console.log(`${requestUrl} Error : ${error}`)
        }).finally(() => {
            console.log(`请求到的${packageName}对应的版本为${versions.toString}`)
            return versions
        })
}