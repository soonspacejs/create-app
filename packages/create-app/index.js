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
      if(  ReactConfig.JsxOrTsx === 'JavaScript' ) {
        if (selectVal.IsUseSoonmanager) templatePackage = '@soonspacejs/ca-react-template-soonmanager'
        else templatePackage = '@soonspacejs/ca-react-template'
      } 
      // tsx
      else if( ReactConfig.JsxOrTsx === 'TypeScript' ) {
        if (selectVal.IsUseSoonmanager) templatePackage = '@soonspacejs/ca-react-template-soonmanager-typescript'
        else templatePackage = '@soonspacejs/ca-react-template-typescript'
      }
    }

    await console.log()
    await console.log(templatePackage)
    await console.log()

    await install(templatePackage)
  })

function install(templatePackage) {
  const useYarn = shouldUseYarn()

  if (useYarn) {
    execa.sync(
      'yarn',
      [
        'add',
        templatePackage
      ],
      { stdio: 'inherit' }
    )
  } else {
    execa.sync(
      'npm',
      [
        'i',
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

  const ignoreData = fs.readFileSync(`${root}/.npmignore`, 'utf-8')
  if (ignoreData) {
    fs.writeFileSync(`${root}/.gitignore`, ignoreData)
    fse.removeSync(`${root}/.npmignore`)
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