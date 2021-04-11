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
