<template>
  <div>
    <!-- 毕业要求证书类型列表 -->
    <el-card :style="style">
      <div slot="header" class="t-box-card-header">
        <span>毕业要求证书类型列表</span>
      </div>
      <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
        <el-form-item label="证书类型名称">
          <el-input class="input-append" v-model="conditionForm.name" placeholder="请输入证书类型名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <div class="t-operate-buttons">
        <el-button type="primary" size="mini" @click="addEdit()">新增</el-button>
        <!-- <el-button type="primary" size="mini" @click="del()">删除</el-button> -->
      </div>
      <!-- 表格 -->
      <el-table
        class="t-table-list"
        ref="multipleTable"
        stripe
        size="small"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;margin-top:10px;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="certificateName" sortable label="类型名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 全选 -->
      <div class="t-batch-operate">
        <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll ()">全选</el-checkbox>
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
    </el-card>
    <!-- 新增/修改页面 -->
    <add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @queryList="queryList"></add-edit>
  </div>
</template>
<script>
import {
  getGraduationRequiredCertificateTypeLists,
  deleteRequiredCertificateType
} from '@/server/graduation-module'
import pagination from '@/components/pagination'
import { pageSize } from '@/config.js'
import addEdit from './graduation-certificate-type-add'
export default {
  data () {
    return {
      pageSize,
      SkipCount: 0,
      style: '',
      total: 0,
      isSelectAll: false,
      addEditVisible: false,
      addEditForm: {},
      conditionForm: {},
      tableData: [],
      form: {},
      rules: {}
    }
  },
  components: { addEdit, pagination },
  created () {
    this.initDataList()
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
  },
  methods: {
    /* ------------------------------------ 查询数据 -------------------------- */
    /* *接收改变后每页多少条 */
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
    queryList () {
      this.initDataList(this.SkipCount, this.pageSize);
    },
    // 获取证书类型列表
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        name: this.conditionForm.name
      }
      getGraduationRequiredCertificateTypeLists(data).then(result => {
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
    /* ------------------------------------ 操作按钮 -------------------------- */
    // 删除数据
    del (row) {
      // let row = data || this.multipleSelection[0]
      this.$confirm(`此操作将 删除  【${row.certificateName}】， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRequiredCertificateType(row.id)
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
    // 新增|编辑数据
    addEdit (row) {
      this.addEditForm = row || {}
      this.addEditVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
</style>
