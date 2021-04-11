<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <vue-soonspace
      :customStyle="{ height: '500px' }"
      :options="{ showGrid: true }"
      @sceneReady="sceneReady"
    />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Sspx from "@soonspacejs/plugin-sspx";
import SoonmanagerSync from "@soonspacejs/plugin-soonmanager-sync";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  methods: {
    sceneReady(ssp) {
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
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
