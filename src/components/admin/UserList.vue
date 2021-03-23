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

      <!-- 用户列表的绘制 -->
      <el-table :data="userlist" border stripe>

          <el-table-column label="用户" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="密码" prop="password"></el-table-column>
          <el-table-column label="角色" prop="role"></el-table-column>
          <el-table-column label="状态" prop="state">

              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                  <!-- scope.row每一行封存的数据 -->
                  <el-switch v-model="scope.row.state"></el-switch>
              </template>
          </el-table-column>

          <el-table-column label="操作">
              <template>
                  <!-- 修改 -->
                  <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                  <!-- 删除 -->
                  <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                  <!-- 权限 -->
                  <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false">
                      <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                  </el-tooltip>
              </template>
          </el-table-column>
      </el-table>

      <!-- 分页操作 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[1, 2, 5, 100]"
      :page-size="queryInfo.pageNum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
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
    // 添加方法的使用
    handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize;
        this.getUserList();// 重新提交表单
    },
    handleCurrentChange(newPage) {
        this.queryInfo.pageNum = newPage;
        this.getUserList();

    }

  },
};
</script>

<style lang = "less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
</style>