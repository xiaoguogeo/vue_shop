<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input
                        placeholder="请输入内容"
                        class="input-with-select"
                        v-model="queryInfo.query"
                        clearable
                        @clear="queryUser"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="queryUser"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible"
                        >添加用户</el-button
                    >
                </el-col>
            </el-row>
            <el-table :data="userList" stripe border>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column
                    label="角色"
                    prop="role_name"
                ></el-table-column>
                <el-table-column label="状态">
                    <template v-slot="row_data">
                        <el-switch
                            v-model="row_data.row.mg_state"
                            @change="changeState(row_data.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template v-slot="row_data">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            circle
                            size="mini"
                            @click="editUserInfo(row_data.row.id)"
                        ></el-button>
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            circle
                            size="mini"
                            @click="deleteUser(row_data.row.id)"
                        ></el-button>
                        <el-tooltip
                            effect="dark"
                            content="分配角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                circle
                                size="mini"
                                @click="assignRole(row_data.row)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="dialogVisibleForAdd"
            :close-on-click-modal="false"
            width="30%"
            center
        >
            <el-form
                :model="addUserForm"
                :rules="addOrEditFormRules"
                ref="addFormRef"
                label-width="65px"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAddUser">取 消</el-button>
                <el-button type="primary" @click="confirmAddUser"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 修改用户信息对话框 -->
        <el-dialog
            title="修改用户信息"
            :visible.sync="dialogVisibleForEdit"
            width="30%"
            :close-on-click-modal="false"
            center
        >
            <el-form
                :model="editForm"
                :rules="addOrEditFormRules"
                ref="editFormRef"
                label-width="65px"
            >
                <el-form-item label="用户名" prop="edit_username">
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
                <el-button @click="cancelEditUser">取 消</el-button>
                <el-button type="primary" @click="confirmEditUser"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog
            title="分配角色"
            :visible.sync="dialogVisibleForAssign"
            width="30%"
            @close="assignRightsDialogClosed"
            :close-on-click-modal="false"
            center
        >
            <p>当前用户：{{ userInfo.username }}</p>
            <p>当前角色：{{ userInfo.role_name }}</p>
            <p>
                分配新角色：
                <el-select v-model="selectedRoleId" placeholder="请选择">
                    <el-option
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleForAssign = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="confirmAssignRole"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>
        </el-card>
    </div>
</template>
<script>
export default {
    name: "User",
    created() {
        this.getUserList();
    },
    data() {
        // 自定义的验证邮箱规则
        let checkEmail = (rule, value, cb) => {
            const regEmail =
                /^[a-zA-Z0-9_-]+@([a-zA-Z0-9_-]+\.)+(com|cn|com\.cn)/;
            if (regEmail.test(value)) {
                cb();
            }
            cb(new Error("请输入正确的邮箱"));
        };
        // 自定义的验证手机号的规则
        let checkMobile = (rule, value, cb) => {
            const regMobile =
                /^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
            if (regMobile.test(value)) {
                cb();
            }
            cb(new Error("请输入正确的手机号"));
        };
        return {
            // 用户信息
            queryInfo: {
                query: "",
                pagenum: 1,
                pagesize: 2,
            },
            // 用户列表
            userList: [],
            addUserForm: {
                username: "",
                password: "",
                email: "",
                mobile: "",
            },
            editForm: {},
            addOrEditFormRules: {
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 18,
                        message: "用户名长度为3~18",
                        trigger: "blur",
                    },
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    {
                        min: 3,
                        max: 18,
                        message: "密码长度为3~18",
                        trigger: "blur",
                    },
                ],
                email: [
                    { required: true, message: "请输入邮箱", trigger: "blur" },
                    { validator: checkEmail, trigger: "blur" },
                ],
                mobile: [
                    {
                        required: true,
                        message: "请输入手机号码",
                        trigger: "blur",
                    },
                    { validator: checkMobile, trigger: "blur" },
                ],
                edit_username: [],
            },
            total: 0,
            // 需要分配角色的用户信息
            userInfo: {},
            // 角色列表
            roleList: [],
            // 选择的角色Id
            selectedRoleId: "",
            dialogVisibleForAdd: false,
            dialogVisibleForEdit: false,
            dialogVisibleForAssign: false,
        };
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get("users", {
                params: this.queryInfo,
            });
            if (res.meta.status !== 200) {
                return this.$message({
                    message: "获取用户列表失败",
                    type: "error",
                    center: true,
                });
            }
            this.userList = res.data.users;
            this.total = res.data.total;
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getUserList();
            // console.log(newPage)
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getUserList();
            // console.log(newPage)
        },
        queryUser() {
            this.getUserList();
        },
        addDialogVisible() {
            this.dialogVisibleForAdd = true;
        },
        async changeState(user) {
            // console.log(user.mg_state)
            const { data: res } = await this.$http.put(
                `users/${user.id}/state/${user.mg_state}`
            );
            if (res.meta.status !== 200) {
                user.mg_state = !user.mg_state;
                return this.$message({
                    message: "状态修改失败",
                    type: "error",
                    center: true,
                });
            }
        },
        confirmAddUser() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) return;
                this.dialogVisibleForAdd = false;
                const { data: res } = await this.$http.post(
                    "users",
                    this.addUserForm
                );
                // console.log(res)
                if (res.meta.status !== 201)
                    return this.$message({
                        message: "添加用户失败",
                        type: "error",
                        center: true,
                    });
                this.$message({
                    message: res.meta.msg,
                    type: "success",
                    center: true,
                });
                this.getUserList();
                this.$refs.addFormRef.resetFields();
            });
        },
        cancelAddUser() {
            this.dialogVisibleForAdd = false;
            this.$refs.addFormRef.resetFields();
        },
        async editUserInfo(id) {
            const { data: res } = await this.$http.get(`users/${id}`);
            if (res.meta.status !== 200)
                return this.$message({
                    message: "修改用户信息失败",
                    type: "error",
                    center: true,
                });
            this.dialogVisibleForEdit = true;
            this.editForm = res.data;
        },
        confirmEditUser() {
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) return;
                // this.$refs.editFormRef.resetFields();
                const { data: res } = await this.$http.put(
                    `users/${this.editForm.id}`,
                    { email: this.editForm.email, mobile: this.editForm.mobile }
                );

                if (res.meta.status !== 200)
                    return this.$message({
                        message: "更新用户信息失败",
                        type: "error",
                        center: true,
                    });
                this.dialogVisibleForEdit = false;
                this.$message({
                    message: "更新用户信息成功",
                    type: "success",
                    center: true,
                });
                this.getUserList();
            });
        },
        cancelEditUser() {
            this.dialogVisibleForEdit = false;
            this.$refs.editFormRef.resetFields();
        },
        async deleteUser(id) {
            const result = await this.$confirm(
                "此操作将永久删除该文件, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true,
                }
            ).catch((err) => err);
            if (result === "confirm") {
                const { data: res } = await this.$http.delete(`users/${id}`);
                if (res.meta.status !== 200)
                    return this.$message({
                        message: "删除失败",
                        type: "error",
                        center: true,
                    });
                this.$message({
                    message: "删除成功",
                    type: "success",
                    center: true,
                });
                this.getUserList();
            } else {
                return this.$message({
                    message: "已取消删除",
                    type: "info",
                    center: true,
                });
            }
        },
        async assignRole(role) {
            this.userInfo = role;
            this.dialogVisibleForAssign = true;
            const { data: res } = await this.$http.get(`roles`);
            if (res.meta.status !== 200)
                return this.$message({
                    message: "获取角色列表失败",
                    type: "error",
                    center: true,
                });
            this.roleList = res.data;
        },
        async confirmAssignRole() {
            if (!this.selectedRoleId) {
                return this.$message({
                    message: "请选择要分配的新角色",
                    type: "error",
                    center: true,
                });
            }
            const { data: res } = await this.$http.put(
                `users/${this.userInfo.id}/role`,
                { rid: this.selectedRoleId }
            );
            if (res.meta.status !== 200)
                return this.$message({
                    message: "分配角色失败",
                    type: "error",
                    center: true,
                });
            this.$message({
                message: "分配角色成功",
                type: "success",
                center: true,
            });
            this.getUserList();
            this.dialogVisibleForAssign = false;
        },
        assignRightsDialogClosed() {
            this.selectedRoleId = "";
            this.userInfo = {};
        },
    },
};
</script>
<style lang="less" scoped>
.el-card {
    text-align: left;
}
</style>