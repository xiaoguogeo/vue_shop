<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">
                首页
            </el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column
                    label="权限名称"
                    prop="authName"
                ></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级">
                    <template v-slot="data">
                        <el-tag v-if="data.row.level === '0'">一级</el-tag>
                        <el-tag type="success" v-if="data.row.level === '1'"
                            >二级</el-tag
                        >
                        <el-tag type="warning" v-if="data.row.level === '2'"
                            >三级</el-tag
                        >
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "Right",
    created() {
        this.getRightList();
    },
    data() {
        return {
            rightsList: [],
        };
    },
    methods: {
        async getRightList() {
            const { data: res } = await this.$http.get("rights/list");
            if (res.meta.status !== 200)
                return this.$message({message: "获取用户权限失败",type: "error",center: true,})
            this.rightsList = res.data;
        },
    },
};
</script>

<style lang="less" scoped>
</style>