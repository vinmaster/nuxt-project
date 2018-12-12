<template>
  <div>
    <navbar />
    <el-main>
      <h1 id="title">New Poll</h1>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" required>
        <el-form-item label="Poll Title" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>

        <el-form-item label="Category" prop="category">
          <el-select v-model="form.category" placeholder="Select One">
            <el-option label="Food" value="Food" />
            <el-option label="Music" value="Music" />
          </el-select>
        </el-form-item>

        <el-form-item label="Visibility" prop="visibility">
          <el-radio-group v-model="form.visibility">
            <el-radio label="Public" />
            <el-radio label="Friends" />
            <el-radio label="Private" />
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item label="Allow adding to poll">
          <el-switch v-model="form.adding" />
        </el-form-item>

        <el-form-item v-show="form.adding" label="Adding by">
          <el-radio-group v-model="form.addingBy">
            <el-radio label="Public" />
            <el-radio label="Friends" />
          </el-radio-group>
        </el-form-item> -->

        <el-form-item label="Autoclose">
          <el-switch v-model="form.autoclose" />
        </el-form-item>

        <el-form-item v-show="form.autoclose" label="Close At">
          <el-col :span="11">
            <el-date-picker v-model="form.closeDateTime" :picker-options="pickerOptions" type="datetime" placeholder="Pick a date and time" style="width: 100%;" />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>Options</span>
              <el-button type="text" icon="el-icon-circle-plus-outline" class="add-btn" @click="addOption">Add</el-button>
            </div>
            <div v-for="(option, index) in form.options" id="options-container" :key="index" class="text item">
              <i class="delete-btn el-icon-delete" @click="deleteOption(index)" />
              <el-form-item :label="optionsLabel(index)">
                <el-input v-model="form.options[index]" />
              </el-form-item>
            </div>
          </el-card>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">Create</el-button>
          <el-button @click="back">Back</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>

<script>
import Vue from 'vue';
import Navbar from '../../components/Navbar.vue';

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      form: {
        adding: false,
        autoclose: false,
        options: [''],
      },
      pickerOptions: {
        shortcuts: [{
          text: 'In 30 minutes',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + (1800 * 1000));
            picker.$emit('pick', date);
          }
        }, {
          text: 'In 1 hour',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + (3600 * 1000));
            picker.$emit('pick', date);
          }
        }, {
          text: 'In 1 day',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + (3600 * 1000 * 24));
            picker.$emit('pick', date);
          }
        }, {
          text: 'In 1 week',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + (3600 * 1000 * 24 * 7));
            picker.$emit('pick', date);
          }
        }]
      },
      rules: {
        title: [
          { required: true, message: 'Title missing', trigger: 'blur' },
        ],
        category: [
          { required: true, message: 'Category missing', trigger: 'blur' },
        ],
        visibility: [
          { required: true, message: 'Visibility missing', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      if (!this.form.adding) {
        Vue.delete(this.form, 'addingBy');
      }
      if (!this.form.autoclose) {
        Vue.delete(this.form, 'closeDate');
        Vue.delete(this.form, 'closeTime');
      }
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          this.$toast.error('Errors in the form');
          return false;
        }

        try {
          console.log(this.form.closeDateTime);
          const response = await this.$axios.post('/api/polls', {
            ...this.form,
          });
          this.$toast.success('Registered successfully');
          this.$nuxt.$router.push({ name: 'polls' });
        } catch (e) {
          if (e.response && e.response.data && e.response.data.error) {
            console.error(e.response.data);
            this.$toast.error(e.response.data.error.message);
          } else {
            console.error(e);
            this.$toast.error(e.message);
          }
        }
      });
    },
    back() {
      this.$nuxt.$router.go(-1);
    },
    addOption() {
      this.form.options.push('');
    },
    deleteOption(index) {
      this.form.options.splice(index, 1);
    },
    optionsLabel(index) {
      return `Option #${index + 1}`;
    },
  },
}
</script>

<style scoped>
#title {
  margin-bottom: 30px;
}

#options-container {
  margin-bottom: 15px;
}

.add-btn {
  float: right;
}

.delete-btn {
  position: absolute;
  line-height: 40px;
  color: red;
  cursor: pointer;
}
</style>
