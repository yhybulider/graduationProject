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
      <el-row :gutter="25">
        <el-col :span="10">
          <!-- 搜索添加 -->
          <el-input placeholder="请输入搜索内容">
            <el-button slot="append" icon="el-icon-search"> </el-button>
          </el-input>
        </el-col>
        <!-- 同行的按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisiable = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>

      <span>
          {{userlist}}
      </span>
    </el-card>
  </div>
</template>
<script>
export default {
  // 一开始就加载
  created() {
    this.getUserList();
  },
  // 返回的数据
  data() {
    return {
      // 请求数据
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 5
      },
      userlist: [], // 用户列表
      total: 0, // 最大数据记录
    };
  },
  // 各种的方法
  methods: {
    async getUserList() {
      // get方法访问后台的路径
      const { data: res } = await this.$http.get("allUser", {params: this.queryInfo});
      this.userlist = res.data;
      this.total = res.numbers;
    },
  },
};
</script>

<style lang = "less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
</style>