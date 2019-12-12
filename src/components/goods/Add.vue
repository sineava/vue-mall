<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 提示区域 -->
            <el-alert
                title="添加商品信息" type="info" center show-icon :closable="false">
            </el-alert>
            <!-- 步骤条区域 -->
            <el-steps :space="300" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFromRules" ref="addFromRef" label-width="100px" label-position="top">
                <!-- tab栏区域 -->
                <el-tabs v-model="activeIndex" :tab-position="'left'"
                    :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                            v-model="addForm.goods_cat"
                            :options="cateList"
                            :props="cateProps"
                            @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <!-- 复选框组 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!--
                            action 图片请求api地址
                            list-type 呈现方式
                         -->
                        <el-upload
                            :headers="headerObj"
                            :action="uploadURL"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce">
                        </quill-editor>
                        <el-button class="btnAdd" type="primary" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <el-dialog class="img_dialog" title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    data() {
        return {
            activeIndex: '0',
            // 添加商品的表单数据对象
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                // 商品所属分类数组
                goods_cat: [],
                // 图片数组
                pics: [],
                // 商品详情描述
                goods_introduce: ''
            },
            addFromRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ],
                goods_cat: [
                    { required: true, message: '请选中商品分类', trigger: 'blur' }
                ]
            },
            // 商品分类列表
            cateList: [],
            cateProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children',
                expandTrigger: 'hover'
            },
            // 动态参数列表数据
            manyTableData: [],
            // 静态属性
            onlyTableData: [],
            // upload url
            uploadURL: 'https://renoblog.xyz/api/private/v1/upload',
            // 请求头,携带token
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            // 预览图片
            previewPath: '',
            // 图片预览对话框(显示/隐藏)
            previewVisible: false,
            url: 'https://renoblog.xyz/'
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取所有商品分类数据
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('获取分类数据失败')
            this.cateList = res.data
        },
        // 级联选择器选中项变化
        handleChange() {
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []
            }
        },
        beforeTabLeave(actsiiveName, oldActiveName) {
            if (this.addForm.goods_cat.length !== 3 && oldActiveName === '0') {
                this.$message.error('请先选中商品分类')
                return false
            }
        },
        async tabClicked() {
            // 点击的动态参数面板
            if (this.activeIndex === '1') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: { sel: 'many' }
                })
                if (res.meta.status !== 200) return this.$message.error('获取动态参数列表失败')
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                })
                this.manyTableData = res.data
            } else if (this.activeIndex === '2') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: { sel: 'only' }
                })
                if (res.meta.status !== 200) return this.$message.error('获取商品信息失败')
                this.onlyTableData = res.data
            }
        },
        // 处理图片预览效果
        handlePreview(file) {
            this.previewPath = this.url + file.response.data.tmp_path
            this.previewVisible = true
        },
        // 处理移除图片操作
        handleRemove(file) {
            const filePath = file.response.data.temp_path
            const i = this.addForm.pics.findIndex(x => x.pic === filePath)
            this.addForm.pics.splice(i, 1)
        },
        // 监听图片上传成功的事件
        handleSuccess(response) {
            // 拼接得到图片信息对象
            const picInfo = { pic: response.data.tmp_path }
            this.addForm.pics.push(picInfo)
        },
        // 添加商品
        addGoods() {
            this.$refs.addFromRef.validate(async valid => {
                if (!valid) return this.$message.error('请填写必要的表单项')
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                // 商品名称必须唯一
                const { data: res } = await this.$http.post('goods', form)
                if (res.meta.status !== 201) return this.$message.error('添加商品失败')
                this.$message.success('添加商品成功')
                this.$router.push('/goods')
            })
        }
    },
    computed: {
        cateId() {
            if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
            return null
        }
    }
}
</script>

<style lang="less" scoped>
.el-steps {
    margin: 20px 0;
}
.el-step__title {
    font-size: 13px;
}
.el-checkbox {
    margin-right: 10px !important;
}
.previewImg {
    width: 100%;
}
.btnAdd {
    margin-top: 15px;
}
</style>
