<template>
  <div>
    <el-col :span="8" style="padding-right:1%">
      <el-card :style="style">
        <div slot="header" class="t-box-card-header">
          <span>数据字典列表</span>
        </div>
        <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
          <el-form-item>
            <div style="display:flex;">
              <!-- <span>字典名称</span> -->
              <el-input class="input-append" v-model="conditionForm.name" placeholder="请输入字典名称">
                <el-button slot="append" @click="queryDictionary">查询</el-button>
              </el-input>
              <el-button style="margin-left:1rem;" type="primary" size="small" @click="addEdit()">新增</el-button>
            </div>
          </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table
          class="t-table-list"
          ref="multipleTable"
          stripe
          size="small"
          :data="dictionaryData"
          tooltip-effect="dark"
          style="width: 100%"
          @row-click="clickRow"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column type="index" label="序号" width="48" align="center"></el-table-column>
          <el-table-column prop="name" label="字典名称"></el-table-column>
          <el-table-column prop="code" label="字典代码"></el-table-column>
          <el-table-column fixed="right" label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div class="t-operate-footer">
          <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div>
      </el-card>
      <!-- 新增/修改 【数据字典】 页面 -->
      <add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @save="addEditSave"></add-edit>
    </el-col>
    <el-col :span="16">
      <el-card :style="style">
        <div slot="header" class="t-box-card-header">
          <span>数据字典条目列表</span>
        </div>
        <!-- 操作按钮 -->
        <div>
          <div class="t-operate-buttons">
            <el-button type="primary" size="mini" @click="addEditItem()">新增</el-button>
          </div>
        </div>
        <!-- 表格 -->
        <el-table
          class="t-table-list"
          ref="itemsTable"
          stripe
          size="small"
          :data="listItems"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="name" sortable label="字典项名称"></el-table-column>
          <el-table-column prop="code" label="字典项代码"></el-table-column>
          <el-table-column prop="preserve" label="系统保留字" width="100">
            <template slot-scope="scope">
              <el-checkbox :value="scope.row.preserve"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="describe" label="字典项描述"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="scope">{{scope.row.status=='Enable'?'启用': '停用'}}</template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addEditItem(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="delItem(scope.row)">删除</el-button>
              <el-button
                type="text"
                size="small"
                @click="isEnebleItem(scope.row)"
              >{{scope.row.status!='Enable'?'启用': '停用'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增/修改【数据字典条目】 页面 -->
        <add-edit-item
          :dataForm="addEditFormItem"
          :visible.sync="addEditVisibleItem"
          @save="addEditSaveItem"
        ></add-edit-item>
      </el-card>
    </el-col>
  </div>
</template>
<script>
import { pageSizes, pageSize } from "@/config.js"
import addEdit from "./data-list-add"
import addEditItem from "./data-list-item-add"
import pagination from "@/components/pagination"
import {
  getDictionary,
  createDictionary,
  updateDictionary,
  getDictionaryById,
  createDictionaryById,
  updateDictionaryById,
  deleteDictionaryById,
  updateDictionaryItemStatus
} from "@/server/basic-module";
export default {
  data () {
    return {
      pageSize,
      SkipCount: 0,
      style: '',
      currentPage: 0,
      total: 0,
      isSelectAll: false,
      addEditVisible: false,
      addEditVisibleItem: false,
      addEditForm: {}, // 数据字典列表
      dictionaryData: [],
      addEditFormItem: {}, // 数据字典列表项
      listItems: [],
      conditionForm: {},
      dictionaryId: ''
    }
  },
  activated () {
    this.initDictionaryData()
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`
  },
  components: { addEdit, pagination, addEditItem },
  methods: {
    clickRow (row) {
      this.$refs.multipleTable.clearSelection()
      this.$refs.multipleTable.toggleRowSelection(row)
      this.searchItems(row)
    },
    /* 接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDictionaryData(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDictionaryData(SkipCount, pageSize)
    },
    queryDictionary () {
      this.initDictionaryData(this.SkipCount, this.pageSize)
    },
    // 获取数据字典列表
    initDictionaryData (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        CodeOrName: this.conditionForm.name
      }
      getDictionary(data)
        .then(result => {
          this.dictionaryData = result.items
          this.total = result.totalCount
        })
        .then(() => {
          this.$refs.multipleTable.toggleRowSelection(
            this.dictionaryData[0],
            true
          ) // 默认选中第一行
          this.searchItems(this.dictionaryData[0])
        })
    },
    // 字典项全选
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.itemsTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.itemsTable.clearSelection()
      }
    },
    selectAll () {
      this.$refs.multipleTable.toggleAllSelection()
    },
    selectAllItem () {
      this.$refs.itemsTable.toggleAllSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      // 判断是否是全选
      this.isSelectAll =
        this.dictionaryData.length === this.multipleSelection.length
    },
    addEdit (row) {
      this.addEditForm = row || {}
      this.addEditVisible = true
    },
    addEditSave (data) {
      if (data.id) {
        updateDictionary(data)
          .then(result => {
						this.$message.success('保存成功')
            this.queryDictionary()
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
      } else {
        createDictionary(data)
          .then(result => {
						this.$message.success('保存成功')
						this.queryDictionary()
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
      }
    },
    // ----------------------------------------------数据字典条目--------------------------
    // 查看数据字典项
    searchItems (data) {
      if (data) {
        this.dictionaryId = data.id // 将字典id保存
        // 根据字典代码查询字典项下拉
        getDictionaryById(data.id).then(result => {
          this.listItems = result.dictionaryEntries
        })
      }
    },
    addEditItem (row) {
      this.addEditFormItem = row || {}
      if (row) {
        this.addEditFormItem.childId = row.id
      }
      this.addEditFormItem.id = this.dictionaryId
      this.addEditVisibleItem = true
    },
    addEditSaveItem (data) {
      // 根据 【字典的id】 创建/修改字典项
      if (data.childId) {
        let id = data.id
        let params = {
          name: data.name,
          id: data.childId,
          describe: data.describe
        }
        updateDictionaryById(id, params)
          .then(result => {
            this.searchItems(data)
            this.$message.success('保存成功')
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
      } else {
        createDictionaryById(data)
          .then(() => {
            this.searchItems(data)
            this.$message.success('保存成功')
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
      }
    },
    // 删除数据字典项
    delItem (data) {
      let id = this.dictionaryId
      let entryId = data.id
      this.$confirm(`此操作将会删除【${data.name}】数据，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDictionaryById(id, entryId)
          .then(() => {
            data.id = this.dictionaryId
            this.searchItems(data)
            this.$message.success('删除成功！')
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
      })
    },
    // 启用停用数据字典项目
    isEnebleItem (row) {
      let id = this.dictionaryId
      let entryId = row.id
      this.$confirm(
        `此操作将 ${row.status !== 'Enable' ? '启用' : '停用'} 【${
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
          updateDictionaryItemStatus(id, entryId, row.status)
            .then(() => {
              row.id = this.dictionaryId
              this.searchItems(row)
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
<style lang="less">
.t-box-card {
  margin-top: 10px;
}
</style>
