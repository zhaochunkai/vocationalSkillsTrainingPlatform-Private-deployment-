<template>
<div>
  <!-- 评价列表 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>评价管理</span>
    </div>
    <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
        <el-form-item label="评价名称">
          <el-input class="input-append" v-model="conditionForm.EvaluationName"></el-input>	
        </el-form-item>
        <el-form-item label="评价状态">
          <el-select v-model="conditionForm.evaluationPlanUsageStatus">
            <el-option label="全部" value="All"></el-option>
            <el-option label="启用" value="Enable"></el-option>
            <el-option label="停用" value="Disable"></el-option>
            <el-option label="未启用" value="NoEnable"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
        </el-form-item>
    </el-form>                               
    <!-- 操作按钮 -->
    <div class="t-operate-buttons">
      <el-button type="primary" size="mini" @click="addEvaluate()">新增</el-button>
      <!-- <el-button type="primary" size="mini" @click="delEvaluate()">删除</el-button>
      <el-button type="primary" size="mini" @click="updStatus()">启用</el-button>
      <el-button type="primary" size="mini" @click="updStatus()">停用</el-button> -->
    </div>
    <!-- 表格 -->
    <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="evaluationName" sortable label="评价名称">
        <template slot-scope="scope">
          <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.evaluationName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="evaluationTypeName" label="评价类型"  width="100"></el-table-column>
      <el-table-column prop="evaluationPeriodName" label="评价周期" width="100"></el-table-column>
      <el-table-column label="学期" >
        <template slot-scope="scope">
          {{scope.row.semesterId==0?'':scope.row.semesterId}}
          <span v-show="scope.row.semesterId==0">
            {{new Date(scope.row.startDate).toLocaleDateString()}} 
              - 
            {{new Date(scope.row.endDate).toLocaleDateString()}}
          </span>          
        </template>
      </el-table-column>
      <el-table-column prop="evaluationPlanUsageStatusName" label="状态" width="70"></el-table-column>
      <el-table-column  fixed="right" label="" width="300" align="right">
        <template slot-scope="scope" slot="header">
          <div style="text-align:center;">操作</div>
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="small" v-show="scope.row.evaluationPlanUsageStatus=='NoEnable'" @click="addEvaluate(scope.row)">修改</el-button>
          <el-button type="text" size="small" v-show="scope.row.evaluationPlanUsageStatus=='NoEnable'" @click="delEvaluate(scope.row)">删除</el-button>
          <el-button type="text" size="small" @click="updStatus(scope.row)">{{scope.row.evaluationPlanUsageStatus=='NoEnable'?'启用':(scope.row.evaluationPlanUsageStatus=='Enable'?'停用':'启用')}}</el-button>
          <el-button type="danger" size="mini" @click="tostatistics(scope.row)">查看评价统计</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 全选 -->
    <div class="t-batch-operate">
      <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
    </div>			
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination ref="pagination" :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
  </el-card>
  <!-- 新增/编辑 -->
  <add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @updateList="queryList"></add-edit>
</div>
</template>
<script>
import { 
  getEvaluationPlan,
  createEvaluationPlan,updateEvaluationPlan,deleteEvaluationPlan,updateEvaluationPlanEnable
} from '@/server/online-module';
import { pageSizes, pageSize } from "@/config.js";
import pagination from "@/components/pagination";
import addEdit from "./evaluating-list-add" 
export default {
  data(){return {
    style:'',
    pageSizes,
    pageSize,
    SkipCount:0,
    total:0,
    resourceTree:[],
    conditionForm:{
      evaluationPlanUsageStatus:'All'
    },
    tableData:[],
    isSelectAll:false,
    addEditVisible:false,
    addEditForm: {},
    nodeId:'',
    nodeName:'',
    nodeSelect:{}
  }},
  components:{pagination,addEdit},
  activated(){
		this.style = `height:${document.body.clientHeight-200}px;overflow:scroll;`
    this.initDataList();
  },
  methods:{ 
    toInfomationPage(data){ // 跳转至评价详细数据页面
      this.$router.push({path:'/evaluating/infoData',query:{id:data.id}})
    },
    tostatistics(data){  // 跳转至评价统计页面
      this.$router.push({path:'/evaluating/statistics',query:{planId:data.id}})
    },
    /**接收改变后每页多少条*/
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    queryList(){
      this.initDataList(this.SkipCount, this.pageSize);
    },
    // 根据项目id获取评价列表
    initDataList(SkipCount = 0, pageSize = this.pageSize){
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        EvaluationName:this.conditionForm.EvaluationName,
        EvaluationPlanUsageStatusEnum:this.conditionForm.evaluationPlanUsageStatus,
      }
      getEvaluationPlan(data).then(result=>{
        this.tableData = result.items
        this.total = result.totalCount;
      })
    },
    // 全选
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
        });
      } else {
          this.$refs.multipleTable.clearSelection()
      }
    },
    selectAll(){
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange(val){
      this.multipleSelection = val
        // 判断是否是全选
      this.isSelectAll = this.tableData.length === this.multipleSelection.length
    },
    pay(row){
      this.addEditVisible=true;
      this.addEditForm=row;
    },
    addEvaluate(row){
      this.addEditVisible=true;
      this.addEditForm=row||{};
    },
    delEvaluate(row){ // 删除
      let data=row || this.multipleSelection[0];
      this.$confirm(`此操作将 删除评价 【${data.evaluationName}】，请确认？`, '提示', {
          confirmButtonText: '通过',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {   
        deleteEvaluationPlan(data).then(()=>{
          this.$message.success('删除成功!');
          this.$refs.pagination.currentPage=1
          this.initDataList();
        }).catch(err=>{ 
          this.$message({
            showClose: true,
            message:err.message,
            type: 'error'
          });
        })           
      }).catch(() => {});
    },
    updStatus(data){ // 停用/启用
      this.$confirm(`此操作将 ${data.evaluationPlanUsageStatus=='NoEnable'?'启用':(data.evaluationPlanUsageStatus=='Enable'?'停用':'启用')} 评价 【${data.evaluationName}】，请确认？`, '提示', {
          confirmButtonText: '通过',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        if(data.evaluationPlanUsageStatus=='NoEnable' || data.evaluationPlanUsageStatus=='Disable'){
          data.enable=true;
        }else if(data.evaluationPlanUsageStatus=='Enable'){
          data.enable=false;
        }
        updateEvaluationPlanEnable(data).then(()=>{
          this.$message.success('修改状态成功!');
          this.queryList()
        }).catch(err=>{ 
          this.$message({
            showClose: true,
            message:err.message,
            type: 'error'
          });
        })             
      }).catch(() => {});
    }
  },
}
</script>
<style lang="less" scoped>
.specialCol{
  background:#a5f373;
  /deep/.el-button{
    span{
      color:#00f;
    }
  }
}
</style>