<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="7">
                    <el-input
                        placeholder="请输入内容"
                        v-model="queryParams.query"
                        class="input-with-select"
                        clearable
                        @clear="clearInput"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="queryGoods"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="gotoAddPage"
                        >添加商品</el-button
                    >
                </el-col>
            </el-row>
            <el-table :data="goodList" stripe border>
                <el-table-column
                    label="#"
                    type="index"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="商品名称"
                    prop="goods_name"
                ></el-table-column>
                <el-table-column
                    label="价格（元）"
                    prop="goods_price"
                    width="200px"
                ></el-table-column>
                <el-table-column
                    label="商品重量"
                    prop="goods_weight"
                    width="200px"
                ></el-table-column>
                <el-table-column
                    label="创建时间"
                    prop="add_time"
                    width="200px"
                ></el-table-column>
                <el-table-column label="操作" width="200px" align="center">
                    <template v-slot="data">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            circle
                            size="mini"
                            @click="showEditGoodDialog(data.row.goods_id)"
                        ></el-button>
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            circle
                            size="mini"
                            @click="deleteGoodById(data.row.goods_id)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 7, 10, 20, 50]"
                :page-size="queryParams.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <el-dialog
            title="编辑商品信息"
            :visible.sync="editGoodDialogVisible"
            width="25%"
            center
        >
            <el-form
                :rules="editGoodRules"
                :model="editGoodForm"
                ref="editGoodRef"
            >
                <el-form-item
                    label="商品名称"
                    prop="goods_name"
                    label-width="85px"
                >
                    <el-input v-model="editGoodForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item
                    label="商品价格"
                    prop="goods_price"
                    label-width="85px"
                >
                    <el-input
                        v-model.number="editGoodForm.goods_price"
                    ></el-input
                ></el-form-item>
                <el-form-item
                    label="商品重量"
                    prop="goods_height"
                    label-width="85px"
                >
                    <el-input
                        v-model.number="editGoodForm.goods_height"
                    ></el-input
                ></el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEditGood">取 消</el-button>
                <el-button type="primary" @click="confirmEditGood"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import dayjs from "dayjs";
export default {
    name: "Goods",
    created() {
        this.getGoodList();
    },
    data() {
        return {
            // 商品列表
            goodList: [],
            // 搜索商品参数对象
            queryParams: {
                query: "",
                pagenum: 1,
                pagesize: 5,
            },
            // 当前页码
            currentPage: 1,
            // 总页数
            total: 1,
            // 编辑商品信息是否可视
            editGoodDialogVisible: false,
            // 商品对象
            editGoodForm: {
                goods_name: "",
                goods_price: 0,
                goods_height: 0,
            },
            // 商品验证规则
            editGoodRules: {
                goods_name: [
                    {
                        required: true,
                        message: "商品名称不能为空",
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
                goods_height: [
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
            },
            // 当前正在编辑的商品id
            currentGoodId: "",
        };
    },
    methods: {
        gotoAddPage() {
            this.$router.push("goods/add");
        },
        async getGoodList() {
            const { data: res } = await this.$http.get(`goods`, {
                params: this.queryParams,
            });
            if (res.meta.status !== 200)
                return this.$message({
                    message: res.meta.msg,
                    type: "error",
                    center: true,
                });
            // 时间戳格式化为标准时间
            res.data.goods.forEach((item) => {
                item.add_time = item.add_time * 1000;
                item.add_time = dayjs(item.add_time).format(
                    "YYYY-MM-DD HH:mm:ss"
                );
                item.upd_time = item.upd_time * 1000;
                item.upd_time = dayjs(item.upd_time).format(
                    "YYYY-MM-DD HH:mm:ss"
                );
            });

            this.goodList = res.data.goods;
            this.total = res.data.total;
            this.currentPage = parseInt(res.data.pagenum);
        },
        handleSizeChange(newSize) {
            this.queryParams.pagesize = newSize;
            this.getGoodList();
        },
        handleCurrentChange(newPage) {
            this.queryParams.pagenum = newPage;
            this.getGoodList();
        },
        async deleteGoodById(id) {
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
            if (result !== "confirm") {
                return this.$message({
                    message: "已取消删除",
                    type: "info",
                    center: true,
                });
            }
            const { data: res } = await this.$http.delete(`goods/${id}`);
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
            this.getGoodList();
        },
        queryGoods() {
            this.getGoodList();
        },
        clearInput() {
            this.getGoodList();
        },
        showEditGoodDialog(id) {
            this.currentGoodId = id;
            this.editGoodDialogVisible = true;
        },
        confirmEditGood() {
            this.$refs.editGoodRef.validate((valid) => {
                if (!valid) return;
                // const { data: res } = await this.$http.get(``)
                this.editGoodDialogVisible = false;
                this.$refs.editGoodRef.resetFields();
            });
        },
        cancelEditGood() {
            this.editGoodDialogVisible = false;
            this.$refs.editGoodRef.resetFields();
        },
    },
};
</script>

<style lang="less" scoped>
.el-pagination {
    text-align: left;
}
</style>