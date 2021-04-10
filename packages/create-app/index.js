
const target = process.argv.slice(2)

const proName = target[0]
const root = path.resolve(proName)
fs.ensureDirSync(proName)
process.chdir(root)

inquirer.prompt([
  {
    name: 'VueOrReact',
    message: '使用 Vue 还是 React ?',
    type: 'list',
    choices: ['Vue', 'React']
  },
  {
    name: 'isUseSoonmanager',
    message: '是否集成 SoonManager 平台数据接入环境 ?',
    type: 'confirm',
    default: false
  }
])
  .then(selectVal => {
    // buildPackage(selectVal['packageFolderName'], selectVal['isMini'])
    const templatePackage = 'ca-vue-template'
    console.log(selectVal);
    
    execa.sync(
      'npm',
      [
        'i',
        '--save',
        '--save-exact',
        templatePackage
      ],
      { stdio: 'inherit' }
    )
  })
