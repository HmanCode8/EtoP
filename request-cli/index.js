const fs = require('fs')
const readline = require('readline')
const path = require('path')

// 创建一个读取终端输入的接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// 请输入文件名
rl.question('请输入请求函数文件名（不含扩展名）：', (name) => {
  // 逐步获取用户输入的信息
    const requestData = []
    rl.question('请输入请求函数名和请求路径（格式：函数名:请求方法：路径，多个使用逗号分隔）：', (input) => {
      console.log('请求函数信息：', input)
      const arr = input.split(',')
      let functionName, requestMethod, requestPath;
      arr.forEach((item) => {
        const [functionName, requestMethod, requestPath] = item.trim().split(':')
        requestData.push([functionName, requestMethod, requestPath])
      })
      // requestData.push(...input.split(',').map((item) => item.trim().split(':')))

      // 生成请求函数代码
      let requestCode = 'import request from "@/untils/request";\n\n'
      let exportCode = 'export {\n'

      requestData.forEach((item) => {
        const functionName = item[0].trim()
        const requestPath = item[1].trim()
        requestCode += generateRequestFunction(functionName, requestMethod, requestPath)
        exportCode += `  ${functionName},\n`
      })

      exportCode += '};\n'

      // 将请求函数代码和导出代码写入文件
      const fileName = path.join(__dirname, `../${name}-${requestMethod}.ts`)
      fs.writeFile(fileName, requestCode + '\n' + exportCode, (err) => {
        if (err) {
          console.error('写入文件失败：', err)
        } else {
          console.log(`已生成请求函数代码文件：${fileName}`)
        }
        // 关闭读取终端输入的接口
        rl.close()
      })
    })
})

// 生成请求函数代码
function generateRequestFunction(functionName, requestMethod, requestPath) {
  const interfaceName = `${functionName.charAt(0).toUpperCase()}${functionName.slice(1)}Params`
  return `
interface ${interfaceName} {
  username: string;
  password: string;
  email: string;
}

/**
 * ${functionName}
 * @param params 请求参数
 * @returns 返回值描述
 */
const ${functionName} = (params: ${interfaceName}) => {
    return request.${requestMethod}("/api/${requestPath}", params);
};
`
}
