// 实现require module关键字
const cacheModules = {

}

function moduleFactory(file){
  return {
    moduleName: file,
    exports: null,
    isLoader: false,
  }
}


function require(file){
  // 已经加载过
  if(cacheModules[file]){
    return cacheModules[file].exports
  }

  // 还未加载过,执行加载流程
  const module = moduleFactory(file)

}



