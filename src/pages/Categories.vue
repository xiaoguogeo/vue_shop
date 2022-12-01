<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div style="text-align: left">
                <el-button type="primary" @click="showAddCateDialog"
                    >添加分类</el-button
                >
            </div>
            <!-- 表格区域 -->
            <tree-table
                :data="cateList"
                border
                stripe
                :columns="columns"
                :expand-type="false"
                :selection-type="false"
                :show-index="true"
                index-text="#"
                class="tree"
            >
                <template v-slot:isOk="row_data">
                    <i
                        class="el-icon-success"
                        v-if="!row_data.row.cat_deleted"
                    ></i>
                    <i class="el-icon-error" v-else></i>
                </template>
                <template v-slot:order="row_data">
                    <el-tag
                        size="mini"
                        type="primary"
                        v-if="row_data.row.cat_level === 0"
                        >一级</el-tag
                    >
                    <el-tag
                        size="mini"
                        type="success"
                        v-else-if="row_data.row.cat_level === 1"
                        >二级</el-tag
                    >
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                    <!-- {{row_data.row}} -->
                </template>
                <template v-slot:operate="row_data">
                    <el-button
                        icon="el-icon-edit"
                        type="primary"
                        size="mini"
                        @click="showEditCateDialog(row_data.row.cat_id)"
                        >编辑</el-button
                    >
                    <el-button
                        icon="el-icon-delete"
                        type="danger"
                        size="mini"
                        @click="deleteEditCateById(row_data.row.cat_id)"
                        >删除</el-button
                    >
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-size="queryInfo.pagesize"
                layout="total, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="30%"
            :close-on-click-modal="false"
            :before-close="handleClose"
            center
        >
            <el-form
                ref="addCateRef"
                :rules="addOrEditCateRules"
                :model="addCateForm"
                label-width="80px"
            >
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- option是父级分类对象数据 -->
                    <el-cascader
                        v-model="selectedOption"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="cascaderChange"
                        clearable
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAddCateDialog">取 消</el-button>
                <el-button type="primary" @click="confirmAddCateDialog"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 编辑分类对话框 -->
        <el-dialog
            title="提示"
            :visible.sync="editCateDialogVisible"
            width="30%"
            center
        >
            <el-form
                :model="editCateForm"
                :rules="addOrEditCateRules"
                ref="editCateRef"
                label-width="85px"
            >
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="confirmEditCate"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Categories",
    created() {
        this.getCateList();
    },
    data() {
        return {
            queryInfo: {
                pagenum: 1,
                pagesize: 5,
                type: 3,
            },
            cateList: [],
            // 总页数
            total: 0,
            // table表格数据源
            columns: [
                {
                    label: "分类名称",
                    prop: "cat_name",
                },
                {
                    label: "是否有效",
                    type: "template",
                    template: "isOk",
                },
                {
                    label: "排序",
                    type: "template",
                    template: "order",
                },
                {
                    label: "操作",
                    type: "template",
                    template: "operate",
                },
            ],
            addCateDialogVisible: false,
            editCateDialogVisible: false,
            // 当前正在编辑的cat_id
            currentEditCatId: "",
            // 添加分类表单数据对象
            addCateForm: {
                cat_name: "",
                // 分类父ID
                cat_pid: 0,
                // 分类层级
                cat_level: 0,
            },
            // 编辑分类表单数据对象
            editCateForm: {
                cat_name: "",
            },
            // 父级分类对象
            parentCateList: [],
            // 选择的分类对象
            selectedOption: [],
            // 配置对象
            cascaderProps: {
                expandTrigger: "hover",
                checkStrictly: true,
                label: "cat_name",
                value: "cat_id",
                children: "children",
            },
            // 对话框表单对象验证规则
            addOrEditCateRules: {
                cat_name: [
                    {
                        required: true,
                        message: "分类名称不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get(`categories`, {
                params: this.queryInfo,
            });
            if (res.meta.status !== 200)
                return this.$message({
                    message: "获取分类列表失败",
                    type: "error",
                    center: true,
                });
            this.cateList = res.data.result;
            this.total = res.data.total;
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getCateList();
        },
        showAddCateDialog() {
            this.addCateDialogVisible = true;
            this.getParentCateList();
        },
        // 获取父级分类列表
        async getParentCateList() {
            const { data: res } = await this.$http.get(`categories`, {
                params: {
                    type: 2,
                },
            });
            if (res.meta.status !== 200)
                return this.$message({
                    message: "获取父级分类列表失败",
                    type: "error",
                    center: true,
                });
            this.parentCateList = res.data;
            // console.log(res.data);
        },
        cascaderChange() {
            if (this.selectedOption.length === 1) {
                this.addCateForm.cat_pid = this.selectedOption[0];
                this.addCateForm.cat_level = 1;
            } else if (this.selectedOption.length === 2) {
                this.addCateForm.cat_pid = this.selectedOption[1];
                this.addCateForm.cat_level = 2;
            } else {
                this.addCateForm.cat_pid = 0;
                this.addCateForm.cat_level = 0;
            }
        },
        confirmAddCateDialog() {
            this.$refs.addCateRef.validate(async (valid) => {
                if (!valid) return;
                const { data: res } = await this.$http.post(
                    `categories`,
                    this.addCateForm
                );
                if (res.meta.status !== 201)
                    return this.$message({
                        message: "添加分类失败",
                        type: "error",
                        center: true,
                    });
                this.getCateList();
                this.$message({
                    message: "添加分类成功",
                    type: "success",
                    center: true,
                });
                this.addCateDialogVisible = false;
                this.selectedOption = [];
                this.$refs.addCateRef.resetFields();
                this.addCateForm.cat_pid = 0;
                this.addCateForm.cat_level = 0;
            });
        },
        cancelAddCateDialog() {
            this.addCateDialogVisible = false;
            this.$refs.addCateRef.resetFields();
            this.selectedOption = [];
            this.addCateForm.cat_pid = 0;
            this.addCateForm.cat_level = 0;
        },
        handleClose() {
            this.addCateDialogVisible = false;
            this.$refs.addCateRef.resetFields();
            this.selectedOption = [];
            this.addCateForm.cat_pid = 0;
            this.addCateForm.cat_level = 0;
        },
        async showEditCateDialog(id) {
            this.editCateDialogVisible = true;
            this.currentEditCatId = id;
            const { data: res } = await this.$http.get(`categories/${id}`);
            if (res.meta.status != 200)
                return this.$message({
                    message: "获取当前分类信息失败",
                    type: "error",
                    center: true,
                });
            this.editCateForm.cat_name = res.data.cat_name;
        },
        confirmEditCate() {
            this.$refs.editCateRef.validate(async (valid) => {
                if (!valid) return;
                const { data: res } = await this.$http.put(
                    `categories/${this.currentEditCatId}`,
                    this.editCateForm
                );
                if (res.meta.status !== 200)
                    return this.$message({
                        message: "更新分类信息失败",
                        type: "error",
                        center: true,
                    });
                this.$message({
                    message: res.meta.msg,
                    type: "success",
                    center: true,
                });
                this.editCateDialogVisible = false;
                this.getCateList();
            });
        },
        async deleteEditCateById(id) {
            const result = await this.$confirm(
                "此操作将永久删除该文件, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true
                }
            ).catch((err) => err);
            if (result === "confirm") {
                const { data: res } = await this.$http.delete(
                    `categories/${id}`
                );
                if (res.meta.status !== 200)
                    return this.$message({
                        message: "删除失败",
                        type: "error",
                        center: true,
                    });
                this.$message({
                    message: res.meta.msg,
                    type: "success",
                    center: true,
                });
                this.getCateList()
            }
        },
    },
};
</script>

<style lang="less" scoped>
.el-icon-success {
    color: green;
}
.el-icon-error {
    color: red;
}
.tree {
    margin: 15px 0;
}
.el-pagination {
    text-align: left;
}
.el-cascader {
    width: 100%;
}
</style>