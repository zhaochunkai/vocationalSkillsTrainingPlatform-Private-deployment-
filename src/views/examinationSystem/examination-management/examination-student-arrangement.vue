
<template>
<el-dialog class="t-dialog" v-if="visible" title="考务信息" :visible="visible" :close-on-click-modal="false" width="80%" @close="close" >           
  <!-- 表格 -->
  <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="50"> </el-table-column>
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="studentName" sortable label="姓名" width="100" show-overflow-tooltip></el-table-column>
    <el-table-column prop="candidateNo" label="准考证号" width="160"></el-table-column>
    <el-table-column prop="examPassWord" label="考试密码" width="130"></el-table-column>
    <el-table-column prop="className" sortable label="班级" width="200" show-overflow-tooltip></el-table-column>
    <el-table-column prop="courseName" label="课程" width="150"></el-table-column>
    <el-table-column prop="siteName" label="考场" width="110"></el-table-column>
    <el-table-column label="考试时间">
      <template slot-scope="scope">
        {{new Date(scope.row.examStartTime).toLocaleString()}} ~ {{new Date(scope.row.examEndTime).toLocaleString()}}
      </template>
    </el-table-column>
    <el-table-column prop="examinationRoomNo" label="座位号" width="60"></el-table-column>
    <el-table-column prop="flagNotification" label="已发送考试通知" width="120" fixed="right">
      <template slot-scope="scope">
        {{scope.row.flagNotification?'已发送': '未发送'}}
      </template>
    </el-table-column>
    <!-- <el-table-column  fixed="right" label="操作" width="160" align="center">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
        <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
      </template>
    </el-table-column> -->
  </el-table>
  <!-- 全选 -->
  <div class="t-batch-operate">
    <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
  </div>			
  <!-- 分页组件 -->
  <div class="t-operate-footer">
    <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="close" size="small">关 闭</el-button>
  </div>
</el-dialog>  
</template>
<script>
import { getExaminationArrangeInformation } from '@/server/examination-module'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
export default {
  components: {pagination},
  props: ['visible', 'dataForm'],
  data () {
    return {
      // -------------表格------------
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      tableData: [],
      isSelectAll: false,
      multipleSelection: []
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.initialData() // 获取考务信息
      }
    }
  },
  methods: {
    /* 接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initialData(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initialData(SkipCount, pageSize)
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
    initialData (SkipCount = 0, pageSize = this.pageSize) {  // 获取考试安排列表
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize
      }
      if (this.dataForm.FlagSupplementaryExam) {
        this.$set(data, 'ExamSupplementaryArrangeId', this.dataForm.ExaminationArrangeId)
      } else {
        this.$set(data, 'ExaminationArrangeId', this.dataForm.ExaminationArrangeId)
      }
      getExaminationArrangeInformation(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
      })
    },
    queryList () {
      this.initialData(this.SkipCount, this.pageSize)
    },  
    /* ------------------------------------ 操作按钮 -------------------------- */
    toInfomationPage (row) {

    },
    close () {
      this.$emit('update:visible', false)
    }    
  }
}
</script>