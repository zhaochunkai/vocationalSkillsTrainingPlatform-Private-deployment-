<template>
<div>
  <!-- 人员列表 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>缴费记录</span>
    </div>
    <div>
      <span class="t-margin-right">学生：{{infomataion.name}}</span>
      <span>性别：{{infomataion.sex}}</span>
    </div>
    <!-- 表格 -->
    <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" :span-method="SpanMethod">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="name" sortable label="姓名" width="100"></el-table-column>
        <el-table-column prop="sex" label="性别" width="60"></el-table-column>
        <el-table-column prop="idCard" label="身份证号" width="180"></el-table-column>
        <el-table-column prop="amountToBePaid" label="应缴（元）"></el-table-column>
        <el-table-column prop="actualAmountOfPayment" label="实缴（元）"></el-table-column>
        <el-table-column class-name="special" prop="arrearage" label="欠缴（元）"></el-table-column>
        <el-table-column prop="paymentDate" label="缴费时间">
          <template slot-scope="scope">
            {{new Date(scope.row.paymentDate).toLocaleDateString()}}
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="缴费方式"></el-table-column>
        <el-table-column prop="source" label="来源">
          <!-- <template slot-scope="scope">
            {{scope.row.source=='Online'?'线上（移动端）': '线下'}}
          </template> -->
          <!-- All, Online, Offline -->
        </el-table-column>
        <el-table-column prop="studentPayType" label="付费状态"></el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
        <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
  </el-card>
</div>
</template>
<script>
import { getPayItemList } from '@/server/training-module'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
export default {
  data () {
    return {
      pageSizes,
      pageSize,
      style: '',
      total: 0,
      tableData: [],
      infomataion: {},
      studentId: '',
      TrainingProgramsId: ''
    }
  },
  components: {pagination},
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    // this.infomataion=Object.assign({},this.$route.query);
    this.studentId = this.$route.query.studentId
    this.TrainingProgramsId = this.$route.query.TrainingProgramsId
    if (this.studentId) {
      this.initDataList()
    }
  },
  methods: {
    /* 接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.initDataList(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.initDataList(SkipCount, pageSize)
    },
    // 根据项目id和学生id获取缴费记录
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        TrainingProgramsId: this.TrainingProgramsId,
        StudentId: this.studentId
      }
      getPayItemList(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
        this.infomataion = this.tableData[0]
      })
    },
    pay (row) {
      this.addEditVisible = true
      this.addEditForm = row
    },
    // 合并行
    SpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
        if (rowIndex % 10 === 0) {
          return {
            rowspan: 10,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.special{
  color:#f00;
  /deep/.cell{
    background: #0f0;
  }
}
</style>
