// 实现require module关键字
const cacheModules = {};

// 放在全局方便查找加载错误
window.cacheModules = cacheModules;

function moduleFactory(file) {
  return {
    moduleName: file,
    exports: null,
    isLoader: false,
  };
}


function require(file) {
  const fileName = file.split('.')[0];

  // 已经加载过
  if (cacheModules[fileName]) {
    return cacheModules[fileName].exports;
  }

  // 还未加载过,执行加载流程
  const module = moduleFactory(file);

  eval(`${fileName}(require, module, module.exports)`);
  cacheModules[fileName] = module;
  return cacheModules[fileName].exports;
}


// window.require = require;
