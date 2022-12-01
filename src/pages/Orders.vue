<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input
                        placeholder="请输入订单号"
                        v-model="queryParams.query"
                        class="input-with-select"
                        clearable
                        @clear="clearQueryInput"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                        ></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="orderList" stripe border>
                <el-table-column
                    label="#"
                    type="index"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="订单编号"
                    prop="order_number"
                ></el-table-column>
                <el-table-column
                    label="订单价格"
                    prop="order_price"
                    align="center"
                ></el-table-column>
                <el-table-column label="是否支付" align="center">
                    <template v-slot="data">
                        <el-tag v-if="data.row.pay_status === '0'" type="danger"
                            >未支付</el-tag
                        >
                        <el-tag v-else type="success">已支付</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="是否发货"
                    prop="is_send"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="下单时间"
                    prop="create_time"
                    align="center"
                ></el-table-column>
                <el-table-column label="操作" align="center">
                    <template>
                        <el-button
                            type="primary"
                            size="medium"
                            icon="el-icon-edit"
                            circle
                            @click="showEditLocationDialog"
                        ></el-button>
                        <el-button
                            type="success"
                            size="medium"
                            icon="el-icon-location"
                            circle
                            @click="logistics"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="parseInt(currentPage)"
                :page-sizes="[1, 2, 5, 7, 10, 15, 50]"
                :page-size="queryParams.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <!-- 物流进度对话框 -->
        <el-dialog
            title="物流进度"
            :visible.sync="logisticsDialogVisible"
            width="30%"
            :before-close="handleClose"
        >
            <el-timeline>
                <el-timeline-item
                    v-for="(activity, index) in activities"
                    :key="index"
                    :timestamp="activity.ftime"
                >
                    {{ activity.context }}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
        <!-- 修改地址对话框 -->
        <el-dialog
            title="修改地址"
            :visible.sync="editLocationDialogVisible"
            width="25%"
            center
        >
            <el-form
                :rules="editLocationRules"
                ref="editLocationRef"
                :model="address"
            >
                <el-form-item label="省市区/县" prop="city" label-width="85px">
                    <el-cascader
                        v-model="address.city"
                        :props="addressProps"
                        :options="cityData"
                    ></el-cascader>
                </el-form-item>
                <el-form-item
                    label="详细地址"
                    prop="location"
                    label-width="85px"
                >
                    <el-input v-model="address.location"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editLocationDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="confirmEditLocation"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import cityData from "../assets/js/citydata.js";
export default {
    name: "Orders",
    created() {
        this.getOrderList();
    },
    data() {
        return {
            // 查询参数
            queryParams: {
                query: "",
                pagenum: 1,
                pagesize: 7,
            },
            // 订单列表
            orderList: [],
            // 总页数
            total: 0,
            // 当前页码
            currentPage: 1,
            // 物流信息列表
            activities: [],
            // 物流状态对话框是否可视
            logisticsDialogVisible: false,
            // 修改地址对话框是否可视
            editLocationDialogVisible: false,
            // 编辑地址验证规则
            editLocationRules: {
                city: [
                    {
                        required: true,
                        message: "省市区/县不能为空",
                        trigger: "blur",
                    },
                ],
                location: [
                    {
                        required: true,
                        message: "请输入详细地址",
                        trigger: "blur",
                    },
                ],
            },
            // 城市数据
            cityData: cityData,
            // 地址信息
            address: {
                city: [],
                location: "",
            },
            // 城市信息配置项
            addressProps: {
                expandTrigger: "hover",
                label: "label",
                value: "value",
            },
        };
    },
    methods: {
        async getOrderList() {
            const { data: res } = await this.$http.get(`orders`, {
                params: this.queryParams,
            });
            if (res.meta.status !== 200)
                return this.$message({
                    message: res.meta.msg,
                    type: "error",
                    center: true,
                });

            res.data.goods.forEach((item) => {
                item.create_time = dayjs(item.create_time * 1000).format(
                    "YYYY-MM-DD HH:mm:ss"
                );
                item.update_time = dayjs(item.update_time * 1000).format(
                    "YYYY-MM-DD HH:mm:ss"
                );
            });

            this.orderList = res.data.goods;
            this.total = res.data.total;
            this.currentPage = res.data.pagenum;
        },
        clearQueryInput() {
            this.getOrderList();
        },
        handleSizeChange(newPageSize) {
            this.queryParams.pagesize = newPageSize;
            this.getOrderList();
        },
        handleCurrentChange(newPageNum) {
            this.queryParams.pagenum = newPageNum;
            this.getOrderList();
        },
        async logistics() {
            const { data: res } = await this.$http.get(`kuaidi/1106975712662`);
            if (res.meta.status !== 200)
                return this.$message({
                    message: res.meta.msg,
                    type: "error",
                    center: true,
                });
            this.logisticsDialogVisible = true;
            this.activities = res.data;
        },
        showEditLocationDialog() {
            this.editLocationDialogVisible = true;
        },
        confirmEditLocation() {
            this.$refs.editLocationRef.validate((valid) => {
                if (!valid) return;
                this.editLocationDialogVisible = false;
            });
        },
    },
};
</script>

<style lang="less" scoped>
.el-pagination {
    text-align: left;
}
.el-cascader {
    width: 100%;
}
</style>