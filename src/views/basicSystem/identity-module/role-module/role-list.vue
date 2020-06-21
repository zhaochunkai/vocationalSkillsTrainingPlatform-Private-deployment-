<template>
  <div>
    <!-- 角色列表 -->
    <el-card :style="style">
      <div slot="header" class="t-box-card-header">
        <span>角色列表</span>
      </div>
      <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
        <el-form-item label="角色名称">
          <el-input class="input-append" v-model="conditionForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <div class="t-operate-buttons">
        <!-- <el-button type="primary" size="mini">导入</el-button> -->
        <el-button type="primary" size="mini" @click="addEdit()">新增</el-button>
        <!-- <el-button type="primary" size="mini" @click="del()">删除</el-button>
        <el-button type="primary" size="mini">启用</el-button>
        <el-button type="primary" size="mini">停用</el-button>-->
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
        <el-table-column prop="name" sortable label="角色名称"></el-table-column>
        <el-table-column prop="enable" label="默认角色" width="120" align="center">
          <template slot-scope="scope">
            <el-checkbox :value="scope.row.isDafult" disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="enable" label="系统预置角色" width="120" align="center">
          <template slot-scope="scope">
            <el-checkbox :value="scope.row.isStatic" disabled></el-checkbox>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="enable" label="状态" width="120">
          <template slot-scope="scope">
            <el-checkbox :value="scope.row.enable"></el-checkbox>
          </template>
        </el-table-column>-->
        <el-table-column fixed="right" label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="addEdit(scope.row)">编辑</el-button>
            <!-- <el-button type="text" size="small" @click="isEneble(scope.row)">{{scope.row.enable?'停用': '启用'}}</el-button> -->
            <el-button type="text" size="mini" @click="del(scope.row)">删除</el-button>
            <el-button type="primary" size="mini" @click="addEdit(scope.row, 'addUser')">批量添加用户</el-button>
            <el-button type="primary" size="mini" @click="setPermission(scope.row)">权限设置</el-button>
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
      :visible="addEditVisible"
      :dataForm="addEditForm"
      @changeVisibility="Visibility"
      @save="addEditSave"
      @queryList="queryList"
    ></add-edit>
  </div>
</template>
<script>
import {
  getIdentityRoles,
  createIdentityRoles,
  updateIdentityRoles,
  deleteIdentityRoles
} from '@/server/identity-module'
import pagination from '@/components/pagination'
import { pageSize } from '@/config.js'
import addEdit from './role-list-add'
export default {
  name: 'roleList',
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
      InfoVisible: false
    }
  },
  components: { addEdit, pagination },
  created () {
    this.initDataList()
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`
  },
  methods: {
    // 子组件传回父组件的值控制抽屉隐藏
    Visibility (value) {
      this.addEditVisible = value
    },
    showInfo () {
      // 点击角色名称弹出三个tab：基本信息、角色权限、角色人员
      this.InfoVisible = true
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
    // 获取角色列表
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        RoleName: this.conditionForm.name,
        establishTime: this.conditionForm.establishTime
      }
      getIdentityRoles(data).then(result => {
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
    // ------------------------------------------操作按钮----------------------------------------------
    del (data) {
      let row = data || this.multipleSelection[0]
      this.$confirm(
        `此操作将删除选中数据 【${row.name}】， 是否继续？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          deleteIdentityRoles(row)
            .then(() => {
              this.$message.success('数据删除成功！')
              this.initDataList()
              this.$refs.pagination.currentPage = 1
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
    addEdit (row, type) {
      this.addEditForm = row || {}
      if (type === 'addUser') {
        this.addEditForm.type = type
      }
      this.addEditVisible = true
    },
    addEditSave (data) {
      // 新增/修改角色
      if (data.id) {
        updateIdentityRoles(data)
          .then(result => {
            this.$message.success('保存成功')
            this.queryList()
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
      } else {
        createIdentityRoles(data)
          .then(result => {
            this.$message.success('保存成功')
            this.queryList()
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
    setPermission (data) {
      this.$router.push({
        path: '/role/list/permission',
        query: { name: data.name }
      })
    }
    // 启用停用
    // isEneble (row) {
    //   this.$message.warning('暂无启用/停用字段')
    //   this.$confirm(`此操作将 ${row.enable ? '停用' : '启用'} 【${row.name}】数据， 是否继续？`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     row.enable = !row.enable
    //     updateIdentityRolesStatus(row)
    //     this.$message.success('状态修改成功！')
    //   }).catch(() => {})
    // }
  }
}
</script>
