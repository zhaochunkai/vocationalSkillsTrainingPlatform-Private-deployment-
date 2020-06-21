<template>
  <div>
    <!-- 学校信息 -->
    <el-card :style="style">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="学校详情" name="first">
          <el-form
            class="t-form-block"
            ref="form"
            :model="schoolData"
            :rules="rules"
            label-width="120px"
            size="small"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="学校代码" prop="code">
                  <el-input v-model="schoolData.code" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学校名称" prop="name">
                  <el-input v-model="schoolData.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="学校地址 " prop="address">
                  <el-input v-model="schoolData.address"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item>
                  <el-button type="primary" size="small" @click="save">保 存</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="直属校区" name="second">
          <div slot="header" class="t-box-card-header">
            <span>学校信息</span>
          </div>
          <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
            <el-form-item label="校区名称">
              <el-input class="input-append" v-model="conditionForm.name" placeholder="请输入校区名称"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="conditionForm.UsageStatus">
                <el-option label="全部" value="ALL"></el-option>
                <el-option label="启用" value="enable"></el-option>
                <el-option label="停用" value="disable"></el-option>
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
            <el-table-column prop="name" sortable label="校区名称"></el-table-column>
            <el-table-column prop="code" label="校区代码"></el-table-column>
            <el-table-column prop="usageStatus" label="状态" width="120">
              <template slot-scope="scope">{{scope.row.usageStatus=='Enable'?'启用': '停用'}}</template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="addEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="isEnable(scope.row)"
                >{{scope.row.usageStatus=='Enable'?'停用': '启用'}}</el-button>
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
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 新增/修改页面 -->
    <add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @save="addEditSave"></add-edit>
  </div>
</template>
<script>
import {
  updateSchool,
  getCampusList,
  createCampus,
  updateCampus,
  updateCampusStatus,
  deleteCampusById
} from '@/server/basic-module'
import pagination from '@/components/pagination'
import { pageSize } from '@/config.js'
import addEdit from './campus-list-add'
export default {
  name: 'campusList',
  data () {
    return {
      pageSize,
      SkipCount: 0,
      style: '',
      total: 0,
      currentPage: 0,
      isSelectAll: false,
      addEditVisible: false,
      addEditForm: {},
      conditionForm: {},
      tableData: [],
      // tab切换
      activeName: 'first',
      form: {},
      rules: {
        code: [
          { required: true, message: '请输入学校代码', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z-_]{0,20}$/, message: '只能由20字以内的数字、字母、下划线或横线组成', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入学校名称', trigger: 'blur' },
          { max: 50, message: '字符长度必须小于50', trigger: 'blur' }
        ],
        address: [{ max: 100, message: '字符长度必须小于100', trigger: 'blur' }]
      }
    }
  },
  components: { addEdit, pagination },
  props: ['schoolData'],
  activated () {
    this.initDataList()
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`
  },
  methods: {
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
    // 校区列表
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        name: this.conditionForm.name,
        UsageStatus: this.conditionForm.UsageStatus
      }
      // 根据校区查机构
      getCampusList(data).then(result => {
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
    addEdit (row) {
      this.addEditForm = row || {}
      this.addEditVisible = true
    },
    addEditSave (data) {
      data.schoolId = this.schoolData.id
      if (data.id) {
        updateCampus(data)
          .then(result => {
            this.$message.success('修改成功')
            this.$emit('updateSchoolTree')
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
        createCampus(data)
          .then(result => {
            this.$message.success('保存成功')
            this.$emit('updateSchoolTree')
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
    save () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        updateSchool(this.schoolData)
          .then(result => {
            this.$emit('updateSchoolTree')
            this.$message.success('保存成功')
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
    // tab切换
    handleClick (tab, event) {
      // console.log(tab, event);
      this.initDataList()
    },
    del (row) {
      this.$confirm(
        `此操作将 删除校区 【${row.name}】数据， 是否继续？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          deleteCampusById(row)
            .then(() => {
              this.$message.success('校区删除成功！')
              this.initDataList()
              this.$refs.pagination.currentPage = 1
              this.$emit('updateSchoolTree')
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
    isEnable (row) {
      this.$confirm(
        `此操作将 ${row.usageStatus === 'Enable' ? '停用' : '启用'} 【${
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
          // row.enable=!row.enable;
          if (row.usageStatus === 'Enable') {
            row.enable = false
          } else {
            row.enable = true
          }
          updateCampusStatus(row)
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
    }
  }
}
</script>
