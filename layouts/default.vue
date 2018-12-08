<template>
  <div>
    <el-menu
      id="menubar"
      :default-active="activeIndex"
      mode="horizontal"
    >
      <el-menu-item
        index="1"
        @click="navigate('index')"
      >
        Pollbox
      </el-menu-item>
      <el-menu-item
        index="2"
        @click="navigate('polls')"
      >
        Polls
      </el-menu-item>
    </el-menu>
    <nuxt/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: null,
    };
  },
  mounted() {
    const mapping = {
      'index': '1',
      'polls': '2',
    };
    this.activeIndex = mapping[this.$route.name];
  },
  methods: {
    navigate(name) {
      this.$nuxt.$router.replace({ name });
    },
  },
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

html, body, #__nuxt, #__layout, #__layout > div, main {
  height: calc(100vh - 61px);
}

a {
  text-decoration: none;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
