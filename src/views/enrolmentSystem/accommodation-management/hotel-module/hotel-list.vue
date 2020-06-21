<template>
<div>
  <!-- 酒店管理 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>酒店管理</span>
    </div>
    <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
      <el-form-item label="酒店名称">
        <el-input class="input-append" v-model="conditionForm.name" placeholder="请输入酒店名称"></el-input>
      </el-form-item>
      <el-form-item label="所属地区">
        <el-select v-model="conditionForm.province" clearable>
          <el-option
            v-for="(item,i) of provinceList"
            :key="i"
            :label="item.name"
            :value="item.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="conditionForm.Status" clearable>
          <el-option
            v-for="(item,i) of stautsList"
            :key="i"
            :label="item.name"
            :value="item.type"
          ></el-option>
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
    <el-table
      class="t-table-list"
      ref="multipleTable"
      border
      stripe
      size="small"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;margin-top:10px;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="projectName" sortable label="项目名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" label="操作" width="360" align="center">
        <template slot-scope="scope">
          
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
  <!-- 新增|编辑 -->
  <add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @updateList="queryList"></add-edit>
</div>
</template>
<script>
import { pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import addEdit from './hotel-list-edit'
export default {
  components: {pagination, addEdit},
  data () {
    return {
      style: '',
      // 查询
      conditionForm: {},
      stautsList: [
        {type: 'All', name: '全部'},
        {type: 'Enable', name: '启用'},
        {type: 'Disable', name: '停用'}
      ],
      provinceList: [
        {type: 'All', name: '浙江'},
        {type: 'Enable', name: '四川'},
        {type: 'Disable', name: '上海'}
      ],
      // 表格
      pageSize,
      total: 0,
      SkipCount: 0,
      tableData: [],
      isSelectAll: false,
      multipleSelection: [],
      // 新增|编辑
      addEditForm: {},
      addEditVisible: false
    }
  },
  activated () {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`
  },
  methods: {
    /* --------------------------- 查询 --------------------------- */
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
    // 获取学习项目列表
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      // let data = {
      //   SkipCount: SkipCount,
      //   MaxResultCount: pageSize
      // }
      // getTrainingProgramsList(data).then(result => {
      //   this.tableData = result.items
      //   this.total = result.totalCount
      // })
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
    /* --------------------------- 操作 --------------------------- */
    addEdit (row) {
      // 新增|编辑
      this.addEditForm = row || {}
      this.addEditVisible = true
    },

  }
}
</script>
