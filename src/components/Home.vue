<template>
    <el-container class="home_container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <div class="logo">
                    <!-- <img src="../assets/img/xgg.png" alt="" /> -->
                </div>
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="exit">退出</el-button>
        </el-header>
        <el-container>
            <!-- 侧边栏区域 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div
                    class="collapse"
                    @click="collapse"
                    v-html="collapse_icon"
                ></div>
                <!-- 侧边栏菜单区域 -->
                <el-menu
                    background-color="#313443"
                    text-color="#fff"
                    active-text-color="#409eff"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    router
                    :default-active="activeTitle"
                >
                    <!-- 一级菜单 -->
                    <el-submenu
                        :index="item.id.toString()"
                        v-for="item in menusList"
                        :key="item.id"
                    >
                        <template slot="title">
                            <i :class="iconObj[item.id]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item
                            v-for="subItem in item.children"
                            :key="subItem.id"
                            :index="`/${subItem.path}`"
                        >
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    name: "Home",
    created() {
        this.getMenusList();
    },
    data() {
        return {
            menusList: [],
            iconObj: {
                125: "iconfont icon-yonghuguanli",
                103: "iconfont icon-quanxianguanli",
                101: "iconfont icon-shangpinguanli",
                102: "iconfont icon-dingdanguanli",
                145: "iconfont icon-shujutongji",
            },
            isCollapse: false,
            collapse_icon: '<i class="el-icon-caret-left"></i>',
        };
    },
    methods: {
        exit() {
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        async getMenusList() {
            const { data: res } = await this.$http.get("menus");
            // console.log(res);
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg);
            this.menusList = res.data;
            // console.log(this.menusList)
        },
        collapse() {
            this.isCollapse = !this.isCollapse;
            if (this.isCollapse) {
                this.collapse_icon = '<i class="el-icon-caret-right"></i>';
            } else {
                this.collapse_icon = '<i class="el-icon-caret-left"></i>';
            }
        },
    },
    computed: {
        // 使菜单默认打开的标签定位到一级域名
        // 例：/goods/add --> /goods
        activeTitle() {
            let path = this.$router.currentRoute.path;
            let t = path.split("/", 2);
            return t.join("/");
        },
    },
};
</script>
<style lang="less" scoped>
@size: 50px;
.home_container {
    height: 100%;
}
.el-header {
    background-color: #2f3237;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #7fb80e;
    font-size: 18px;
    > div {
        display: flex;
        align-items: center;
        span {
            padding-left: 15px;
        }
        .logo{
            height: @size;
            width: @size;
            background: url('../assets/img/xgg.png') no-repeat;
            background-size: @size @size;
            border-radius: 50%;
        }
    }
}
.el-aside {
    background-color: #313443;
    .collapse {
        background-color: #78808f;
        height: 30px;
        line-height: 30px;
        font-size: 24px;
        color: white;
        cursor: pointer;
    }
    .el-menu {
        border-right-width: 0;
        text-align: left;
    }
}

.iconfont {
    margin-right: 7px;
}
</style>