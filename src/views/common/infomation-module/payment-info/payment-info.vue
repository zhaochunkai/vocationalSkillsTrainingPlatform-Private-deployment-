<template>
<div>
  <div class="t-header-title">
    <span>统计信息</span>
  </div>
  <!-- 表格 -->
  <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="name" sortable label="学习项目"></el-table-column>
    <el-table-column prop="amountToBePaid" label="应缴（元）"></el-table-column>
    <el-table-column prop="actualAmountOfPayment" label="实缴（元）"></el-table-column>
    <el-table-column prop="arrearage" label="欠缴（元）"></el-table-column>
    <el-table-column prop="paymentDate" label="缴费时间">
      <template slot-scope="scope">
        {{new Date(scope.row.paymentDate).toLocaleDateString()}}
      </template>
    </el-table-column>
    <el-table-column prop="studentPayType" label="状态"></el-table-column>
  </el-table>
  <div class="t-header-title">
    <span>缴费记录</span>
  </div>
  <!-- 表格 -->
  <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="recordData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="name" sortable label="姓名"></el-table-column>
    <el-table-column prop="sex" label="性别"></el-table-column>
    <el-table-column prop="idCard" label="身份证号" width="180"></el-table-column>
    <el-table-column prop="amountToBePaid" label="应缴（元）"></el-table-column>
    <el-table-column prop="actualAmountOfPayment" label="实缴（元）"></el-table-column>
    <el-table-column prop="arrearage" label="欠缴（元）" class-name="special"></el-table-column>
    <el-table-column prop="paymentDate" label="缴费时间">
      <template slot-scope="scope">
        {{new Date(scope.row.paymentDate).toLocaleDateString()}}
      </template>
    </el-table-column>
    <el-table-column prop="payType" label="缴费方式"></el-table-column>
    <el-table-column prop="source" label="来源"></el-table-column>
    <el-table-column prop="studentPayType" label="缴费状态"></el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <div class="t-operate-footer">
    <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
  </div>
</div>
</template>
<script>
import {getStudentBasicInfoById,getPayItemList,getPayInfo} from '@/server/training-module'; 
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
export default {
  props: ['basicForm', 'dataForm'],
  data() {
    return {
      pageSizes,
      pageSize,
      total:0,
      id: '',
      studentId: '',
      programId: '',
      tableData: [],
      recordData: [],
    }
  },
  components: {pagination},
  methods: {
    _getPayInfo() {
      let data={
        StudentId: this.dataForm.studentId, // 学生id
        TrainingProgramsId: this.dataForm.programId // 项目id
      }
      this.tableData= []
      getPayInfo(data).then(result => {
        this.tableData.push(result)
      })
    }, 
    // 根据项目id和学生id获取缴费记录
    recordList(SkipCount = 0, pageSize = this.pageSize) {
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        TrainingProgramsId: this.dataForm.programId,
        StudentId: this.dataForm.studentId 
      }
      getPayItemList(data).then(result => {
        this.recordData=result.items;
        this.total = result.totalCount
      })
    },    
    /* 接收改变后每页多少条*/
    handleSize (SkipCount, pageSize) {
      this.recordList(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.recordList(SkipCount, pageSize);
    },
  }
}
</script>
<style lang="less" scoped>
.t-box-card-header{
  line-height:40px;
  border-bottom:1px solid #ddd;
  margin-bottom:20px;
  span{
    padding:11px 100px 12px;
    border:1px solid #ddd;
    background: #ddd;
    border-bottom:none;
    font-weight: 600;
  }
}
/deep/.el-form .el-form-item{
  max-width:80%;
}
/deep/.el-input__inner,
/deep/.el-textarea__inner{
  border:none;
  background: #eee;
}
/deep/ .special .cell{
  background: rgb(158, 235, 108);
}
</style>