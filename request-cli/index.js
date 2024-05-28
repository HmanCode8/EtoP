const fs = require("fs");
const readline = require("readline");
const path = require("path");
// 创建一个读取终端输入的接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("欢迎使用请求函数生成工具！", __dirname);

rl.question("请输入需要生成的模版json文件：", (jsonName) => {
  fs.readFile(
    path.join(__dirname, `/${jsonName}.json`),
    "utf-8",
    (err, data) => {
      if (err) {
        console.error("读取package.json失败：", err);
      } else {
        const mks = JSON.parse(data);
        const keys = Object.keys(mks);
        // 请输入文件名
        rl.question("请输入请求函数文件名（不含扩展名）：", (name) => {
          // 生成请求函数代码
          let requestCode = 'import request from "@/untils/request";\n\n';
          let exportCode = "export {\n";

          keys.forEach((k) => {
            const {
              url = "test",
              method = "test",
              description = "",
              body = {},
            } = mks[k];
            const { type = "object", properties = {}, required = [] } = body;
            requestCode += generateRequestFunction({
              functionName: k,
              requestMethod: method.toLocaleLowerCase(),
              requestPath: url,
              description,
              properties,
            });
            exportCode += `  ${k},\n`;
          });

          exportCode += "};\n";

          // 将请求函数代码和导出代码写入文件
          const fileName = path.join(__dirname, `/request/${name}.ts`);
          fs.writeFile(fileName, requestCode + "\n" + exportCode, (err) => {
            if (err) {
              console.error("写入文件失败：", err);
            } else {
              console.log(`已生成请求函数代码文件：${fileName}`);
            }
            // 关闭读取终端输入的接口
            rl.close();
          });
        });
      }
    }
  );
});

// 生成请求函数代码
function generateRequestFunction(params) {
  const { functionName, requestMethod, requestPath, description, properties } =
    params;
  const { name, email, password } = properties;
  const interfaceName = `${functionName
    .charAt(0)
    .toUpperCase()}${functionName.slice(1)}Params`;
  return `
interface ${interfaceName} {
  ${Object.keys(properties)
    .map((k) => `${k}: ${properties[k].type};`)
    .join("\n  ")}
}

/**
 * ${functionName}
 * @param params 请求参数
 * @returns 返回值描述
 * ${description}
 */
const ${functionName} = (params: ${interfaceName}) => {
    return request.${requestMethod}("/api${requestPath}", params);
};
`;
}
