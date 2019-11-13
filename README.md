## 电商后台管理系统(前端项目)

### 功能

> 用于管理用户账号，商品分类，商品信息，订单，数据统计等业务功能



![](./src/assets/mall_desc01.png)



### 开发模式

> 电商后台管理系统整体采用前后端分离的开发模式,其中前端项目是基于Vue技术栈的SPA项目

![](./src/assets//mall_desc02.png)

### 技术选型

#### 前端项目技术栈

- Vue
- Vue-router
- Element-UI
- Axios
- Echarts

#### 后端项目技术栈

- Node.js
- Express
- Jwt
- Mysql
- Sequelize

### 项目初始化

#### 前端项目初始化步骤

1. 安装 Vue 脚手架
2. 通过 Vue-Cli 创建项目
3. 配置 Vue-router
4. 配置 Element-UI 组件库
5. 配置 Axios 库
6. 初始化 git 远程仓库

##### 相关依赖-按需导入

![](./src/assets//mall_desc03.png)

#### 后端项目的环境安装配置

1. 安装MySQL数据库
2. 安装Node.js环境
3. 配置项目相关信息
4. 启动项目
   1. 使用phpstudy导入数据库并运行
   2. npm init 后端项目
   3. node ./app.js
5. 使用Postman测试后台项目接口是否正常

### 登录概述

#### 登录业务流程

1. 在登录页面输入用户名和密码
2. 调用后台接口进行验证
3. 通过验证之后,根据后台的响应状态跳转到项目主页

#### 登录业务相关技术点

1. http是无状态的
2. 通过cookie在客户端记录状态
3. 通过sesion在服务器端记录状态
4. 通过token维持状态(不允许跨域使用)

![](./src/assets//mall_desc04.png)

#### 登录业务流程

##### 登录页面的布局

通过Element-UI组件实现布局

- el-form
- el-form-item
- el-input
- el-button
- 字体图标

---

[接口API](./api接口文档.md)
