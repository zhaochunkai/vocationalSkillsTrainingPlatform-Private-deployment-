<template>
  <div>
    <!-- 学期 -->
    <div class="t-operate-buttons">
      <el-button type="primary" size="mini" @click="addEdit()">新增</el-button>
      <!-- <el-button type="primary" size="mini">启用</el-button>
      <el-button type="primary" size="mini">停用</el-button>-->
      <!-- <el-button type="primary" size="mini">设置为默认学期</el-button>         -->
    </div>
    <!-- 表格 -->
    <el-table
      class="t-table-list"
      ref="multipleTable"
      stripe
      size="small"
      :data="semesterData"
      tooltip-effect="dark"
      style="width: 100%;margin-top:10px;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="semesterCode" sortable label="学期代码">
        <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
      </el-table-column>
      <el-table-column prop="semesterName" label="学期名称"></el-table-column>
      <el-table-column prop="semesterBeginTime" label="开始时间">
        <template slot-scope="scope">{{new Date(scope.row.semesterBeginTime).toLocaleDateString()}}</template>
      </el-table-column>
      <el-table-column prop="semesterEndTime" label="结束时间">
        <template slot-scope="scope">{{new Date(scope.row.semesterEndTime).toLocaleDateString()}}</template>
      </el-table-column>
      <el-table-column prop="defaultSemester" label="默认学期" width="80" align="center">
        <template slot-scope="scope">{{scope.row.defaultSemester?'是': '否'}}</template>
      </el-table-column>
      <!-- <el-table-column prop="status" label="状态" width="60">
        <template slot-scope="scope">{{scope.row.status=='Enable'?'启用': '停用'}}</template>
      </el-table-column> -->
      <!-- <el-table-column prop="usageStatus=='Enable'?'启用': '停用'" label="状态" width="120"></el-table-column> -->
      <el-table-column fixed="right" label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
          <!-- <el-button
            type="text"
            size="small"
            @click="isEneble(scope.row)"
          >{{scope.row.status=='Enable'?'停用': '启用'}}</el-button> -->
          <el-button type="primary" size="mini" @click="changedefaultSemester(scope.row)">设为默认学期</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 全选 -->
    <div class="t-batch-operate">
      <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
    </div>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination
        ref="pagination"
        :total="total"
        @sizeChange="handleSize"
        @currentChange="handleCurrent"
      ></pagination>
    </div>
    <!-- 新增/修改页面 -->
    <add-edit
      :visible="table"
      :dataForm="addEditForm"
      @changeVisibility="Visibility"
      @queryList="queryList"
    ></add-edit>
  </div>
</template>
<script>
import {
  getSemesterList,
  deleteSemester,
  updateSemesterStatus,
  updateDefaultSemesterStatus
} from '@/server/basic-module'
import { pageSize } from '@/config.js'
import addEdit from './semester-list-add'
import pagination from '@/components/pagination'
export default {
  props: [
    'AcademicYearId',
    'academicYearName',
    'academicYearBeginTime',
    'academicYearEndTime'
  ],
  data () {
    return {
      pageSize,
      SkipCount: 0,
      total: 0,
      isSelectAll: false,
      addEditVisible: false,
      addEditForm: {},
      semesterData: [],
      form: {},
      table: false
    }
  },
  components: { addEdit, pagination },
  watch: {
    AcademicYearId () {
      // 监听prop中的值，在得到数据后才渲染dom
      this.initDataList()
    }
  },
  methods: {
    // 子组件传回父组件的值控制抽屉隐藏
    Visibility (value) {
      this.table = value
    },
    queryList () {
      this.initDataList(this.SkipCount, this.pageSize)
    },
    /* 接收改变后每页多少条 */
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
    // 学期列表
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        AcademicYearId: this.AcademicYearId
      }
      getSemesterList(data).then(result => {
        this.semesterData = result.items
        this.total = result.totalCount
      })
    },
    /* 改变每页多少条 */
    handleSizeChange (val) {
      this.pageSize = val
    },
    /* 当前页数 */
    handleCurrentChange (val) {
      this.currentPage = val
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
      this.isSelectAll =
        this.semesterData.length === this.multipleSelection.length
    },
    addEdit (row) {
      this.addEditForm = row || {}
      this.addEditForm.academicYearId = this.AcademicYearId
      this.addEditForm.academicYearName = this.academicYearName
      this.addEditForm.academicYearBeginTime = this.academicYearBeginTime
      this.addEditForm.academicYearEndTime = this.academicYearEndTime
      this.addEditVisible = true
      this.table = true
    },
    del (data) {
      let row = data || this.multipleSelection[0]
      this.$confirm(
        `此操作将删除选中的数据 【${row.semesterName}】数据， 是否继续？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          deleteSemester(row)
            .then(() => {
              this.$message.success('数据删除成功！')
              this.$refs.pagination.currentPage = 1
              this.initDataList()
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: err.message,
                type: 'error'
              })
            })
        })
        .catch(() => {})
    },
    // 启用停用
    isEneble (row) {
      this.$confirm(
        `此操作将 ${row.status === 'Enable' ? '停用' : '启用'} 【${
          row.semesterName
        }】数据， 是否继续？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          if (row.status === 'Enable') {
            row.status = false
          } else {
            row.status = true
          }
          updateSemesterStatus(row)
            .then(result => {
              this.$message.success('状态修改成功！')
              this.queryList()
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: err.message,
                type: 'error'
              })
            })
        })
        .catch(() => {})
    },
    changedefaultSemester (row) {
      this.$confirm(
        `此操作将改变 【${row.semesterName}】数据是否是默认学期， 是否继续？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          row.defaultSemester = true
          updateDefaultSemesterStatus(row)
            .then(result => {
              this.$message.success('设置成功！')
              this.queryList()
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: err.message,
                type: 'error'
              })
            })
        })
        .catch(() => {})
    }
  }
}
</script>
