<template>
  <el-main>
    <h1>Polls</h1>
    <div id="hud">
      <el-tag>Vote Count：{{ voteCount }}</el-tag>
      <el-alert
        :closable="false"
        title="Vote below"
        type="success"
      />
    </div>
    <el-tabs
      id="polls-container"
      v-model="activeName"
      type="border-card"
    >
      <el-tab-pane
        v-for="tab in tabMapOptions"
        :label="tab.label"
        :key="tab.key"
        :name="tab.key"
      >
        <keep-alive>
          <div>
            <el-card :body-style="{ padding: '0px' }" class="card">
              <img src="https://picsum.photos/1000/1000/?random" class="image">
              <div style="padding: 14px;">
                <span>{{ tab.label }} #1</span>
                <div class="bottom clearfix">
                  <time class="time">{{ tab.date }}</time>
                  <el-rate
                    v-model="tab.stars"
                    :texts="['Bad', 'Not Good', 'Neutral', 'Good', 'Great']"
                    show-text
                    @change="vote"
                  />
                </div>
              </div>
            </el-card>
          </div>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </el-main>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      tabMapOptions: [
        { label: 'Food', key: 'F', stars: 0, date: '12/3 - 12/9' },
        { label: 'Music', key: 'M', stars: 0, date: '12/3 - 12/9' },
      ],
      activeName: 'F',
      voteCount: 0
    }
  },
  methods: {
    vote() {
      this.voteCount = this.tabMapOptions.filter(t => t.stars !== 0).length;
      console.log(this.tabMapOptions);
    },
  },
}
</script>

<style scoped>
#hud {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

#hud > * {
  width: auto;
}

#polls-container {
  margin-top:15px;
  height: 100%;
}

main {
  display: flex;
  flex-direction: column;
}

.image {
  width: 100%;
}

.card {
  max-width: 400px;
}
</style>
