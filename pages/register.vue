<template>
  <div>
    <navbar />
    <el-main id="register-container">
      <h1 id="title">Register</h1>
      <form id="form" @submit.prevent="register">
        <el-input v-model="username" placeholder="Username" />
        <el-input v-model="password" type="password" placeholder="Password" />
        <el-input v-model="passwordConfirm" type="password" placeholder="Password Confirmation" />
        <el-button id="submit-btn" type="primary" native-type="submit">Register</el-button>
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
      passwordConfirm: '',
    };
  },
  methods: {
    async register() {
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
        if (this.username.length < 4) {
          throw new Error('Username needs to be at least 4 characters');
        }
        if (this.password.length < 6) {
          throw new Error('Password needs to be at least 6 characters');
        }
        const response = await this.$axios.post('/api/users/register', {
          username: this.username,
          password: this.password,
        });
        this.$toast.success('Registered successfully');
        this.$nuxt.$router.replace({ name: 'login' });
      } catch (e) {
        console.error(e);
        this.$toast.error(e.message);
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
</style>
