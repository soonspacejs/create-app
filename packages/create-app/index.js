#!/usr/bin/env node

const path = require('path');
const fs = require('fs')
const fse = require('fs-extra');
const inquirer = require('inquirer');
const execa = require('execa');
const chalk = require('chalk')

const target = process.argv.slice(2)

const proName = target[0]
const root = path.resolve(proName)
fse.ensureDirSync(proName)
process.chdir(root)

inquirer.prompt([
  {
    name: 'VueOrReact',
    message: '使用 Vue 还是 React ?',
    type: 'list',
    choices: ['Vue', 'React'],
    default: 'Vue'
  },
  {
    name: 'IsUseSoonmanager',
    message: '是否集成 SoonManager 平台数据接入环境 ?',
    type: 'confirm',
    default: false
  }
])
  .then(async selectVal => {
    let templatePackage = '@soonspacejs/ca-vue-template'

    // Vue
    if (selectVal.VueOrReact === 'Vue') {
      const VueConfig = await inquirer.prompt([
        {
          name: 'VueVersion',
          message: '选择 Vue 版本',
          type: 'list',
          choices: ['2.x', '3.x'],
          default: '3.x'
        },
      ])

      // Vue 3.x
      if (VueConfig.VueVersion === '3.x') {
        if (selectVal.IsUseSoonmanager) templatePackage = '@soonspacejs/ca-vue-template-soonmanager'
        else templatePackage = '@soonspacejs/ca-vue-template'
      }
      // Vue 2.x
      else if (VueConfig.VueVersion === '2.x') {
        if (selectVal.IsUseSoonmanager) templatePackage = '@soonspacejs/ca-vue2-template-soonmanager'
        else templatePackage = '@soonspacejs/ca-vue2-template'
      }
    }
    // React
    else if (selectVal.VueOrReact === 'React') {
      const ReactConfig = await inquirer.prompt([
        {
          name: 'JsxOrTsx',
          message: '选择开发语言',
          type: 'list',
          choices: ['JavaScript', 'TypeScript'],
          default: 'JavaScript'
        },
      ])

      // jsx
      if (ReactConfig.JsxOrTsx === 'JavaScript') {
        if (selectVal.IsUseSoonmanager) templatePackage = '@soonspacejs/ca-react-template-soonmanager'
        else templatePackage = '@soonspacejs/ca-react-template'
      }
      // tsx
      else if (ReactConfig.JsxOrTsx === 'TypeScript') {
        if (selectVal.IsUseSoonmanager) templatePackage = '@soonspacejs/ca-react-template-soonmanager-typescript'
        else templatePackage = '@soonspacejs/ca-react-template-typescript'
      }
    }

    await console.log()
    await console.log(templatePackage)
    await console.log()

    await writeInfoFile(templatePackage)
    await install(templatePackage)
  })

function writeInfoFile(templatePackage) {
  fse.writeJSONSync(`${root}/package.json`, {
    name: 'soonspacejs-pro-template',
    version: "0.1.0",
    private: true,
    description: `Template from ${templatePackage}.`
  })

  fs.writeFileSync(`${root}/README.md`, `#${templatePackage}`)
  fs.writeFileSync(`${root}/.gitignore`, `
.DS_Store
node_modules
dist

# local env files
.env.local
.env.*.local

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`)

  fs.writeFileSync(`${root}/LICENSE`, `
MIT License

Copyright (c) 2021, xuek <ee_shadow@163.com>.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`)

}

function install(templatePackage) {
  const useYarn = shouldUseYarn()

  if (useYarn) {
    execa.sync(
      'yarn',
      [
        'add',
        '--exact',
        templatePackage
      ],
      { stdio: 'inherit' }
    )
  } else {
    execa.sync(
      'npm',
      [
        'i',
        '--save-exact',
        templatePackage
      ],
      { stdio: 'inherit' }
    )
  }

  fse.copySync(`${root}/node_modules/${templatePackage}/template`, `${root}`)

  if (useYarn) {
    execa.sync(
      'yarn',
      { stdio: 'inherit' }
    )
  } else {
    execa.sync(
      'npm',
      [
        'i'
      ],
      { stdio: 'inherit' }
    )
  }

  try {
    const err = fs.accessSync(`${root}/.npmignore`, fs.constants.F_OK)
    if (!err) fse.removeSync(`${root}/.npmignore`)
  } catch (err) {
    console.log(chalk.redBright('@soonspacejs/create-app: '), err)
  }

  console.log()
  console.log(chalk.greenBright(`Success: 项目 ${proName} 已安装完成!`))

  console.log()
  console.log('执行以下命令运行项目：')
  console.log(chalk.blueBright(`  cd ${proName}`))
  console.log(chalk.blueBright(`  npm start`))
}

function shouldUseYarn() {
  try {
    execa.sync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}