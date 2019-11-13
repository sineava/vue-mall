<template>
    <div>
        <el-button type="info" @click="logout">登出</el-button>
    </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    logout() {
      // 清除token
      window.sessionStorage.clear()
      // 页面跳转
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
