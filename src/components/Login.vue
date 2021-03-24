<template>
    <div class="login_container">
        <!-- 登录块 -->
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar_box">
                <img src="../assets/sysavator.png"  height="100" width= "100" alt>
            </div>

            <!-- 表单区域 -->
            <el-form ref="loginFormRef" :model ="loginForm" :rules = "loginRules" class="login_form" label-width="0">
                <!-- 提交板块，将数据提交保存 -->
                    <!-- 用户名字 -->
                    <el-form-item prop="username">
                            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-guanbi"> </el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item prop="password">
                             <el-input v-model="loginForm.password" prefix-icon="iconfont icon-denglumima" type="password"></el-input>
                    </el-form-item>
                  
                    <!-- 按钮 -->
                    <el-form-item class="btns">
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="primary" @click="resetLoginForm">重置</el-button>
                    </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loginForm:{
                username:"admin",
                password:"123456"
            },
            // 创建校验规则
            loginRules:{
                // 校验用户的名字和密码
                username:[
                    { required: true, message: '请输入用户名字', trigger: 'blur' },
                    { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 5, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ],
            },

        };
    },
    methods:{
        // 重置表单
        resetLoginForm(){
            // console.log(111) 调试
            this.$refs.loginFormRef.resetFields();
        },
        // 登录成功的界面之后
        login(){
            // console.log(111)
            this.$refs.loginFormRef.validate(async valid =>{
                if( !valid ) return; // 验证失败,则结束
                const {data:res} = await this.$http.post("login",this.loginForm); // 访问后台
                if ( res.str == "ok") { 
                    this.$message.success("操作成功!!!");
                    this.$router.push({path:"/home"}); // 地址跳转
                    // 存储use信息
                    window.sessionStorage.setItem("user",res.user);
                    console.log(res.user);

                    // 进入首页
                    this.$router.push({path:"/home"})
                }else{
                    this.$message.error("操作失败");
                }
            })
        }
    }
}
</script>

<style lang= "less" scoped>
.login_container{
    background-color: rgb(195, 223, 241);
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: rgb(224, 235, 228);
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);
    .avatar_box{
        width: 130px;
        height: 130px;
        border: 1px solid rgb(56, 104, 112);
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: aqua;
        img{
            width: 100%;
            height: 100%;
            /* 圆角 */
            border-radius: 50%; 
            background-color: #eee ;
        }
    }

}

.btns{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}

</style>