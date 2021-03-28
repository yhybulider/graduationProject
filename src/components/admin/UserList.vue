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
          <!-- 搜索添加 搜索的功能通过将query来重新提交表单搜索-->
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList">
            </el-button>
          </el-input>
        </el-col>
        <!-- 同行的按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表的绘制 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="角色" prop="role"></el-table-column>
        <el-table-column label="状态" prop="state">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- scope.row每一行封存的数据 -->
            <el-switch
              v-model="scope.row.state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 权限 -->
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
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
        :total="total"
      >
      </el-pagination>
    </el-card>

     <!-- 创建新用户对话框  通过visible来获取上面的点击绑定值-->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%"
    @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules"
        ref="addFormRef" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
       <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%"
    @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="editFormRules"
        ref="editFormRef" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

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
        pageSize: 5,
      },
      userlist: [], // 用户列表
      total: 0, // 最大数据记录
      addDialogVisible: false, // 对话框显示
      // 添加用户单项
      addForm: {
        username: "",
        password: "",
        email: "",
      },
      //   控制修改用户对话框显示/隐藏
      editDialogVisible: false,
      // 编辑用户
      editForm: {
      
      },

      //   验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 8, message: "长度在5-8字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { min: 5, max: 15, message: "请输入正确邮箱地址", trigger: "blur" },
        ],
      },
      // 修改表单验证
      editFormRules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { min: 5, max: 15, message: "请输入正确邮箱地址", trigger: "blur" },
        ]
      },
    };
  },
  // 各种的方法
  methods: {
    async getUserList() {
      // get方法访问后台的路径
      const { data: res } = await this.$http.get("allUser", {
        params: this.queryInfo,
      });
      this.userlist = res.data;
      this.total = res.numbers;
    },
    // 添加方法的使用
    // 现在的页码是多少
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getUserList(); // 重新提交表单
    },
    // 页码的跳转方法
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getUserList();
    },
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `userState?id=${userInfo.id}&state=${userInfo.state}`
      );
      if (res != "success") {
        userInfo.state = !userInfo.state;
        return this.$message.error("操作失败！");
      }
      this.$$message.success("操作成功！");
    },
    // 重置表单 取消的按钮的逻辑
    addDialogClosed() {
      this.$refs.addFormRef.resetFields(); //重置表单
    },
    // 编写添加用户的逻辑
    addUser() {
        this.$refs.addFormRef.validate(async valid => {
            console.log(valid);
            if (!valid) return;

            // 发起请求
            const {data:res} = await this.$http.put("addUser",this.addForm);
            if (res != "success") {
                userInfo.state = !userInfo.state;
                return this.$message.error("操作失败!");
            }
            this.$message.success("操作成功！");
            this.addDialogVisible = false; // 重新置为false
            this.getUserList();// 重新刷表单
        })
    },
    async deleteUser(id) {
        const confirmResult = await this.$confirm('将永久删除用户，是否继续？' ,  '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err => err)

        // 成功就是confirm 失败是cancel
        if (confirmResult != 'confirm') {
            return this.$message.info("已经取消删除");
        }
        const {data : res} = await this.$http.delete("deleteUser?id="+id);

        if (res != "success") {
            return this.$message.error("操作失败！！");
        }
        this.$message.success("操作成功！！");
        this.getUserList();
    },

    // 显示对话框
    async showEditDialog(id) {
      const {data:res} =  await this.$http.get("updateUser?id="+id);
      this.editForm = res; // 查询用户反填回编辑表单
      this.editDialogVisible = true; // 开启编辑对话框

    },
    // 关闭窗口
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();// 重置信息
    },
    // 确认修改
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid);
        if (!valid) return;
        // 发起请求
        const{data: res}  = await this.$http.put("editUser",this.editForm);
        console.log(res);
        if (res != "success") return this.$message.error("操作失败！！");
        this.$message.success("操作成功！！");
        // 隐藏
        this.editDialogVisible = false;
        this.getUserList();
      })
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