<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 2.放置区域 -->
            <div id="main" style="width: 1200px;height:600px"></div>
        </el-card>
    </div>
</template>

<script>
// 1.导入 echarts
import echarts from 'echarts'
import _ from 'lodash'

export default {
    data() {
        return {
            // 需要合并的数据
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                        backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        }
    },
    // 元素已渲染完毕
    async mounted() {
        // 3.准备dom
        var myChart = echarts.init(document.getElementById('main'))
        const { data: res } = await this.$http.get('reports/type/1')
        if (res.meta.status !== 200) return this.$messgae.error('获取折线图数据失败')
        // 使用lodash合并对象
        const result = _.merge(res.data, this.options)
        myChart.setOption(result)
        console.log(result)
    }
}
</script>
