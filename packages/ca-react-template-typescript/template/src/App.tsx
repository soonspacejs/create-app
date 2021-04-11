import React from 'react';
import logo from './logo.svg';
import SoonSpace from 'soonspacejs';
import ReactSoonspace from 'react-soonspace';
import Sspx from "@soonspacejs/plugin-sspx";
import './App.css';

function App() {

  function sceneReady(ssp: SoonSpace) {

    // 保存 ssp 实例
    Sspx.add("firstSsp", ssp);

    // 加载一个测试模型
    ssp
      .loadSbm({
        id: "test_model",
        url: "./model/changjing02/changjing02_1F_0.sbm",
      })
      .then(() => {
        ssp.flyMainViewpoint();
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
        style={{ width: '50vw', height: '100vh', float: 'right' }}
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
