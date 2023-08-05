


const fs = require('fs-extra')
const ejs = require('ejs')
const path = require('path')
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
      copyDir(sourceFilePath, targetFilePath);
    } else {
      //判断文件是不是.ejs的，通过ejs渲染为.tsx
      if (sourceFilePath.endsWith('.ejs')) {
        const tempContent = fs.readFileSync(sourceFilePath, 'utf-8');
        const result = ejs.render(tempContent, data);
        fs.writeFileSync(targetFilePath.replace('.ejs', '.tsx'), result);
      } else {
        fs.copySync(sourceFilePath, targetFilePath);
      }
    }
  }
}

module.exports = {
  convertToPascalCase,
  copyDir
}
