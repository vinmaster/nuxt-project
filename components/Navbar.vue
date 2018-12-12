<template>
  <div id="nav-container">
    <el-menu
      id="menubar"
      ref="menu"
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
      <el-menu-item
        v-show="!$auth.loggedIn"
        class="float-right"
        index="3"
        @click="navigate('register')"
      >
        Register
      </el-menu-item>
      <el-menu-item
        v-show="!$auth.loggedIn"
        class="float-right"
        index="4"
        @click="navigate('login')"
      >
        Login
      </el-menu-item>
      <el-menu-item
        v-show="$auth.loggedIn"
        class="float-right"
        index="5"
        @click="logout"
      >
        Logout
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1',
    };
  },
  mounted() {
    const mapping = {
      'index': '1',
      'polls': '2',
      'polls-new': '2',
      'register': '3',
      'login': '4',
      'logout': '5',
    };
    this.activeIndex = mapping[this.$route.name];
  },
  methods: {
    navigate(name) {
      this.$nuxt.$router.push({ name });
    },
    async logout() {
      this.navigate('index');
      await this.$auth.logout();
      this.$toast.success('Logged Out');
    }
  },
}
</script>

<style scoped>
.float-right {
  float: right;
}
</style>
