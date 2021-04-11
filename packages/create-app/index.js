#!/usr/bin/env node

const path = require('path');
const fs = require('fs')
const fse = require('fs-extra');
const inquirer = require('inquirer');
const execa = require('execa');

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
      if (selectVal.IsUseSoonmanager) templatePackage = '@soonspacejs/ca-react-template-soonmanager'
      else templatePackage = '@soonspacejs/ca-react-template'
    }

    await console.log(templatePackage)

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

}

function shouldUseYarn() {
  try {
    execa.sync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}