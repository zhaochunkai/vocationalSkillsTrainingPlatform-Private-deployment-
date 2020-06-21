<template>
  <div>
    <!-- 教室信息 -->
    <el-card :style="style">
      <div slot="header" class="t-box-card-header">
        <span>教室管理</span>
      </div>
      <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
        <el-form-item label="教室名称">
          <el-input class="input-append" v-model="conditionForm.name" placeholder="请输入教室名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="conditionForm.UsageStatus">
            <el-option label="全部" value="All"></el-option>
            <el-option label="启用" value="Enable"></el-option>
            <el-option label="停用" value="Disable"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <div class="t-operate-buttons">
        <el-button type="primary" size="mini" @click="addEdit()">新增</el-button>
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
        <el-table-column prop="name" sortable label="教室名称"></el-table-column>
        <el-table-column prop="buildingName" label="所属楼栋"></el-table-column>
        <el-table-column prop="storey" label="所在楼层">
          <template slot-scope="scope">{{scope.row.storey}}层</template>
        </el-table-column>
        <el-table-column prop="purpose" label="教室用途"></el-table-column>
        <!-- <el-table-column prop="classroomType" label="教室类型"></el-table-column> -->
        <el-table-column prop="area" sortable label="面积（平方米）"></el-table-column>
        <el-table-column prop="capacity" sortable label="容量（人数）"></el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">{{scope.row.status=="Enable"?'启用': '停用'}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
            <el-button
              type="text"
              size="small"
              @click="isEneble(scope.row)"
            >{{scope.row.status !== "Enable"?'启用': '停用'}}</el-button>
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
    </el-card>
    <!-- 新增/修改页面 -->
    <add-edit
      :dataForm="addEditForm"
      :visible.sync="addEditVisible"
      @queryList="queryList"
      :buildingList="buildingList"
    ></add-edit>
  </div>
</template>
<script>
import {
  getSiteList,
  deleteSite,
  updateSiteStatus,
  getBuildingList
} from '@/server/basic-module'
import pagination from '@/components/pagination'
import { pageSize } from '@/config.js'
import addEdit from './site-list-add'
export default {
  name: 'siteList',
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
      // tab切换
      activeName: 'first',
      form: {},
      buildingList: []
    }
  },
  components: { addEdit, pagination },
  activated () {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow: scroll;`
    this.initDataList()
    this._getBuildingList()
  },
  methods: {
    // 获取楼栋列表
    _getBuildingList () {
      getBuildingList().then(result => {
        this.buildingList = result.items
      })
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
    queryList () {
      this.initDataList(this.SkipCount, this.pageSize)
    },
    // 获取教室列表
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        ClassroomName: this.conditionForm.name,
        UsageStatus: this.conditionForm.UsageStatus
      }
      getSiteList(data).then(result => {
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
      this.isSelectAll =
        this.tableData.length === this.multipleSelection.length
    },
    del (data) {
      let row = data || this.multipleSelection[0]
      this.$confirm(
        `此操作将删除选中的数据 【${row.name}】数据， 是否继续？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          deleteSite(row).then(() => {
            this.$message.success('数据删除成功！')
            this.initDataList()
            this.$refs.pagination.currentPage = 1
          })
        })
        .catch(() => {})
    },
    addEdit (row) {
      this.addEditForm = row || {}
      this.addEditVisible = true
    },
    // 启用停用
    isEneble (row) {
      this.$confirm(
        `此操作将 ${row.status === 'Enable' ? '停用' : '启用'} 【${
          row.name
        }】数据， 是否继续？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          row.status = row.status !== 'Enable'
          updateSiteStatus(row)
            .then(() => {
              this.queryList()
              this.$message.success('状态修改成功！')
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
<style lang="less" scoped>
</style>
