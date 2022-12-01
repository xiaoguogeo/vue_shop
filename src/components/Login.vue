<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/img/avatar.jpg" alt="" />
            </div>
            <el-form
                ref="loginFormRef"
                label-width="0px"
                class="login_form"
                :model="form"
                :rules="loginFormRules"
            >
                <el-form-item prop="username">
                    <el-input
                        prefix-icon="iconfont icon-yonghuming"
                        placeholder="用户名"
                        v-model="form.username"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        prefix-icon="iconfont icon-ziyuanxhdpi"
                        placeholder="密码"
                        v-model="form.password"
                        show-password
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: "Login",
    data() {
        return {
            form: {
                username: "admin",
                password: "123456",
            },
            loginFormRules: {
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 25,
                        message: "用户名长度应为 3 到 25 个字符",
                        trigger: "blur",
                    },
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    {
                        min: 6,
                        max: 18,
                        message: "密码长度应为 6 到 18 个字符",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        login() {
            this.$refs.loginFormRef.validate(async (validate) => {
                if (!validate) return;
                const { data: res } = await this.$http.post("login", this.form);
                if (res.meta.status === 200) {
                    this.$message({
                        message: "登录成功",
                        type: "success",
                        center: true,
                    });
                    window.sessionStorage.setItem("token", res.data.token);
                    this.$router.push("/home");
                } else {
                    return this.$message({
                        message: "登录失败",
                        type: "error",
                        center: true,
                    });
                }
            });
        },
        reset() {
            this.$refs.loginFormRef.resetFields();
        },
    },
};
</script>
<style lang="less" scoped>
.login_container {
    height: 100%;
    background-color: #65c294;
    .login_box {
        height: 280px;
        width: 400px;
        border-radius: 5px;
        background-color: aliceblue;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

.avatar_box {
    width: 100px;
    height: 100px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>