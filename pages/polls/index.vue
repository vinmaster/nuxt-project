<template>
  <div>
    <navbar />
    <el-main>
      <el-row>
        <el-col :span="12">
          <h1>
            Polls
          </h1>
        </el-col>

        <el-col :span="12" class="text-align-right">
          <nuxt-link to="/polls/new"><el-button type="warning">New Poll</el-button></nuxt-link>
        </el-col>

      </el-row>
      <!-- {{ categorizedPolls | json }} -->

      <el-tabs
        id="polls-container"
        v-model="activeName"
        type="border-card"
      >
        <el-tab-pane
          v-for="tab in Object.keys(categorizedPolls)"
          :label="tab"
          :key="tab"
          :name="tab"
        >
          <keep-alive>
            <el-row>
              <el-col :xs="24" :sm="12">
                <el-card v-for="poll in categorizedPolls[tab]" :key="poll.id" :body-style="{ padding: '0px' }" class="card poll">
                  <div class="poll-header">
                    <span class="poll-title">{{ poll.title }}</span>
                    <el-tag v-if="timeLeft(poll.closeAt)" class="time-tag" type="warning">{{ timeLeft(poll.closeAt) }}</el-tag>
                    <span v-if="timeLeft(poll.closeAt)" style="position: absolute; height: 2em;">
                      <!-- <el-alert :closable="false" :title="timeLeft(poll.closeAt)" type="warning" /> -->
                    </span>
                  </div>
                  <!-- <div v-if="poll.closeAt">Close At: <el-date-picker v-model="poll.closeAt" :readonly="true" type="datetime" prefix-icon="null" /></div> -->
                  <!-- <img src="https://picsum.photos/1000/1000/?random" class="image"> -->
                  <div class="poll-options">
                    <div class="bottom clearfix">
                      <div v-for="(optionObj, index) in poll.options" :key="index" class="option-container">
                        <el-button v-if="!didVote(optionObj)" :disabled="timeLeft(poll.closeAt) === 'Poll Ended'" type="primary" class="option-btn" @click="vote(poll.id, optionObj)">{{ optionObj.option }}</el-button>
                        <el-button v-if="didVote(optionObj)" :disabled="timeLeft(poll.closeAt) === 'Poll Ended'" type="danger" class="option-btn" @click="unvote(poll.id, optionObj)">{{ optionObj.option }}</el-button>
                        <div class="votes">{{ optionObj.votes }}</div>
                      </div>
                      <!-- <el-rate
                        v-model="tab.stars"
                        :texts="['Bad', 'Not Good', 'Neutral', 'Good', 'Great']"
                        show-text
                        @change="vote"
                      /> -->
                    </div>
                  </div>
                  <div>Created: <el-date-picker v-model="poll.createdAt" :readonly="true" type="datetime" prefix-icon="null" /></div>
                </el-card>
              </el-col>
            </el-row>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </div>
</template>

<script>
import axios from 'axios';
import socket from '~/plugins/socket.io.js';
import Navbar from '../../components/Navbar.vue';

export default {
  components: {
    Navbar,
  },
  async asyncData(context) {
    let response = await context.$axios.get('/api/polls');
    return { polls: response.data.polls };
  },
  filters: {
    json: (value) => {
      return JSON.stringify(value, null, 2);
      // return JSON.stringify(JSON.parse(value), null, 2);
    }
  },
  data() {
    return {
      polls: [],
      activeName: 'Any',
    }
  },
  computed: {
    categorizedPolls() {
      return this.polls.reduce((accumulator, poll) => {
        if (!accumulator[poll.category]) {
          accumulator[poll.category] = [];
        }
        if (poll.visibility === 'Public') {
          accumulator[poll.category].push(poll);
        }
        return accumulator;
      }, {});
    },
  },
  beforeMount() {
    socket.on('poll', this.socketPoll);
    socket.on('error', this.socketError);
  },
  beforeDestroy() {
    socket.removeListener('poll', this.socketPoll);
    socket.removeListener('error', this.socketError);
  },
  methods: {
    socketPoll({ poll, action, optionObj }) {
      let index = this.polls.findIndex(p => p.id === poll.id);
      this.polls.splice(index, 1, poll);
      if (action === 'vote') {
        this.$toast.success(`Voted for: ${optionObj.option}`);
      } else {
        this.$toast.success(`Unvoted for: ${optionObj.option}`);
      }
    },
    socketError({ message }) {
      this.$toast.error(message);
    },
    vote(pollId, optionObj) {
      if (!this.$auth.$state.user) {
        this.$toast.error('Please log in');
        return;
      }
      socket.emit('vote', { pollId, optionObj, refreshToken: this.$auth.$state.user.refreshToken });
    },
    unvote(pollId, optionObj) {
      if (!this.$auth.$state.user) {
        this.$toast.error('Please log in');
        return;
      }
      socket.emit('unvote', { pollId, optionObj, refreshToken: this.$auth.$state.user.refreshToken });
    },
    timeLeft(time) {
      if (!time) return null;
      let today = new Date();
      let deadline = new Date(time);
      let oneDay = 3600 * 1000 * 24;
      let oneHour = 3600 * 1000;
      let oneMinute = 60 * 1000;
      let timeLeft = (deadline.getTime()-today.getTime())/(oneDay);
      if (timeLeft < 0) {
        return 'Poll Ended';
      } else if (timeLeft < 1) {
        timeLeft = (deadline.getTime()-today.getTime())/(oneHour);
        if (timeLeft < 1) {
          timeLeft = (deadline.getTime()-today.getTime())/(oneMinute);
          return `${Math.floor(timeLeft)} ${Math.floor(timeLeft) === 1? 'minute' : 'minutes'} left`;
        } else {
          return `${Math.floor(timeLeft)} ${Math.floor(timeLeft) === 1? 'hour' : 'hours'} left`;
        }
      } else {
        return `${Math.floor(timeLeft)} ${Math.floor(timeLeft) === 1? 'day' : 'days'} left`;
      }
    },
    didVote(optionObj) {
      return this.$auth.$state.user && optionObj.voters.includes(this.$auth.$state.user.id);
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

.poll {
  padding: 15px;
  margin-bottom: 15px;
}

.poll-title {
  font-size: 2em;
}

.poll-header {
  display: flex;
}

.poll-header, .poll-options {
  margin-bottom: 15px;
}

.time-tag {
  position: absolute;
  right: 15px;
}

.option-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.option-btn {
  width: 100%;
}

.votes {
  line-height: 40px;
  margin-left: 15px;
  margin-right: 15px;
}

.text-align-right {
  text-align: right;
}

main {
  display: flex;
  flex-direction: column;
}

.image {
  width: 100%;
}

.card {
  /* max-width: 400px; */
}
</style>
