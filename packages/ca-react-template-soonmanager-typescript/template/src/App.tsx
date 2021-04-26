import React from 'react';
import logo from './logo.svg';
import SoonSpace from 'soonspacejs';
import ReactSoonspace from 'react-soonspace';
import Sspx from '@soonspacejs/plugin-sspx';
import SoonmanagerSync from '@soonspacejs/plugin-soonmanager-sync';
import './App.css';

function App() {
  function sceneReady(ssp: SoonSpace) {
    // 保存 ssp 实例
    Sspx.add('firstSsp', ssp);

    // 注册 SoonmanagerSync 插件
    const soonmanagerSync = ssp.registerPlugin(
      SoonmanagerSync,
      'soonmanagerSync'
    );

    /**
     * 设置平台数据包路径
     * 支持 本地资源路径 和 平台在线资源路径
     */
    soonmanagerSync.setBaseUrl('./sceneData/testData/');
    // soonmanagerSync.setBaseUrl('http://soon.xwbuilders.com:8066//model/f95d1b6544284e9c931a5385b5812254/')

    // 设置场景全局配置
    soonmanagerSync.setGlobalSetting();

    // 加载场景
    soonmanagerSync
      .loadScene({
        /**
         * 指定开始加载的树节点 ID
         *   未指定或指定为空，从根节点开始加载场景
         *   指定的 ID 无法命中节点，不会加载任何模型
         */
        // targetId: 'xxxxx',

        /**
         * 从指定节点开始，设置广度遍历加载多少层子集模型
         *   不设置时加载全部层级子集
         */
        // targetLevel: 2,

        /**
         * 是否利用页面交互空闲时间去加载剩余模型
         */
        isIdleRest: true,
        /**
         * 当前 loadScene 加载模型全部完成的回调
         */
        loadSceneAllSuccess: () => {
          console.log('全部加载成功');
        },
      })
      .then(() => {
        console.log('主层级加载成功！');
        ssp.flyMainViewpoint();
      });

    // 获取已保存 ssp 实例
    console.log('Sspx get', Sspx.get('firstSsp'));
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
      <ReactSoonspace
        style={{ width: '50vw', height: '100vh' }}
        options={{ showGrid: true }}
        events={{
          modelClick(param) {
            console.log('modelClick', param);
          },
        }}
        sceneReady={sceneReady}
      />
    </div>
  );
}

export default App;
