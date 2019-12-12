<template>
    <div class="login-container">
        <div class="login-box">
            <!-- 头像区域 -->
            <div class="avatar-box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login-form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-lock_fill"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="hi-right">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { nameValid, passwordValid } from '../common.js'
export default {
    data () {
        return {
            // 表单数据绑定对象
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            // 表单的规则验证对象
            loginFormRules: {
                username: nameValid,
                password: passwordValid
            }
        }
    },
    methods: {
        login () {
            this.$refs.loginFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post('login', this.loginForm)
                if (res.meta.status !== 200) return this.$message.error('登录失败')
                this.$message.success('登录成功')
                // 1. 将登录成功之后的token,保存到客户端的sessionStorage中
                //  1.1 项目中除了登录之外的其他API接口,必须在登录之后才能访问
                //  1.2 token只应在当前网站打开期间生效,所以将token保存到sessionStorage中
                window.sessionStorage.setItem('token', res.data.token)
                // 2. 通过编程式导航跳转到后台主页,路由地址是/home
                this.$router.push('/home')
                console.log('--- hello ---')
            })
        },
        // 重置登录表单
        resetLoginForm () {
            this.$refs.loginFormRef.resetFields()
        }
    }
}
</script>

<style lang="less" scoped>
.login-container {
    height: 100%;
    background-color: #2b4b6b;
}
.login-box {
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

    .avatar-box {
        padding: 10px;
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        box-shadow: 0 0 10px #ddd;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img {
            background-color: #eee;
            border-radius: 50%;
            width: 100%;
            height: 100%;
        }
    }
}

.login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>
