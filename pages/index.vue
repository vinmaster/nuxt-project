<template>
  <div>
    <navbar />
    <el-main>
      <el-card class="box-card">
        <div id="hero">
          <h1 id="title">Welcome to Pollbox</h1>
          <nuxt-link to="/polls"><el-button type="primary" style="background-color: #3F51B5;">Come check out the polls</el-button></nuxt-link>
        </div>
        <div class="tip">
          Vote for your favorite categories
          <i style="color: #E6A23C;" class="el-icon-star-on"/>
        </div>
        <div class="tip">
          See what's trending this week
          <i style="color: #67C23A;" class="el-icon-date"/>
        </div>
      </el-card>
    </el-main>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';

export default {
  components: {
    Navbar,
  },
  data() {
    return {
    }
  },
  methods: {
  },
}
</script>

<style scoped>
#hero {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#title {
  font-size: 36px;
  margin-bottom: 15px;
  color: #3F51B5;
}
.tip {
  padding: 16px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #3F51B5;
  margin: 20px 0;
}
main {
  background-image: url('~assets/background.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
