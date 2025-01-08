#! /usr/bin/env node
const { input, select } = require('@inquirer/prompts')
const { program } = require('commander')
const path = require('path')
const pkg = require('./package.json')
const fs = require('fs-extra')
const ejs = require('ejs')
const ora = require('ora') // 加载动画
const chalk = require('chalk') // 粉笔
const downloadGitRepo = require('download-git-repo')

const { convertToPascalCase, copyDir, logSuccess } = require('./utils')
const templates = require('./git-templates')
const { getGitReposList } = require('./api')

// 定义当前版本
program.version(pkg.version, '-v, --version')

// 定义 create 命令
program
  .command('create [pageName] [targetPath]')
  .alias('c')
  .description('生成模板页面')
  .option('--style [bool]', '是否引入样式文件', (value) => value === 'true')
  .action(async (pageName,targetPath, options) => {
    const needStyle = options.style
    // 获取项目名称
    pageName = pageName || await input({ message: '请输入页面名称:', default: 'DemoPage' });
    // 获取项目路径
    targetPath = targetPath || await input({ message: '请输入项目路径:', default: 'src' });
    const newPageName = (pageName)
    const sourceDir = path.join(__dirname, 'templates/page-context');
    const targetDir = path.join(process.cwd(), targetPath, newPageName);
    copyDir(sourceDir, targetDir, { pageName: newPageName, needStyle });
    logSuccess(`🎉 ${newPageName} 创建成功!!!`)
  })


program.command('download').alias('d')
  .description('下载git仓库')
  .action(async () => {
    const pageName = await input({ message: '请输入目录名称:', default: 'Demo' });
    const gitName = await input({ message: '请输入git用户名:', default: 'peijunlei' });
    // 获取git仓库列表
    const gitLoading = ora('正在获取git仓库列表...')
    gitLoading.start()
    const list = await getGitReposList(gitName)
    gitLoading.succeed('🎉 获取git仓库列表成功')
    const gitPath = await select({ message: '请选择模板:', choices: list || templates });
    logSuccess(`选择模板===> ${gitPath}`)
    // 获取目标文件夹
    const targrtDir = path.join(process.cwd(), pageName)
    // 下载模板
    const loading = ora('正在下载模板...')
    loading.start()
    downloadGitRepo(gitPath, targrtDir, (err) => {
      if (!err) {
        loading.succeed('🎉 下载模板成功')
      } else {
        loading.fail('下载模板失败' + err.message)
      }
    })
  })


program.parse()
