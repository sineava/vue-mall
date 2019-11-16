<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        <!-- {{scope.row}} -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" @size-change="handleSizeChange"
                :current-page="queryInfo.pagenum" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
            <!-- 添加用户的对话框 -->
            <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
                <!-- 内容主体区域 -->
                <el-form ref="addFormRef" label-width="70px" :model="addForm"
                    :rules="addFormRules">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改用户的对话框 -->
            <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
                <!-- 内容主体区域 -->
                <el-form ref="editFormRef" label-width="70px" :model="editForm"
                    :rules="editFormRules">
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfo">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 分配角色的对话框 -->
            <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%"
                @close="setRoleDialogClosed">
                <div>
                    <p>当前的用户: {{userinfo.username}}</p>
                    <p>当前的角色: {{userinfo.role_name}}</p>
                    <p>分配新角色:
                        <el-select v-model="selectedRoleId" placeholder="请选择">
                            <el-option v-for="item in rolesList" :key="item.id"
                            :label="item.roleName" :value="item.id"></el-option>
                        </el-select>
                    </p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import { nameValid, passwordValid, emailValid, mobileValid } from '../../common.js'
export default {
    data() {
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                query: '',
                // 当前的页数
                pagenum: 1,
                // 当前每页显示数据条数
                pagesize: 2
            },
            userList: [],
            total: 0,
            // 对话框(显示/隐藏)
            dialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                username: nameValid,
                password: passwordValid,
                email: emailValid,
                mobile: mobileValid
            },
            // 修改用户对话框(显示/隐藏)
            editDialogVisible: false,
            // 查询到的用户信息
            editForm: {},
            // 修改表单的验证规则对象
            editFormRules: {
                email: emailValid,
                mobile: mobileValid
            },
            // 控制分配角色对话框(显示/隐藏)
            setRoleDialogVisible: false,
            // 需要被分配角色的用户信息
            userinfo: {},
            // 所有角色的数据列表
            rolesList: [],
            // 已选中的角色id值
            selectedRoleId: ''
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get('users', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
            this.userList = res.data.users
            this.total = res.data.total
        },
        // 监听page size改变
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        // 监听页码值发生改变
        handleCurrentChange(newPagenum) {
            this.queryInfo.pagenum = newPagenum
            this.getUserList()
        },
        // 监听switch开关状态改变
        async userStateChanged(userinfo) {
            const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if (res.meta.status !== 200) {
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户状态失败')
            }
            this.$message.success('更新用户状态成功')
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 添加用户
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post('users', this.addForm)
                if (res.meta.status !== 201) return this.$message.error('添加用户失败')
                this.$message.success('添加用户成功')
                // 隐藏添加用户的对话框
                this.dialogVisible = false
                // 重新获取用户
                this.getUserList()
            })
        },
        // 展示编辑用户的对话框
        async showEditDialog(id) {
            const { data: res } = await this.$http.get(`users/${id}`)
            if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 监听修改用户对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 修改用户信息并提交
        editUserInfo() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
                    email: this.editForm.email, mobile: this.editForm.mobile
                })
                if (res.meta.status !== 200) return this.$message.error('更新用户信息失败')
                // 关闭对话框
                this.editDialogVisible = false
                // 刷新数据列表
                this.getUserList()
                // 提醒更新用户信息成功
                this.$message.success('更新用户信息成功')
            })
        },
        // 删除用户
        async removeUserById(id) {
            const confirmResult = await this.$confirm(
                '此操作将永久删除该用户,是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)
            if (confirmResult !== 'confirm') return this.$message.info('已经取消删除')
            const { data: res } = await this.$http.delete(`users/${id}`)
            if (res.meta.status !== 200) return this.$message.error('删除用户失败')
            this.$message.success('删除用户成功')
            // 跳转到首页
            this.queryInfo.pagenum = 1
            this.getUserList()
        },
        // 展示分配角色对话框
        async setRole(userinfo) {
            this.userinfo = userinfo
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
            this.rolesList = res.data
            this.setRoleDialogVisible = true
        },
        // 分配角色
        async saveRoleInfo() {
            if (!this.selectedRoleId) return this.$message.error('请选择要分配的角色')
            const { data: res } = await this.$http.put(`users/${this.userinfo.id}/role`, {
                rid: this.selectedRoleId
            })
            console.log(res)
            if (res.meta.status !== 200) return this.$message.error('分配角色失败')
            this.$message.success('分配角色成功')
            this.getUserList()
            this.setRoleDialogVisible = false
        },
        // 监听分配角色对话框关闭事件
        setRoleDialogClosed() {
            this.selectedRoleId = ''
            this.userinfo = {}
        }
    }
}
</script>

<style lang="less" scoped>

</style>
