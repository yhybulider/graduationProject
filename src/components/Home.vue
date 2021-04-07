<template>
  <!-- 引入container布局 -->
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div class="logo_img">
        <img src="../assets/tubiao.png" alt />
        <span>家庭用电监控系统</span>
      </div>
      <el-button class="logout_but" type="info" @click="logout"
        >安全退出</el-button
      >
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCoppapse? '64px':'200px'">
        <!-- 伸缩按钮 -->
        <div class="toggle-button" @click="toggleCollapase">|||</div>
        <!-- router开启路由，collapse-transition开启折叠动画 -->
        <el-menu
          background-color="#182a4d"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCoppapse"
          :router="true" 
          :default-active="activepath"
        >
        <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObject[item.id]"></i>
              <span>{{item.title}}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- 使用saveNavState来保存最近一次的路径 -->
            <el-menu-item :index="it.path" v-for="it in item.sList" :key="it.id" @click="saveNavState(it.path+'')">
              <template slot="title">
                <i :class="iconsObject[it.id]"></i>
                <span>{{it.title}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 数据
  data() {
    return {
      // 左侧菜单 等待存放后端数据的接收数组
      menuList: [],
      isCoppapse:false, // 伸缩
      // 图片icon的来源
      iconsObject:{
        '100':'iconfont icon-guanliyuan',
        '200':'iconfont icon-jiankong',
        '101':'iconfont icon-shuju',
        '102':'iconfont icon-keshihuaguanli',
        '103':'iconfont icon-zu',
        '104':'iconfont icon-dianqihuozai',
        '105':'iconfont icon-dianqihuozai1',
        '106':'iconfont icon-keshihuakanban',
      },
      activepath:"/welcome",//默认路径
      uid:2, // 默认是零
      user:[],
    };
  },
  // onload事件，一开始加载就执行查询menu方法
  created() {
    // 取出session里的访问路径
      console.log(this.uid+1);
    this.activepath = window.sessionStorage.getItem('activepath');
    this.uid = window.localStorage.getItem("userId");
    console.log(this.uid);
    this.getMenuList();

  },
  mounted() {
    console.log(this.uid);
  },
  methods: {
    logout() {
      window.sessionStorage.clear(); //清除session，退出的时候
      window.localStorage.clear(); // 清除
      this.$router.push("/login");
    },
    async getMenuList() {
      // 结果封装
      // 后台获取的菜单数据保存在前端
    
      const { data : res } = await this.$http.get("menus",{params:{"id" : this.uid},});
      console.log(res);
      if (res.flag != 200) return this.$message.error("操作失败！！");
      this.menuList = res.menus;
    },
    toggleCollapase(){
      this.isCoppapse = !this.isCoppapse;
    },
    saveNavState(activepath) {
      // 使用缓存保存
      window.sessionStorage.setItem('activepath',activepath);
      this.activepath = activepath;
    }
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #d3c5b0;
}
.el-aside {
  background-color: #d3c5b0;
  //   改变侧边栏不对齐线的情况
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
.el-header {
  background-color: #d3c5b0;
  display: flex;
  justify-content: space-between;
  padding-left: 0%;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    //   display: flex;
    //   align-items: center;
    span {
      margin-left: 5px;
      margin-top: 15px;
    }
  }
}


.el-button--info {
  background-color:  #314875;
}
.logo_img {
  display: flex;
  width: 20%;
  height: 100%;
  justify-content: flex-start;
  /* align-items 属性定义flex子项在flex容器的当前行的侧轴（纵轴）方向上的对齐方式。 */
  align-items: stretch;
  vertical-align: middle;
  text-align: left;
  /* display: inline-block; */
}
.toggle-button{
  background-color: #d3c5b0;
  font-size: 10px;
  line-height: 24px;
  color: rgb(46, 37, 37);
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;//显示小手
  
}
</style>