
<template>
<el-dialog class="t-dialog" v-if="visible" :visible="visible" :close-on-click-modal="false" width="800px" @close="close">
  <div slot="title">
    <span>设置需要补生成考务信息的学生</span>
  </div>
  <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
    <el-form-item label="姓名">
      <el-input class="input-append" v-model="conditionForm.name" placeholder="可输入学生姓名过滤"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="queryList">查询</el-button>
    </el-form-item>
  </el-form>
  <div class="t-margin-bottom">
    <el-button class="t-margin-right" type="primary" size="small" @click="addStudent">选择学生</el-button>
    <strong style="display:inline-block;" class="t-padding-bottom">已选择的学生： </strong>
    <span v-for="(item,i) of chooseLists" :key="i">
      <el-tag class="t-margin-bottom t-margin-right" closable :disable-transitions="false" @close="handleClose(item)">{{item.name}}</el-tag>
    </span>
  </div>
  <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="50"> </el-table-column>
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="name" sortable label="姓名" show-overflow-tooltip></el-table-column>
    <el-table-column prop="sex" sortable label="性别"></el-table-column>
    <el-table-column prop="idCard" label="身份证号"></el-table-column>
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
    <el-button @click="generateDistribution" type="primary" size="small">生成考务信息</el-button>
  </div>
</el-dialog>
</template>
<script>
import { getClassStudentList } from '@/server/training-module'
import { generateMakeUpExamArrangeInformation } from '@/server/examination-module'
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
      conditionForm: {},
      SkipCount: 0,
      total: 0,
      tableData: [],
      isSelectAll: false,
      multipleSelection: [],
      // 选择的学生
      chooseIds: [], // 已选择的学生id的集合
      chooseLists: [] // 已选择的学生信息的集合
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.chooseLists = []
        this.chooseIds = []
        if (this.dataForm.classId) {
          this.initialData()
        }
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
    // 根据班级id获取，已分班的学生
    initialData (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        id: this.dataForm.classId,
        SkipCount: SkipCount,
        MaxResultCount: pageSize
      }
      if (this.conditionForm.name) {
        data.name = this.conditionForm.name
      }
      getClassStudentList(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
      })
    },
    queryList () {
      this.initialData(this.SkipCount, this.pageSize)
    },
    /* ------------------------------------ 操作按钮 -------------------------- */
    // 删除已选择的学生
    handleClose (item) {
      this.chooseLists.splice(item, 1)
      this.chooseIds.splice(item.id, 1)
    },
    // 添加学生
    addStudent () {
      this.multipleSelection.forEach(item => {
        let index = this.chooseIds.indexOf(item.id)
        if (index === -1) {
          // 如果数组中没有该元素，则新增到tag中显示
          this.chooseLists.push(item)
          this.chooseIds.push(item.id)
        }
      })
    },
    // 生成后分班学生的考务信息
    generateDistribution () {
      if (this.chooseIds.length === 0) {
        this.$message.warning('请选择需要生成考务信息的学生！')
        return
      }
      let data = {
        ExaminationArrangeId: this.dataForm.id, // 考试安排id
        ClassId: this.dataForm.classId, // 班级id
        StudentIds: this.chooseIds // 选择的学生id集合
      }
      generateMakeUpExamArrangeInformation(data).then(res => {
        this.$message.success('学生的考务信息已生成！')
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
