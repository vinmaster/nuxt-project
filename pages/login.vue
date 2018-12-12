<template>
  <div>
    <navbar />
    <el-main id="login-container">
      <h1 id="title">Login</h1>
      <form id="form" @submit.prevent="login">
        <el-input v-model="username" placeholder="Username" />
        <el-input v-model="password" type="password" placeholder="Password" />
        <el-button id="submit-btn" type="primary" native-type="submit">Login</el-button>
      </form>
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
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        let errors = [];
        if (this.username === '') {
          errors.push('Username');
        }
        if (this.password === '') {
          errors.push('Password');
        }
        if (this.passwordConfirm === '') {
          errors.push('Password confirmation');
        }
        if (errors.length !== 0) {
          throw new Error(errors.join(' ') + ' is missing');
        }
        await this.$auth.loginWith('local', {
          data: {
            username: this.username,
            password: this.password,
          },
        });
        this.$toast.success('Logged In');
      } catch (e) {
        console.error(e);
        this.$toast.error(e.message, { icon: 'error' });
      }
    },
  },
}
</script>

<style scoped>
#form > * {
  margin-top: 15px;
}

#title {
  margin-top: 15px;
  text-align: center;
}

#submit-btn {
  width: 100%;
}

#hud {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

#hud > * {
  width: auto;
}
</style>
