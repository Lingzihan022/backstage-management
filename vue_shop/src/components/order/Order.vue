<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
          >
            <template #append>
              <el-button
                icon="el-icon-search"
                @click="getOrdersList"
              ></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <!-- table区域 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="378px">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="90px">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="90px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="90px">
          <template slot-scope="scope">
            {{ scope.row.is_send }}
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="280px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showBox"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProcessBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        ref="addressFormRef"
        :model="addressForm"
        :rules="addressRules"
        label-width="80px"
      >
        <el-form-item label="省市区/县" prop="address1" class="el-item">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="processVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        ref="addressFormRef"
        :model="addressForm"
        :rules="addressRules"
        label-width="80px"
      >
        <span>123</span>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        //   查询参数
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      //   订单列表
      ordersList: [],
      //   总订单数,
      total: 0,
      addressVisible: false,
      addressForm: {
        //   级联表达器,因此定义为数组
        address1: [],
        address2: '',
      },
      addressRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: blur },
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: blur },
        ],
      },
      cityData,
      processVisible: false,
      processInfo: [],
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取订单数据失败!')
      }
      console.log(res.data)
      this.ordersList = res.data.goods
      this.total = res.data.total
      //   console.log(this.ordersList)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProcessBox() {
      // const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      // if (res.meta.status !== 200) {
      //   return this.$messgae.error('获取物流信息失败')
      // }
      // this.processInfo = res.data
      this.processVisible = true
      // console.log(res.data)
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.el-item {
  white-space: nowrap;
}
</style>
