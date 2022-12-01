<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                show-icon
                :closable="false"
            >
            </el-alert>
            <div class="cascader">
                <span>选择商品分类：</span>
                <el-cascader
                    v-model="selectedCateId"
                    :options="cateList"
                    :props="cateProps"
                    @change="handleChange"
                ></el-cascader>
            </div>
            <el-tabs v-model="activeName" @tab-click="handleTagClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button
                        type="primary"
                        :disabled="isBtnDisable"
                        @click="showAddCateAttrDialog"
                        >添加参数</el-button
                    >
                    <el-table
                        :data="attrList"
                        style="width: 100%"
                        border
                        stripe
                    >
                        <el-table-column type="expand">
                            <template v-slot="data">
                                <el-tag
                                    v-for="(item, index) in data.row.attr_vals"
                                    :key="index"
                                    closable
                                    @close="deleteTag(data.row, index)"
                                >
                                    {{ item }}
                                </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="data.row.inputVisible"
                                    v-model="inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="
                                        handleInputConfirm(data.row)
                                    "
                                    @blur="handleInputConfirm(data.row)"
                                >
                                </el-input>
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(data.row)"
                                    >+ New Tag</el-button
                                >
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#" align="center">
                        </el-table-column>
                        <el-table-column prop="attr_name" label="参数名称">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="180px"
                            align="center"
                        >
                            <template v-slot="data">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    icon="el-icon-edit"
                                    @click="
                                        showEditCateAttrDialog(data.row.attr_id)
                                    "
                                    >编辑</el-button
                                >
                                <el-button
                                    type="danger"
                                    size="mini"
                                    icon="el-icon-delete"
                                    @click="deleteAttrById(data.row.attr_id)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button
                        type="primary"
                        :disabled="isBtnDisable"
                        @click="showAddCateAttrDialog"
                        >添加参数</el-button
                    >
                    <el-table
                        :data="attrList"
                        style="width: 100%"
                        border
                        stripe
                    >
                        <el-table-column type="expand">
                            <template v-slot="data">
                                <el-tag
                                    v-for="(item, index) in data.row.attr_vals"
                                    :key="index"
                                    closable
                                    @close="deleteTag(data.row, index)"
                                >
                                    {{ item }}
                                </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="data.row.inputVisible"
                                    v-model="inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="
                                        handleInputConfirm(data.row)
                                    "
                                    @blur="handleInputConfirm(data.row)"
                                >
                                </el-input>
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(data.row)"
                                    >+ New Tag</el-button
                                >
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#">
                        </el-table-column>
                        <el-table-column prop="attr_name" label="参数名称">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="180px"
                            align="center"
                        >
                            <template v-slot="data">
                                <el-button
                                    type="primary"
                                    size="mini"
                                    icon="el-icon-edit"
                                    @click="
                                        showEditCateAttrDialog(data.row.attr_id)
                                    "
                                    >编辑</el-button
                                >
                                <el-button
                                    type="danger"
                                    size="mini"
                                    icon="el-icon-delete"
                                    @click="deleteAttrById(data.row.attr_id)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数/属性对话框 -->
        <el-dialog
            :title="form_label"
            :visible.sync="attrDialogVisible"
            width="30%"
            center
        >
            <el-form
                :model="addCateAttrForm"
                ref="addCateAttrRef"
                :rules="addCateAttrRules"
            >
                <el-form-item
                    :label="addCateAttrDialogTitle"
                    label-width="80px"
                    prop="attr_name"
                >
                    <el-input v-model="addCateAttrForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAddCateAttr">取 消</el-button>
                <el-button type="primary" @click="confirmAddCateAttr"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 编辑参数/属性对话框 -->
        <el-dialog
            :title="form_label"
            :visible.sync="editAttrDialogVisible"
            width="30%"
            center
        >
            <el-form
                :model="addCateAttrForm"
                ref="editCateAttrRef"
                :rules="addCateAttrRules"
            >
                <el-form-item
                    :label="addCateAttrDialogTitle"
                    label-width="80px"
                    prop="attr_name"
                >
                    <el-input v-model="addCateAttrForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editAttrDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="confirmEditCateAttr"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Params",
    created() {
        this.getCateList();
    },
    data() {
        return {
            // 分类列表
            cateList: [],
            // 属性列表
            attrList: [],
            // 属性值
            attrVal: [],
            // 级联选择框配置项
            cateProps: {
                expandTrigger: "hover",
                // 是否可选任意一级的标签，默认为不可选（false）
                // checkStrictly: true,
                label: "cat_name",
                value: "cat_id",
                children: "children",
            },
            // 选中的分类ID数组
            selectedCateId: [],
            // 默认被激活的tab
            activeName: "many",
            attrDialogVisible: false,
            editAttrDialogVisible: false,
            // 添加分类属性数据对象
            addCateAttrForm: {
                attr_name: "",
                attr_sel: "",
                attr_vals: "",
            },
            // 添加分类对象验证规则
            addCateAttrRules: {
                attr_name: [
                    {
                        required: true,
                        message: "分类参数不能为空",
                        trigger: "blur",
                    },
                ],
            },
            // 表单标题
            form_label: "",
            // 当前正在编辑的参数/属性id
            currentEditCateAttrId: "",
            // 添加标签按钮默认不显示
            // inputVisible: false,
            // 标签的值
            inputValue: "",
        };
    },
    methods: {
        handleChange() {
            this.getCateAttr();
        },
        async getCateList() {
            const { data: res } = await this.$http.get(`categories`);
            if (res.meta.status !== 200)
                return this.$message({
                    message: "获取分类列表失败",
                    type: "error",
                    center: true,
                });
            this.cateList = res.data;
            // console.log(this.cateList)
        },
        handleTagClick() {
            this.getCateAttr();
        },
        async getCateAttr() {
            const { data: res } = await this.$http.get(
                `categories/${this.selectedCateId.slice(-1)[0]}/attributes`,
                { params: { sel: this.activeName } }
            );
            if (res.meta.status !== 200) {
                if (this.activeName === "many") {
                    return this.$message({
                        message: "获取参数失败",
                        type: "error",
                        center: true,
                    });
                } else {
                    return this.$message({
                        message: "获取属性失败",
                        type: "error",
                        center: true,
                    });
                }
            }
            res.data.forEach((item) => {
                if (item.attr_vals.trim().length > 0) {
                    // ES6扩展运算符加set去重;
                    item.attr_vals = [...new Set(item.attr_vals.split(","))];
                } else {
                    item.attr_vals = [];
                }
                this.$set(item, "inputVisible", false);
                // this.$set(item, "inputValue", "");
            });
            this.attrList = res.data;
            // console.log(this.attrList);
        },
        showAddCateAttrDialog() {
            this.attrDialogVisible = true;
        },
        confirmAddCateAttr() {
            this.$refs.addCateAttrRef.validate(async (valid) => {
                if (!valid) return;
                this.addCateAttrForm.attr_sel = this.activeName;
                const { data: res } = await this.$http.post(
                    `categories/${this.selectedCateId.slice(-1)[0]}/attributes`,
                    this.addCateAttrForm
                );
                if (res.meta.status !== 201)
                    return this.$message({
                        message: "添加失败",
                        type: "error",
                        center: true,
                    });
                this.$message({
                    message: "添加成功",
                    type: "success",
                    center: true,
                });
                this.attrDialogVisible = false;
                this.$refs.addCateAttrRef.resetFields();
                this.getCateAttr();
            });
        },
        cancelAddCateAttr() {
            this.$refs.addCateAttrRef.resetFields();
            this.attrDialogVisible = false;
        },
        confirmEditCateAttr() {
            this.$refs.editCateAttrRef.validate(async (valid) => {
                if (!valid) return;
                const { data: res } = await this.$http.put(
                    `categories/${
                        this.selectedCateId.slice(-1)[0]
                    }/attributes/${this.currentEditCateAttrId}`,
                    this.addCateAttrForm
                );
                this.attrDialogVisible = false;
                if (res.meta.status !== 200)
                    return this.$message({
                        message: "添加失败",
                        type: "error",
                        center: true,
                    });
                this.$message({
                    message: "添加成功",
                    type: "success",
                    center: true,
                });
                // console.log(res);
                this.getCateAttr();
                this.editAttrDialogVisible = false;
            });
        },
        async showEditCateAttrDialog(id) {
            this.editAttrDialogVisible = true;
            const { data: res } = await this.$http.get(
                `categories/${
                    this.selectedCateId.slice(-1)[0]
                }/attributes/${id}`
            );
            this.addCateAttrForm.attr_name = res.data.attr_name;
            this.addCateAttrForm.attr_sel = this.activeName;
            this.currentEditCateAttrId = id;
            // console.log(res);
        },
        async deleteAttrById(id) {
            const result = await this.$confirm(
                "此操作将永久删除该记录, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true,
                }
            ).catch((err) => err);
            if (result === "confirm") {
                const { data: res } = await this.$http.delete(
                    `categories/${
                        this.selectedCateId.slice(-1)[0]
                    }/attributes/${id}`
                );
                if (res.meta.status !== 200)
                    return this.$message({
                        message: res.meta.msg,
                        type: "error",
                        center: true,
                    });
                this.$message({
                    message: res.meta.msg,
                    type: "success",
                    center: true,
                });
                this.getCateAttr();
            } else {
                return this.$message({
                    message: "已取消删除",
                    type: "info",
                    center: true,
                });
            }
        },
        // 按下回车或者输入框失去焦点
        async handleInputConfirm(data) {
            data.inputVisible = false;
            if (this.inputValue.trim().length === 0) return;

            // ES6 includes判断是否已经有该tag
            if (data.attr_vals.includes(this.inputValue)) {
                return this.$message({
                    message: "请勿添加已存在的标签",
                    type: "warning",
                    center: true,
                });
            }

            data.attr_vals.push(this.inputValue);
            this.addCateAttrForm.attr_vals = data.attr_vals.join();
            this.addCateAttrForm.attr_name = data.attr_name;
            this.addCateAttrForm.attr_sel = this.activeName;

            this.inputValue = "";

            const { data: res } = await this.$http.put(
                `categories/${this.selectedCateId.slice(-1)[0]}/attributes/${
                    data.attr_id
                }`,
                this.addCateAttrForm
            );
            if (res.meta.status !== 200)
                return this.$message({
                    message: res.meta.msg,
                    type: "error",
                    center: true,
                });
            this.$message({
                message: res.meta.msg,
                type: "success",
                center: true,
            });
            // 重置
            this.addCateAttrForm = {
                attr_name: "",
                attr_sel: "",
                attr_vals: "",
            };
        },
        showInput(data) {
            data.inputVisible = true;
            this.$nextTick((x) => {
                this.$refs.saveTagInput.focus();
            });
        },
        async deleteTag(data, index) {
            // 删除tag标签
            data.attr_vals.splice(index, 1);

            // 更新数据
            this.addCateAttrForm.attr_vals = data.attr_vals.join();
            this.addCateAttrForm.attr_name = data.attr_name;
            this.addCateAttrForm.attr_sel = this.activeName;

            const { data: res } = await this.$http.put(
                `categories/${this.selectedCateId.slice(-1)[0]}/attributes/${
                    data.attr_id
                }`,
                this.addCateAttrForm
            );
            if (res.meta.status !== 200)
                return this.$message({
                    message: res.meta.msg,
                    type: "error",
                    center: true,
                });

            this.$message({
                message: "删除标签成功",
                type: "success",
                center: true,
            });
        },
    },
    computed: {
        isBtnDisable() {
            if (this.selectedCateId.length === 0) return true;
            return false;
        },
        addCateAttrDialogTitle() {
            if (this.activeName === "many") {
                this.form_label = "添加动态参数";
                return "动态参数";
            }
            this.form_label = "添加静态属性";
            return "静态属性";
        },
    },
};
</script>

<style lang="less" scoped>
.cascader {
    text-align: left;
    margin: 15px 0;
}
.el-tab-pane {
    text-align: left;
}
.el-tag {
    margin: 5px 10px;
}
.button-new-tag {
    margin: 5px 10px;
}
.input-new-tag {
    margin: 5px 10px;
    width: 100px;
}
</style>