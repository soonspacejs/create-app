<template>
  <div>
    <div class="left-layout">
      <img alt="Vue logo" src="./assets/logo.png" />
      <HelloWorld msg="Welcome to Your Vue.js App" />
    </div>
    <vue-soonspace
      :customStyle="{ width: '50vw', height: '100vh', float: 'right' }"
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
            console.log("全部加载成功");
          },
        })
        .then(() => {
          console.log("主层级加载成功！");
          ssp.flyMainViewpoint();
        });

      // 获取已保存 ssp 实例
      console.log("Sspx get", Sspx.get("firstSsp"));
    },
  },
};
</script>

<style>
* {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.left-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 50vw;
  height: 100vh;
  float: left;
}
</style>
