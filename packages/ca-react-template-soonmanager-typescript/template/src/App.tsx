import React from 'react';
import logo from './logo.svg';
import SoonSpace from 'soonspacejs';
import ReactSoonspace from 'react-soonspace';
import Sspx from "@soonspacejs/plugin-sspx";
import SoonmanagerSync from "@soonspacejs/plugin-soonmanager-sync";
import './App.css';

function App() {

  function sceneReady(ssp: SoonSpace) {

    // 保存 ssp 实例
    Sspx.add("firstSsp", ssp);

    // 注册 SoonmanagerSync 插件
    const soonmanagerSync = ssp.registerPlugin(
      SoonmanagerSync,
      "soonmanagerSync"
    );

    /**
     * 设置平台数据包路径
     * 支持 本地资源路径 和 平台在线资源路径
     */
    soonmanagerSync.setBaseUrl("./sceneData/testData/");
    // soonmanagerSync.setBaseUrl('http://soon.xwbuilders.com:8066//model/f95d1b6544284e9c931a5385b5812254/')

    // 设置场景全局配置
    soonmanagerSync.setGlobalSetting();

    // 开始加载场景
    soonmanagerSync
      .loadScene({
        syncLoad: true,
        LoadsPerSecond: 60,
      })
      .then(() => {
        console.log("主层级加载成功！");
        ssp.flyMainViewpoint();
      });

    // 场景全部加载完整
    soonmanagerSync.loadSceneAllSuccess(() => {
      console.log("全部模型加载成功！");
    });

    // 获取已保存 ssp 实例
    console.log("Sspx get", Sspx.get("firstSsp"));

  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <ReactSoonspace
        style={{ width: '50vw', height: '100vh' }}
        options={{ showGrid: true }}
        events={{
          modelClick(param) {
            console.log('modelClick', param)
          }
        }}
        sceneReady={sceneReady}
      />
    </div>
  );
}

export default App;
