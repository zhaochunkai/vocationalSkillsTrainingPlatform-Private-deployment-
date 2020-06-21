
<template>
<div>
  <!-- 组卷策略 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>组卷策略</span>
    </div>                           
    <!-- 操作按钮 -->
    <div class="t-operate-buttons">
      <el-button type="primary" size="mini" @click="edit()">新增</el-button>
      <!-- <el-button type="primary" size="mini" @click="del()">删除</el-button> -->
    </div>
      <!-- 表格 -->
      <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="strategyName" sortable label="策略名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.strategyName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="courseName" label="考试科目" width="200" align="center"></el-table-column>
        <el-table-column prop="questionCount" label="试题总量" width="100" align="center"></el-table-column>
        <el-table-column prop="totalPoints" label="试题总分" width="100" align="center"></el-table-column>
        <el-table-column prop="createPersonName" label="创建人" width="100" align="center"></el-table-column>
        <el-table-column prop="creationTime" label="创建时间" width="100">
          <template slot-scope="scope">
            {{new Date(scope.row.creationTime).toLocaleDateString()}}
          </template>
        </el-table-column>
        <el-table-column  fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
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
      <!-- 新增/编辑 -->
      <add-edit :TreeData="TreeData" :dataForm="addEditForm" :visible.sync="addEditVisible" @save="saveData"></add-edit>
  </el-card>
</div>
</template>
<script>
import { getAssembleStrategyList,createAssembleStrategy,UpdateQuestionAssembleStrategy,deleteAssembleStrategy } from '@/server/examination-module';
import { getCourseTree } from '@/server/basic-module';
import orgTree from '@/components/orgTree.vue'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import addEdit from './assemble-strategy-edit'
export default {
  components: {orgTree,pagination,addEdit},
  data() {
    return {
      style: '',
      pageSizes,
		  SkipCount:0,
      pageSize,
      total:0,
      tableData: [],
      isSelectAll:false,
      multipleSelection: [],
      addEditVisible:false,
      addEditForm: {},
      TreeData: [], // 课程树
    }
  },
  activated() {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this.initialData();
    this._getCourseTree(); // 获取对应课程的知识点树   
  },
  methods: {
    /* 接收改变后每页多少条*/
    handleSize (SkipCount, pageSize) {
			this.SkipCount = SkipCount
			this.pageSize = pageSize
      this.initialData(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
			this.SkipCount = SkipCount
			this.pageSize = pageSize
      this.initialData(SkipCount, pageSize);
    },
    queryList() {  
      this.initialData(this.SkipCount, this.pageSize);
    },
    // 获取试题策略列表
    initialData(SkipCount = 0, pageSize = this.pageSize) {
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
      }
      getAssembleStrategyList(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount;
      })
    },
    _getCourseTree() {  // 获取课程树
      this.TreeData= []
      getCourseTree().then(result => {
        this.TreeData=result;
      })
    },
    /* ------------------------------------ 操作按钮 -------------------------- */
    toInfomationPage(row) {      
      this.$router.push({path: '/assemble/strategy/infomation',query: {id:row.id}})
    },
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
      this.isSelectAll = this.tableData.length === this.multipleSelection.length
    },
    edit(row) {
      let data=row || {};
      this.addEditForm=row;
      this.addEditVisible=true;
    },
    saveData(data) {
      if (data.id) {
        UpdateQuestionAssembleStrategy(data).then(() => {
          this.$message.success('保存成功！');
          this.queryList()
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      } else {
        createAssembleStrategy(data).then(() => {
          this.$message.success('保存成功！');
          this.queryList()
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }
    },
    del(row) {
      this.$confirm(`此操作将删除选中的策略 【${row.strategyName}】， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString:true,
        type: 'warning'
      }).then(() => { 
        deleteAssembleStrategy(row.id).then(() => {
          this.$message.success('试题策略删除成功！');
          this.initialData();
          this.$refs.pagination.currentPage=1
        })  
      })
    },
  }
}
</script>