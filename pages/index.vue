<template>
  <el-main>
    <el-card class="box-card">
      <h1 id="title">Welcome Pollbox</h1>
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
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      tabMapOptions: [
        { label: 'Food', key: 'F' },
        { label: 'Music', key: 'M' },
      ],
      activeName: 'F',
      createdTimes: 0
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    }
  },
}
</script>

<style scoped>
#title {
  text-align: center;
}
.tip {
  padding: 16px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin: 20px 0;
}
main {
  background-image: url('~assets/background.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
