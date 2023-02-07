/**
 * cmd格式文件包装
 */
const fs = require('fs');
const path = require('path');

const rootPath = process.cwd();
if (process.argv.length <= 2) throw new Error('[vue-mini] 没有传入入口文件路径');

const sourcePath = process.argv[2];
const outputPath = process.argv.length >= 4 ? process.argv[3] : 'output';

const sourceAbsolutePath = path.join(rootPath, sourcePath);
const outputAbsolutePath = path.join(rootPath, outputPath);
const files = fs.readdirSync(sourceAbsolutePath);

let bundle = '';

/**
 * 文件包装
 * @param file
 * @returns {string}
 */
function generateFile(file) {
  const fileContent = fs.readFileSync(path.join(sourceAbsolutePath, file));
  const fileName = file.split('.')[0];
  return `
  function  ${fileName}(require, module, exports){
   ${fileContent}   
  }
 `;
}

files.map((file) => {
  const fileContent = generateFile(file);
  bundle = ` ${bundle} \n // ***** 打包信息记录: filename = ${file} 文件开始 ***** \n   ${fileContent}  \n // ***** 打包信息记录: filename = ${file} 文件结束 *****  \n`;
});

bundle = `${bundle} \n  index()`

// 输出最终文件
if (fs.existsSync(outputAbsolutePath)) {
  fs.rmdirSync(outputAbsolutePath, {
    recursive: true,
  });
}
fs.mkdirSync(outputAbsolutePath);
fs.writeFileSync(path.join(outputAbsolutePath, 'bundle.js'), bundle);
