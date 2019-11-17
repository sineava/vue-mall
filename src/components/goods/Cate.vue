<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table class="treeTable" :data="cateList" :columns="columns" border :show-row-hover="false"
                show-index  index-text="#" :selection-type="false" :expand-type="false">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success hi-lightgreen" v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error hi-red" v-else></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt">
                    <el-button class="el-icon-edit" type="primary" size="mini">编辑</el-button>
                    <el-button class="el-icon-delete" type="danger" size="mini">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
            <!-- 内容主体区域 -->
            <el-form ref="addCateFormRef" label-width="100px" :model="addCateForm"
                :rules="addCateFormRules">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- options 用来指定数据源 -->
                    <!-- props 用来指定配置对象 -->
                    <el-cascader popper-class="popper"
                    :options="parentCateList"
                    :props="cascaderProps"
                    v-model="selectedKeys"
                    @change="parentCateChange"
                    clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { catNameValid } from '../../common.js'
export default {
    data() {
        return {
            // 查询条件
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类的数据列表
            cateList: [],
            // 总数居条数
            total: 0,
            // 为table指定列定义
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    // 定义为模板列(使用作用域插槽)
                    type: 'template',
                    template: 'isok'
                },
                {
                    label: '排序',
                    // 定义为模板列(使用作用域插槽)
                    type: 'template',
                    template: 'order'
                },
                {
                    label: '操作',
                    // 定义为模板列(使用作用域插槽)
                    type: 'template',
                    template: 'opt'
                }
            ],
            // 分类对话框(显示/隐藏)
            addCateDialogVisible: false,
            // 添加分类的表单数据对象
            addCateForm: {
                cat_name: '',
                // 父级分类id
                cat_pid: 0,
                // 分类层级,默认为1级分类
                cat_level: 0
            },
            // 添加分类表单的验证规则对象
            addCateFormRules: {
                cat_name: catNameValid
            },
            // 父级分类的列表
            parentCateList: [],
            // 指定级联选择器配置对象
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                expandTrigger: 'hover',
                checkStrictly: true
            },
            // 选中的父级分类的Id数组
            selectedKeys: []
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取商品分类数据
        async getCateList() {
            const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
            this.cateList = res.data.result
            this.total = res.data.total
        },
        // 监听pagesize改变
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听pagenum改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        // 点击按钮,展示分类对话框
        showAddCateDialog() {
            // 获取父级分类的数据列表
            this.getParentCateList()
            this.addCateDialogVisible = true
        },
        // 获取父级分类的数据列表
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
            if (res.meta.status !== 200) return this.$message.error('获取父级数据失败')
            this.parentCateList = res.data
        },
        // 监听选择项变化
        parentCateChange() {
            if (this.selectedKeys.length > 0) {
                // 父级分类id
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                // 当前分类等级
                this.addCateForm.cat_level = this.selectedKeys.length
            } else {
                // 父级分类id
                this.addCateForm.cat_pid = 0
                // 当前分类等级
                this.addCateForm.cat_level = 0
            }
        },
        // 添加新的分类
        addCate() {
            this.$refs.addCateFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post('categories', this.addCateForm)
                if (res.meta.status !== 201) {
                    return this.$message.error('添加分类失败')
                }
                this.$message.success('添加分类成功')
                this.getCateList()
                this.addCateDialogVisible = false
            })
        },
        // 监听对话框的关闭事件,重置表单数据
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        }
    }
}
</script>

<style lang="less" scoped>
.treeTable {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>
