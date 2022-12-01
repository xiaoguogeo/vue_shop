<template>
    <div>
        <!-- <el-button @click="go">测试</el-button> -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">
                首页
            </el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                title="添加商品信息"
                type="info"
                center
                show-icon
                :closable="false"
            >
            </el-alert>
            <!-- 步骤条 -->
            <el-steps
                :active="parseInt(currentActiveTab)"
                finish-status="success"
                :align-center="true"
            >
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
            </el-steps>
            <!-- 选项卡 -->
            <el-form
                :rules="addGoodRules"
                ref="addGoodRef"
                :model="addGoodInfo"
            >
                <el-tabs
                    :tab-position="'left'"
                    v-model="currentActiveTab"
                    @tab-click="tabChange"
                >
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item
                            label="商品名称"
                            prop="goods_name"
                            label-width="80px"
                        >
                            <el-input
                                v-model="addGoodInfo.goods_name"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="商品价格"
                            prop="goods_price"
                            label-width="80px"
                        >
                            <el-input
                                type="number"
                                v-model.number="addGoodInfo.goods_price"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="商品数量"
                            prop="goods_number"
                            label-width="80px"
                        >
                            <el-input
                                type="number"
                                v-model.number="addGoodInfo.goods_number"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="商品重量"
                            prop="goods_weight"
                            label-width="80px"
                        >
                            <el-input
                                type="number"
                                v-model.number="addGoodInfo.goods_weight"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addGoodInfo.goods_cat"
                                :options="cateList"
                                :props="cascaderProp"
                            ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-alert
                            title="请取消勾选不存在的参数"
                            :closable="false"
                            type="warning"
                            show-icon
                            center
                        >
                        </el-alert>
                        <el-form-item
                            v-for="(item, index) in paramList"
                            :key="index"
                            :label="item.attr_name"
                            ><br />
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox
                                    v-for="(val, index2) in item.attr_vals"
                                    :key="index2"
                                    :label="val"
                                    border
                                >
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item
                            v-for="(item, index) in attrList"
                            :key="index"
                            :label="item.attr_name"
                        >
                            <el-input v-model="item.attr_vals"></el-input
                        ></el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                            class="upload-demo"
                            action="https://lianghj.top:8888/api/private/v1/upload"
                            list-type="picture"
                            :headers="headers"
                            :on-success="handleSuccess"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                        >
                            <el-button size="small" type="primary"
                                >点击上传</el-button
                            >
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor
                            v-model="addGoodInfo.goods_introduce"
                        ></quill-editor>
                        <div class="addGoodBtn">
                            <el-button type="primary" @click="addGood"
                                >添加</el-button
                            >
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <el-dialog
            title="图片预览"
            :visible.sync="previewImageDialogVisible"
            width="50%"
        >
            <el-image :src="imgUrl"> </el-image>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "AddGood",
    created() {
        this.getCateList();
    },
    data() {
        return {
            // 当前激活的面板及步骤
            currentActiveTab: "0",
            // 选中的分类Id
            // selectedCateId:[],
            // 分类列表
            cateList: [],
            // 动态参数列表
            paramList: [],
            //静态属性列表
            attrList: [],
            // 添加商品表单验证规则
            addGoodRules: {
                goods_name: [
                    {
                        required: true,
                        message: "商品名称不能为空",
                        trigger: "blur",
                    },
                    {
                        min: 2,
                        message: "商品名称至少为两个字符",
                        trigger: "blur",
                    },
                ],
                goods_price: [
                    {
                        required: true,
                        message: "商品价格不能为空",
                        trigger: "blur",
                    },
                    {
                        min: 0,
                        message: "商品价格不能为负数",
                        trigger: "blur",
                        type: "number",
                    },
                ],
                goods_weight: [
                    {
                        required: true,
                        message: "商品重量不能为空",
                        trigger: "blur",
                    },
                    {
                        min: 0,
                        message: "商品重量不能为负数",
                        trigger: "blur",
                        type: "number",
                    },
                ],
                goods_number: [
                    {
                        required: true,
                        message: "商品数量不能为空",
                        trigger: "blur",
                    },
                    {
                        min: 0,
                        message: "商品数量不能为负数",
                        trigger: "blur",
                        type: "number",
                    },
                ],
                goods_cat: [
                    {
                        required: true,
                        message: "商品分类不能为空",
                        trigger: "blur",
                    },
                ],
            },
            // 添加商品信息
            addGoodInfo: {
                goods_name: "",
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                goods_cat: [],
                // 图片的数组
                pics: [],
                // 商品的详情描述
                goods_introduce: "",
                attrs: [],
            },
            // 级联选择框配置项
            cascaderProp: {
                expandTrigger: "hover",
                label: "cat_name",
                value: "cat_id",
                children: "children",
            },
            // 是否禁用面板
            paneDisabled: true,
            // 上传图片携带的请求头
            headers: {
                Authorization: window.sessionStorage.getItem("token"),
            },
            // 图片列表
            imgUrl: "",
            previewImageDialogVisible: false,
        };
    },
    methods: {
        tabChange() {
            // 表单是否验证通过，通过才能跳转到其他pane页面
            this.$nextTick((x) => {
                this.$refs.addGoodRef.validate((valid) => {
                    if (!valid) {
                        this.currentActiveTab = "0";
                        return this.$message({
                            message: "请正确填写商品信息",
                            type: "error",
                            center: true,
                        });
                    }
                });
            });
            if (this.currentActiveTab === "1") {
                this.getCateAttrList("many");
            } else if (this.currentActiveTab === "2") {
                this.getCateAttrList("only");
            }
        },
        async getCateList() {
            const { data: res } = await this.$http.get(`categories`);
            if (res.meta.status !== 200)
                return this.$message({
                    message: res.meta.msg,
                    type: "error",
                    center: true,
                });
            this.cateList = res.data;
        },
        async getCateAttrList(sel) {
            let cat_id = this.addGoodInfo.goods_cat.slice(-1)[0];
            const { data: res } = await this.$http.get(
                `categories/${cat_id}/attributes?sel=${sel}`
            );
            if (res.meta.status !== 200)
                return this.$message({
                    message: res.meta.msg,
                    type: "error",
                    center: true,
                });
            // 将attr_vals转化为数组
            res.data.forEach((item) => {
                // 动态参数需要将attr_vals拆分为数组，而静态属性不需要
                if (sel === "many") {
                    if (item.attr_vals.length > 0) {
                        item.attr_vals = item.attr_vals.split(",");
                    } else {
                        item.attr_vals = [];
                    }
                }
            });
            if (sel === "many") {
                this.paramList = res.data;
            } else {
                this.attrList = res.data;
            }
        },
        // handleSuccess(resp) {
        //     this.addGoodInfo.pics.push({ pic: resp.data.tmp_path });
        // },
        handlePreview(img) {
            this.previewImageDialogVisible = true;
            this.imgUrl = img.response.data.url;
        },
        // handleRemove(img) {
        //     const imgPath = img.response.data.tmp_path;
        //     const index = this.addGoodInfo.pics.findIndex(
        //         (x) => x.pic === imgPath
        //     );
        //     this.addGoodInfo.pics.splice(index, 1);
        // },
        async addGood() {
            // 优化参数
            this.addGoodInfo.goods_cat = this.addGoodInfo.goods_cat.join();
            this.paramList.forEach((item) => {
                item.attr_vals = item.attr_vals.join();
                this.addGoodInfo.attrs.push(item);
            });
            this.attrList.forEach((item) => {
                this.addGoodInfo.attrs.push(item);
            });
            const { data: res } = await this.$http.post(
                `goods`,
                this.addGoodInfo
            );
            if (res.meta.status !== 201)
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
            this.$router.push("/goods");
        },
    },
};
</script>

<style lang="less" scoped>
// 引入外部css样式，避免富文本编辑器的样式跟elementui样式冲突
// @import url("../assets/css/ql-editor.css");
.el-steps {
    margin: 15px 0;
}
.el-input-number {
    width: 100%;
}
.el-tabs {
    &:first-child {
        &:last-child {
            text-align: left;
        }
    }
    &:last-child {
        text-align: center;
        .el-button {
            margin-top: 15px;
        }
    }
}
.el-tab-pane {
    span {
        font-size: 12px;
    }
}
.el-checkbox {
    margin: 15px 10px 0 0;
}
.upload-demo {
    width: 200px;
}

::v-deep .ql-container {
    height: 200px;
}

.addGoodBtn {
    display: flex;
    justify-content: center;
}
</style>