<template>
<div>
  <div class="dateGroup">
    <span style="line-height:30px;">统计时间：</span>
    <el-menu :default-active="EvaluationTimeTypeEnum" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item :index="item.type" v-for="(item,i) of btns" :key="i">{{item.name}}</el-menu-item>
    </el-menu>
  </div>
  <div>
    <!-- 查询 -->
    <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
      <el-form-item label="学员姓名">
        <el-input class="input-append" v-model="conditionForm.StudentName"></el-input>	
      </el-form-item>
      <el-form-item label="学员电话">
        <el-input class="input-append" v-model="conditionForm.StudentPhone"></el-input>	
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form> 
    <div class="m-tables">
      <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="evaluateData"  @selection-change="handleSelectionChange" tooltip-effect="dark" style="width: 100%;">
        <el-table-column type="selection" width="70"></el-table-column>
        <el-table-column >
          <template slot-scope="scope">
            <div style="display:flex;">
              <div class="t-avatar"><img src="https://img.yzcdn.cn/vant/cat.jpeg" /></div>
              <div class="t-content">
                <div class="t-evaluate-stuInfo">            
                  <div style="width:100%;">
                    <p class="t-p">{{scope.row.commentPersonName}}</p>
                    <div class="t-evaluate-grade">
                      <span style="padding-right:2rem;">{{new Date(scope.row.creationTime).toLocaleString()}}</span>
                      <el-rate :value="scope.row.score" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" disabled></el-rate>
                    </div>
                  </div>
                </div>
                <div class="t-evaluate-tag">
                  <el-tag color="#fff" style="color:#000;border:1px solid #999;" v-show="list" v-for="(list,j) of scope.row.IndicatorList" :key="j">{{list}}</el-tag>
                  <div class="t-evaluate-content">
                    {{scope.row.content}}
                  </div>
                </div>
                <div class="t-evaluate-Reply" v-show="scope.row.replyContent">
                  {{scope.row.replyContent}}
                </div>
                <div v-if="scope.row.replyContent">
                  <span>回复时间：{{new Date(scope.row.replyTime).toLocaleString()}}</span>  
                  <span>回复人：{{scope.row.replyPersonName}}</span>  
                </div> 
              </div>
            </div>  
          </template>
        </el-table-column>
        <!-- <el-table-column  fixed="right" label="" width="280" align="center"> -->
        <el-table-column width="280" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="reply(scope.row)">回复</el-button>
            <el-button type="primary" size="small" @click="display(scope.row)">{{!scope.row.flagShow?'显示': '隐藏'}}</el-button>
            <el-button type="primary" size="small" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 全选 -->
      <div class="t-batch-btns">
        <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()" style="margin-right:2rem;">全选</el-checkbox>
        <el-button type="success" size="medium" @click="display">显 示</el-button>
        <el-button type="info" size="medium" @click="del">删 除</el-button>
      </div>
      <!-- 全选 -->
      <div class="t-batch-operate">
        <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
      </div>			
      <!-- 分页组件 -->
      <div class="t-operate-footer">
        <pagination ref="pagination" :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
      </div>
    </div>
    <!-- 回复模块 -->
    <evaluation-reply :dataForm="replyEditForm" :visible.sync="replyVisible" @save="replySave"></evaluation-reply>
  </div>
</div>
</template>
<script>
import { 
  getEvaluationInfoList,
  ReplyEvaluationInfo,deleteEvaluationInfo,EvaluationInfoFlagShow,
} from '@/server/online-module'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import evaluationReply from './evaluation-reply';
export default {
  props: ['planId'],
  data() {
    return {
      pageSizes,
      pageSize,
      SkipCount:0,
      total:0,
      conditionForm: {},
      EvaluationTimeTypeEnum: 'All', // 默认评价时间类型
      btns: [
        {type: 'All',name: '全部'},
        {type: 'Today',name: '今日'},
        {type: 'Yesterday',name: '昨日'},
        {type: 'Week',name: '本周'},
        {type: 'Month',name: '本月'},
        {type: 'CustomDate',name: '其他时间'},
      ],
      isSelectAll:false,
      evaluateData: [],
      replyVisible:false,
      replyEditForm: {},
    };
  },
  components: {pagination,evaluationReply},
  watch: {
    planId(newVal) {
      if (newVal) {
        this.initDataList(); 
      }
    },
  },
  activated() { 
      if (this.planId) {
        this.initDataList(); 
      }
   },
  methods: {
    // 全选
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    selectAll () {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      // 判断是否是全选
      this.isSelectAll = this.evaluateData.length === this.multipleSelection.length;
    },
    /* 接收改变后每页多少条*/
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
    queryList() {      
      this.initDataList(this.SkipCount, this.pageSize);
    },    
    // 根据项目id获取报名列表
    initDataList(SkipCount = 0, pageSize = this.pageSize) {
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        Name: this.conditionForm.Name,
        EvaluationPlanId: this.planId,
        EvaluationTimeTypeEnum: this.EvaluationTimeTypeEnum,
        StudentName: this.conditionForm.StudentName,
        StudentPhone: this.conditionForm.StudentPhone,
      }
      getEvaluationInfoList(data).then(result => {
        result.items.forEach(item => {
          if (item.belongToIndicatorName) {
            this.$set(item,'IndicatorList',item.belongToIndicatorName.split(','))             
          }
        })
        this.evaluateData=result.items;
        this.total = result.totalCount;
      })
    },
    /* ------------------------------------------操作------------------------------- */    
    handleSelect(key, keyPath) {  // 查询列表
      // console.log(key, keyPath);
      this.EvaluationTimeTypeEnum=key;
      this.initDataList();
    },
    del(row) { // 删除
      console.log(row)
      this.$confirm(`此操作将 删除学员【${row.commentPersonName}】的评价 ，请确认？`, '提示', {
          confirmButtonText: '通过',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {   
        deleteEvaluationInfo(row.id).then(() => {
          this.$message.success('删除成功');
          this.$refs.pagination.currentPage=1
          this.initDataList();
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }).catch()
    },
    display(row) { // 显示   
      EvaluationInfoFlagShow(row.id,!row.flagShow).then(() => {
        this.$message.success(`${row.flagShow?'显示': '隐藏'}学员【${row.commentPersonName}】的评论成功`);
        this.queryList()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    reply(row) { // 回复评论
      this.replyVisible=true;
      this.replyEditForm=row;      
    },
    replySave (id,replyContent) { // 回复评论
      let data={id,replyContent}
      ReplyEvaluationInfo(data).then(() => {
        this.$message.success('回复成功');
        this.queryList()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    
  }
};
</script>
<style lang="less" scoped>
.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom-color: transparent;
  color: #303133;
  border-radius: 4px;
  background: #4593bf;
  color:#fff;
}
// 评价列表
.t-avatar{
  margin-right:1rem;
  img{
    width:80px;
    height:80px;
    border-radius:6px;
  }
}
.t-p{
  margin:6px 0;
}
.t-content{
  max-width: 800px;
  width: 100%;
}
.t-evaluate-stuInfo{
  display: flex;
  .t-evaluate-grade{
    display: flex;
    // justify-content: space-between;
  }
}
.t-evaluate-content{
  line-height:1rem;
  margin:0.6rem 0;
}
.t-evaluate-Reply{
  line-height:1.3rem;
  background: #ffebf5;
  border:1px dashed #FF3399;
  color:#FF3399;
  padding:0.6rem;
  border-radius:6px;
}
/deep/.el-tag{
  margin-right:1rem;
}
.t-evaluate-tag{
  margin-top:6px;
}
</style>