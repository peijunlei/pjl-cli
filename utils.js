


const fs = require('fs-extra')
const ejs = require('ejs')
const path = require('path')
const chalk = require('chalk')
const log = console.log
function convertToPascalCase(inputString) {
  return inputString.replace(/-(\w)/g, (match, letter) => letter.toUpperCase()).replace(/^\w/, (c) => c.toUpperCase());
}
function copyDir(sourceDir, targetDir, data) {
  fs.emptyDirSync(targetDir)
  const files = fs.readdirSync(sourceDir);
  for (const file of files) {
    const sourceFilePath = path.join(sourceDir, file);
    const targetFilePath = path.join(targetDir, file);

    const stat = fs.statSync(sourceFilePath);
    if (stat.isDirectory()) {
      copyDir(sourceFilePath, targetFilePath,data);
    } else {
      //判断文件是不是.ejs的，通过ejs渲染为.tsx
      if (sourceFilePath.endsWith('.ejs')) {
        const tempContent = fs.readFileSync(sourceFilePath, 'utf-8');
        const result = ejs.render(tempContent, data);
        fs.writeFileSync(targetFilePath.replace('.ejs', '.tsx'), result);
      } else {
        // neesStyle为false时，不复制 .less 文件
        if (!data.needStyle && sourceFilePath.endsWith('.less')) {
          continue;
        }
        fs.copySync(sourceFilePath, targetFilePath);
      }
    }
  }
}
function logSuccess(msg) {
  log(chalk.green(msg))
}
function logError(msg) {
  log(chalk.red(msg))
}
module.exports = {
  convertToPascalCase,
  copyDir,
  logSuccess,
  logError
}
