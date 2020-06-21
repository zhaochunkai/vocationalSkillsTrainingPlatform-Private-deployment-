<template>
<el-card>
  <el-menu :default-active="EvaluationType" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="HaveEvaluation">未评价</el-menu-item>
    <el-menu-item index="NoEvaluation">已评价</el-menu-item>
  </el-menu>
  <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small" style="margin-top:30px;">
    <el-form-item label="学生姓名">
      <el-input v-model="conditionForm.name"></el-input>	
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
    </el-form-item>
  </el-form>      
  <el-tag>统计： {{total}} 人</el-tag> 
  <!-- 表格 -->
  <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="name" sortable label="学生姓名"></el-table-column>
      <el-table-column prop="tel" label="手机号" ></el-table-column>
  </el-table>		
  <!-- 分页组件 -->
  <div class="t-operate-footer">
    <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
  </div>
</el-card>
</template>
<script>
import {EvaluateOrNoEvaluateStudent} from '@/server/online-module'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
export default {
  data() {
    return {
      EvaluationType: 'NoEvaluation',
      tableData: [],
      conditionForm: {},
      pageSizes,
      pageSize,
      SkipCount:0,
      total:0,
      PlanId: '',
      conditionForm: {},
    };
  },
  components: {pagination},
  activated() {
    this.PlanId=this.$route.query.planId;
    if (this.PlanId) {
      this.initDataList()
    }
  },
  watch: {
    EvaluationType(newVal) {
      if (newVal) { // 根据新值查询列表
        if (this.PlanId) {
          this.initDataList()
        }
      }
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
      this.EvaluationType=key;
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
    // 根据项目id获取评价列表
    initDataList(SkipCount = 0, pageSize = this.pageSize) {
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        EvaluationType: this.EvaluationType,
        PlanId: this.PlanId,         
        name: this.conditionForm.name,         
      }
      EvaluateOrNoEvaluateStudent(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount;
      })
    },
  }
};
</script>
<style lang="less" scoped>
.theme-blue .el-menu--horizontal > .el-menu-item.is-active {
    border-bottom-color: transparent;
}
.el-menu--horizontal>.el-menu-item.is-active {
    border-bottom-color: transparent;
    color: #303133;
    border-radius: 4px;
    background: #4593bf;
    color:#fff;
}
.el-menu--horizontal>.el-menu-item {
    height: 30px;
    line-height: 30px;
}
.el-menu.el-menu--horizontal{
  border-bottom:transparent;
}
/deep/.el-table{
  max-width: 50%;
}
/deep/.t-operate-footer .t-table-pagination {
  text-align: left;
}
</style>