<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img class="avator" src="../assets/avator.png" alt=""/>
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">登出</el-button>
        </el-header>
        <!-- 主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="flag == true ? '64px' : '200px'">
                <div class="toggle-btn" @click="toggleCollapse">&lt;&gt;</div>
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff"
                    :collapse-transition="false" :unique-opened='true' :collapse="flag" :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="`${item.id}`" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单模板区 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="`/${subItem.path}`" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState(`/${subItem.path}`)">
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{subItem.authName}}</span>
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
    data() {
        return {
            // 左侧菜单数据
            menuList: [],
            iconsObj: {
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            flag: false,
            activePath: ''
        }
    },
    created() {
        this.getMenuList()
        if (this.$route.path !== '/welcome') this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        logout() {
            // 清除token
            window.sessionStorage.clear()
            // 页面跳转
            this.$router.push('login')
        },
        async getMenuList() {
            const { data: res } = await this.$http.get('menus')
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menuList = res.data
        },
        toggleCollapse() {
            this.flag = !this.flag
        },
        saveNavState(path) {
            window.sessionStorage.setItem('activePath', path)
            this.activePath = path
            this.$router.push(path)
        }
    }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}

.el-header {
    padding: 0;
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        > span {
            margin-left: 20px;
            font-weight: bold;
        }
    }
}

.el-aside {
    background-color: #333744;
    .el-menu {
        border: 0;
    }
}

.el-main {
    background-color: #eaedf1;
}

.iconfont {
    margin: 10px;
}

.toggle-btn {
    line-height: 30px;
    color: #fff;
    background-color: #4a5064;
    text-align: center;
    cursor: pointer;
}

.avator {
    border-radius: 50%;
}
</style>
