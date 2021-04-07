<template>
  <div>
    <div class="permissTool">
      <el-input size="small" v-model="role.username" placeholder="请输入用户名">
        <template slot="prepend">ROLE</template>
      </el-input>
      <el-input
        size="small"
        v-model="role.email"
        placeholder="请输入邮箱"
      ></el-input>
      <el-button size="small" type="primary" icon="el-icon-plus"
        >添加角色</el-button
      >
    </div>
    <div class="permissMain">
      <el-collapse  v-model="activeName" @change="change" accordion>
        <el-collapse-item
          :title="r.role"
          :name="r.id"
          v-for="(r, index) in sysUser"
          :key="index"
        >
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问资源</span>
              <el-button
                style="float: right; padding: 3px 0; color: #ff0000"
                type="text"
                icon="el-icon-delete"
              ></el-button>
            </div>
            <div>
              <el-tree
                show-checkbox
                :data="allMeus"
                :props="defaultProps"
                ref="tree"
                :default-checked-keys="[200]"
                :key="index"
                node-key="id"
              ></el-tree>
            </div>
            <div style="display: flex; justify-content: flex-end">
              <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="doupdate(r.id, index)"
                >确认修改</el-button
              >
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.getSysUser();
  },
  data() {
    return {
      uid:0, // 默认是零
      role: {
        username: "",
        email: "",
      },
      activeName: -1,
      sysUser: [],
      allMeus: [],
      defaultProps: {
        children: "sList",
        label: "title",
      },
    };
  },
  methods: {
    change(rid) {
      if (rid) {
        this.getMenuList();
      }
    },
    async getSysUser() {
      const { data: res } = await this.$http.get("getSysUser");
      console.log(res);
      this.sysUser = res;
      console.log(this.sysUser);
      console.log(this.sysUser[0].username);
      console.log(this.sysUser.username);
    },
    async getMenuList() {
      // 结果封装
      // 后台获取的菜单数据保存在前端
       this.uid = window.sessionStorage.getItem('userId');
      console.log(this.uid)
      const { data: res } = await this.$http.get("menus",{params:{id:this.uid}});
      console.log(res);
      if (res.flag != 200) return this.$message.error("操作失败！！");
      this.allMeus = res.menus;
    },
    cancelUpdate() {
       this.activeName = -1;
    },
    async doupdate(rid, index) {
      let tree = this.$refs.tree[index];
      let selectedKeys = tree.getCheckedKeys(true);
      let url = "/system/basic/permiss/?rid=" + rid;
      selectedKeys.forEach((key) => {
        url += "&mids=" + key;
      })
      const { data: res } = await  this.$http.put(url);
      if (res) {
        this.activeName = -1;
      }
      
    },
  },
};
</script>

<style lang="less" scoped>
.permissTool {
  display: flex;
  justify-content: flex-start;
}
.permissTool .el-input {
  width: 550px;
  margin-right: 6px;
}
.permissMain {
  width: 1200px;
}
</style>
