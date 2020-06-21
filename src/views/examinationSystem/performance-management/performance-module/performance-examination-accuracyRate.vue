<template>
  <el-drawer :title="`【${dataForm.courseName}】考试${dataForm.type && dataForm.type === 'search'?'成绩':'正确率'}`" v-if="visible" :visible="visible" :modal="false" :append-to-body="true" size="85%" @close="close">
    <el-form class="t-form-block" ref="conditionForm" size="small" inline>
      <!-- <el-form-item label="准考证号">
        <el-input v-model="conditionForm.candidateNo"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="type">
        <el-input v-model="conditionForm.name"></el-input>
      </el-form-item> -->
      <el-form-item label="正确率范围" prop="minExamCorrectRate">
        <el-input v-model.number="conditionForm.minExamCorrectRate" min=0 placeholder="输入数值" clearable>
          <el-button slot="append">分</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="-" prop="maxExamCorrectRate">
        <el-input v-model.number="conditionForm.maxExamCorrectRate" min=0 max=100 placeholder="输入数值" clearable>
          <el-button slot="append">分</el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="candidateNo" sortable label="准考证号" align="center" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="name" label="姓名" width="160" align="center"></el-table-column>
      <el-table-column prop="tel" label="手机号" width="140" align="center"></el-table-column>
      <el-table-column prop="examinationPaperName" label="试卷名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="score" label="试卷成绩" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.examStudentInfoScore.examinationPaperScore}}
        </template>
      </el-table-column>
      <el-table-column prop="score" label="补考成绩" width="100" align="center" v-if="dataForm.type && dataForm.type === 'search' && dataForm.examinationType !== 'Simulation'">
        <template slot-scope="scope">
          {{scope.row.examStudentInfoScore.resitExaminationPaperScore}}
        </template>
      </el-table-column>
      <el-table-column prop="score" label="试卷提交时间" width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.submitExamPaperTime?new Date(scope.row.submitExamPaperTime).toLocaleString(): ''}}
        </template>
      </el-table-column>
      <el-table-column prop="examCorrectRate" :label="dataForm.type && dataForm.type === 'search'?'正式考正确率':'正确率'" width="100" align="center">
        <template slot-scope="scope">
          {{parseInt(scope.row.examCorrectRate)}}%
        </template>
      </el-table-column>
      <el-table-column prop="examPaperStatusName" label="参考状态" width="100" align="center"></el-table-column>
      <el-table-column prop="" label="操作" width="120" align="center" v-if="dataForm.type === 'search'">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="可在打印页面【更多设置】中设置纸张尺寸" placement="top" v-if="scope.row.examPaperStatus !== 'Absent'">
            <el-button
              type="primary"
              size="small"
              v-print="print"
              @click="printExamPaper(scope.row)"
            >打印试卷</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
    <!-- 答卷 -->
    <paper-result :dataForm="paperForm" :visible.sync="paperVisible"></paper-result>
  </el-drawer>
</template>
<script>
import { getStudentPerformanceWithRecord } from '@/server/examination-module'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import paperResult from '../examination-paper-result'
export default {
  props: ['dataForm', 'visible'],
  components: {pagination, paperResult},
  data () {
    return {
      // ----------搜索
      conditionForm: {},
      // ----------表格
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      tableData: [],
      isSelectAll: false,
      multipleSelection: [],
      symbolList: [
        {name: '=', type: 'Equal'},
        {name: '>=', type: 'Greater'},
        {name: '<=', type: 'Less'}
      ],
      print: {
        id: '#printCompletion',
        popTitle: `考试试卷`,
        extraCss: '',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      },
      // 答卷
      paperForm: {},
      paperVisible: false
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.initialData()
      }
    }
  },
  methods: {
    /* -----------------------------------------------------------查询----------------------------------- */
    queryList () {
      this.initialData(this.SkipCount, this.pageSize)
    },
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
    // 获取学生列表
    initialData (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        classId: this.dataForm.classId,
        courseId: this.dataForm.courseId,
        examinationArrangeId: this.dataForm.examinationArrangeId
      }
      if (!this.conditionForm.minExamCorrectRate) {
        this.$set(data, 'minExamCorrectRate', 0)
      } else {
        this.$set(data, 'minExamCorrectRate', this.conditionForm.minExamCorrectRate)
      }
      if (!this.conditionForm.maxExamCorrectRate) {
        this.$set(data, 'maxExamCorrectRate', 100)
      } else {
        this.$set(data, 'maxExamCorrectRate', this.conditionForm.maxExamCorrectRate)
      }
      getStudentPerformanceWithRecord(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
      })
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
    /* -----------------------------------------------------------操作----------------------------------- */
    // 打印试卷
    printExamPaper (row) {
      this.paperForm = row
      this.paperVisible = true
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
