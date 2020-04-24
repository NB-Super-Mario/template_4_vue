<template>
  <div class="home">
    <el-button type="primary" @click="goToAbout">关于页面</el-button>
    <div class="select-employee">
      <el-select v-model="employeeCode" filterable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <Calendar :employeeCode="employeeCode" />
  </div>
</template>
<script>
// @ is an alias to /src

import Calendar from '@/components/calendar';
import { mapActions } from 'vuex';
export default {
  name: 'home',
  data() {
    return {
      collapse: false,
      options: [
        {
          value: '001',
          label: '李迎',
        },
      ],
      employeeCode: '001',
    };
  },
  components: {
    Calendar,
  },
  mounted() {
    /**
     * 根据携带的cookie，自动获取当前系统的所有按钮权限，会发起一个http请求
     */
    // this.updatePermissions();
  },
  methods: {
    ...mapActions(['updatePermissions']),
    goToAbout() {
      this.$router.push('/about');
    },
  },
};
</script>

<style>
.select-employee {
  text-align: left;
}
</style>
