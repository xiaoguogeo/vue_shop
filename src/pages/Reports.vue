<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div id="main" style="width: 800px; height: 500px"></div>
        </el-card>
    </div>
</template>

<script>
const echarts = require("echarts");
const _ = require("lodash");
export default {
    name: "Reports",
    async mounted() {
        var myChart = echarts.init(document.getElementById("main"));

        const { data: res } = await this.$http.get(`reports/type/1`);
        if (res.meta.status !== 200)
            return this.$message({
                message: res.meta.msg,
                type: "error",
                center: true,
            });

        res.data.series.forEach(item=>{
            Reflect.deleteProperty(item.areaStyle,'normal')
        })

        _.merge(res.data, this.options);

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(res.data);
    },
    data() {
        return {
            // 需要被合并的选项
            options: {
                title: {
                    text: "用户来源",
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        label: {
                            backgroundColor: "lightgreen",
                        },
                    },
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: [
                    {
                        boundaryGap: false,
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                    },
                ],
            },
        };
    },
};
</script>

<style>
</style>