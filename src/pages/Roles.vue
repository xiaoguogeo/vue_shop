<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col style="text-align: left">
                    <el-button type="primary" @click="showAddRoleDialog"
                        >添加角色</el-button
                    >
                </el-col>
                <el-col>
                    <el-table :data="roleList" border stripe>
                        <el-table-column type="expand" width="50px">
                            <template v-slot="data">
                                <el-row
                                    :class="[
                                        'bottom-line',
                                        index1 === 0 ? 'top-line' : '',
                                    ]"
                                    v-for="(item, index1) in data.row.children"
                                    :key="item.id"
                                    type="flex"
                                    align="middle"
                                >
                                    <!-- 渲染一级权限 -->
                                    <el-col :span="5">
                                        <el-tag
                                            closable
                                            @close="
                                                removeRightById(
                                                    data.row,
                                                    item.id
                                                )
                                            "
                                            >{{ item.authName }}</el-tag
                                        >
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 渲染二级和三级权限 -->
                                    <el-col :span="19">
                                        <el-row
                                            :class="[
                                                index2 === 0 ? '' : 'top-line',
                                            ]"
                                            v-for="(
                                                child, index2
                                            ) in item.children"
                                            :key="child.id"
                                            type="flex"
                                            align="middle"
                                        >
                                            <el-col :span="6">
                                                <el-tag
                                                    type="success"
                                                    closable
                                                    @close="
                                                        removeRightById(
                                                            data.row,
                                                            child.id
                                                        )
                                                    "
                                                >
                                                    {{ child.authName }}
                                                </el-tag>
                                                <i
                                                    class="el-icon-caret-right"
                                                ></i>
                                            </el-col>
                                            <el-col :span="18">
                                                <el-tag
                                                    type="warning"
                                                    v-for="c in child.children"
                                                    :key="c.id"
                                                    closable
                                                    @close="
                                                        removeRightById(
                                                            data.row,
                                                            c.id
                                                        )
                                                    "
                                                >
                                                    {{ c.authName }}
                                                </el-tag>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="#"
                            type="index"
                            align="center"
                        ></el-table-column>
                        <el-table-column
                            label="角色名称"
                            prop="roleName"
                        ></el-table-column>
                        <el-table-column
                            label="角色权限"
                            prop="roleDesc"
                        ></el-table-column>
                        <el-table-column
                            label="操作"
                            align="center"
                            width="300px"
                        >
                            <template v-slot="row_data">
                                <el-button
                                    type="primary"
                                    icon="el-icon-edit"
                                    size="mini"
                                    @click="
                                        showEditRoleInfoDialog(row_data.row.id)
                                    "
                                    >编辑</el-button
                                >
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    @click="deleteRoleById(row_data.row.id)"
                                    >删除</el-button
                                >
                                <el-tooltip
                                    effect="dark"
                                    content="分配权限"
                                    placement="top"
                                    :enterable="false"
                                >
                                    <el-button
                                        type="warning"
                                        icon="el-icon-setting"
                                        size="mini"
                                        @click="
                                            showSetRightDialog(row_data.row)
                                        "
                                        >分配权限</el-button
                                    >
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>
        <!-- 添加角色对话框 -->
        <el-dialog
            title="添加角色"
            :visible.sync="addRoleDialogVisible"
            width="30%"
            :before-close="handleClose"
            :close-on-click-modal="false"
            center
        >
            <el-form
                :model="addRoleForm"
                :rules="addOrEditRoleRules"
                ref="addRoleRef"
                label-width="85px"
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAddRole">取 消</el-button>
                <el-button type="primary" @click="confirmAddRole"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 编辑角色对话框 -->
        <el-dialog
            title="编辑角色"
            :visible.sync="editRoleDialogVisible"
            width="30%"
            :before-close="handleClose"
            :close-on-click-modal="false"
            center
        >
            <el-form
                :model="editRoleForm"
                :rules="addOrEditRoleRules"
                ref="editRoleRef"
                label-width="85px"
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEditRole">取 消</el-button>
                <el-button type="primary" @click="confirmEditRole"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="40%"
            :close-on-click-modal="false"
            center
        >
            <el-tree
                :data="rightTree"
                :props="rightTreeProps"
                ref="rightRef"
                show-checkbox
                default-expand-all
                node-key="id"
                :default-checked-keys="leafArr"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="assignRights"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Roles",
    created() {
        this.getRoleList();
    },
    data() {
        return {
            roleList: [],
            setRightDialogVisible: false,
            addRoleDialogVisible: false,
            editRoleDialogVisible: false,
            // 添加角色表单数据
            addRoleForm: {
                roleName: "",
                roleDesc: "",
            },
            // 当前正在编辑的角色的id
            currentEditRoleId: "",
            // 编辑角色表单数据
            editRoleForm: {},
            // 添加或修改角色规则
            addOrEditRoleRules: {
                roleName: [
                    {
                        required: true,
                        message: "角色名称不能为空",
                        trigger: "blur",
                    },
                ],
                roleDesc: [
                    {
                        required: true,
                        message: "角色描述不能为空",
                        trigger: "blur",
                    },
                ],
            },
            rightTree: [],
            rightTreeProps: {
                label: "authName",
                children: "children",
            },
            // 存储三级权限id的数组
            leafArr: [],
            // 分配的权限的id字符串
            roleId: "",
        };
    },
    methods: {
        // 获取角色列表
        async getRoleList() {
            const { data: res } = await this.$http.get("roles");
            if (res.meta.status !== 200)
                return this.message.error("获取角色列表失败");
            this.roleList = res.data;
            // console.log(this.roleList)
        },
        // 根据id移除权限
        async removeRightById(role, right_id) {
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
                    `roles/${role.id}/rights/${right_id}`
                );
                if (res.meta.status !== 200)
                    return this.$message({
                        message: "删除权限失败",
                        type: "error",
                        center: true,
                    });
                role.children = res.data;
                this.$message({
                    message: "删除权限成功",
                    type: "success",
                    center: true,
                });
            } else {
                return this.$message({
                    message: "已取消删除",
                    type: "info",
                    center: true,
                });
            }
        },
        async showSetRightDialog(role) {
            this.roleId = role.id;
            const { data: res } = await this.$http.get("rights/tree");
            this.rightTree = res.data;
            this.leafArr = [];
            this.getLeafsId(role, this.leafArr);
            this.setRightDialogVisible = true;
        },
        // 获取叶子节点三级权限id的函数
        getLeafsId(node, arr) {
            if (!node.children) {
                return arr.push(node.id);
            }
            node.children.forEach((leafNode) => {
                this.getLeafsId(leafNode, arr);
            });
        },
        // 分配权限
        async assignRights() {
            const keys = [
                ...this.$refs.rightRef.getCheckedKeys(),
                ...this.$refs.rightRef.getHalfCheckedKeys(),
            ];
            let keysStr = keys.join(",");
            const { data: res } = await this.$http.post(
                `roles/${this.roleId}/rights`,
                { rids: keysStr }
            );
            if (res.meta.status !== 200)
                return this.$message({
                    message: "分配权限失败",
                    type: "error",
                    center: true,
                });
            this.setRightDialogVisible = false;
            this.$message({
                message: "分配权限成功",
                type: "success",
                center: true,
            });
            this.getRoleList();
        },
        showAddRoleDialog() {
            this.addRoleDialogVisible = true;
        },
        confirmAddRole() {
            this.$refs.addRoleRef.validate(async (valid) => {
                if (!valid) return;
                const { data: res } = await this.$http.post(
                    `roles`,
                    this.addRoleForm
                );
                if (res.meta.status !== 201)
                    return this.$message({
                        message: "添加角色失败",
                        type: "error",
                        center: true,
                    });
                this.$message({
                    message: "添加角色成功",
                    type: "success",
                    center: true,
                });
                this.addRoleDialogVisible = false;
                this.getRoleList();
                this.$refs.addRoleRef.resetFields();
            });
        },
        cancelAddRole() {
            this.addRoleDialogVisible = false;
            this.$refs.addRoleRef.resetFields();
        },
        handleClose() {
            this.$confirm("确认关闭？")
                .then((res) => {
                    if (res === "confirm") {
                        this.addRoleDialogVisible = false;
                        this.editRoleDialogVisible = false;
                        this.$refs.addRoleRef.resetFields();
                        this.$refs.editRoleRef.resetFields();
                    }
                })
                .catch((_) => {});
        },
        // 显示编辑角色信息对话框
        async showEditRoleInfoDialog(id) {
            const { data: res } = await this.$http.get(`roles/${id}`);
            if (res.meta.status !== 200)
                return this.$message({
                    message: "获取角色信息失败",
                    type: "error",
                    center: true,
                });
            this.editRoleDialogVisible = true;
            this.editRoleForm = res.data;
            this.currentEditRoleId = id;
        },
        confirmEditRole() {
            this.$refs.editRoleRef.validate(async (valid) => {
                if (!valid) return;
                const { data: res } = await this.$http.put(
                    `roles/${this.currentEditRoleId}`,
                    this.editRoleForm
                );
                if (res.meta.status !== 200)
                    return this.$message({
                        message: "修改角色信息失败",
                        type: "error",
                        center: true,
                    });
                this.$message({
                    message: "修改角色信息成功",
                    type: "success",
                    center: true,
                });
                this.editRoleDialogVisible = false;
                this.getRoleList();
                this.$refs.editRoleRef.resetFields();
            });
        },
        cancelEditRole() {
            this.editRoleDialogVisible = false;
            this.$refs.editRoleRef.resetFields();
        },
        async deleteRoleById(id) {
            const result = await this.$confirm(
                "此操作将永久删除该角色, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true
                }
            ).catch((err) => err);
            if (result === "confirm") {
                const { data: res } = await this.$http.delete(`roles/${id}`);
                if (res.meta.status !== 200)
                    return this.$message({
                        message: "删除角色失败",
                        type: "error",
                        center: true,
                    });
                this.$message({
                    message: "删除角色成功",
                    type: "success",
                    center: true,
                });
                this.getRoleList();
            } else {
                return this.$message({
                    message: "已取消删除",
                    type: "info",
                    center: true,
                });
            }
        },
    },
};
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
.top-line {
    border-top: 1px solid #eee;
}
.bottom-line {
    border-bottom: 1px solid #eee;
}
</style>