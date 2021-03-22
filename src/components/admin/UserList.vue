<template>
  <div>
    用户列表
    <!-- 导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<!-- 用户列表的主体 -->
    <el-card>
        <!-- 搜索区域 -->
        

    </el-card>
  </div>
</template>
<script>
export default {};
</script>

<style lang = "less" scoped>
.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}
</style>