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

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  methods: {
    sceneReady(ssp) {
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
