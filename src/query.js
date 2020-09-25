const vscode = require('vscode');
const axios = require('axios');
const util = require('./util');

// 根据关键字查询 并返回对应的依赖库列表
exports.queryPackage = queryPackageByKeyword

async function queryPackageByKeyword(keyword) {
    let newKeyword = keyword.trim()
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
}

// 根据依赖库的名称查询对应库所对应的版本号列表
exports.queryPackageVersions = queryVersionByName

async function queryVersionByName(packageName) {
    let newPkgName = packageName.trim()
    newPkgName = newPkgName.replace(':', '')
    newPkgName = newPkgName.replace(' ', '')
    const baseUrl = vscode.workspace.getConfiguration().get('pub-query.originUrlSetting')
    let requestUrl = `${baseUrl}api/documentation/${newPkgName}`
    let versions = []
    try {
        let response = await axios.default
            .get(requestUrl)
        versions = response.data.versions.reverse().map(v => {
            return v.version
        })
        // 如果lastestStable存在 需要将之前删除 并将latestStableVersion添加到首位
        if (response.data.latestStableVersion != undefined && response.data.latestStableVersion.length != 0) {
            if (versions.indexOf(response.data.latestStableVersion) != -1) {
                versions.splice(versions.indexOf(response.data.latestStableVersion), 1)
            }
            versions.splice(0, 0, response.data.latestStableVersion)
        }
    } catch (error) {
        return versions
    } finally {
        return versions
    }
}