<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="5">
        <el-card :style="style">
          <!-- 机构树 -->
          <org-tree :dataList="schoolListTree" @selectNode="haddleOrganizationNode"></org-tree>
        </el-card>
      </el-col>
      <el-col :span="19">
        <!-- 学校信息列表 -->
        <el-card v-show="nodeId==-1 && nodeLevel==null && nodeLable=='学校'" :style="style">
          <div slot="header" class="t-box-card-header">
            <span>学校列表</span>
          </div>
          <!-- 操作按钮 -->
          <div class="t-operate-buttons t-margin-bottom" v-if="tableData.length === 0">
            <el-button type="primary" size="mini" @click="addEdit">新增</el-button>
          </div>
          <!-- 表格 -->
          <el-table
            class="t-table-list"
            ref="multipleTable"
            stripe
            size="small"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="name" sortable label="学校名称" align="center"></el-table-column>
            <el-table-column prop="code" label="学校代码" width="110" align="center"></el-table-column>
            <el-table-column prop="address" label="地址" align="center"></el-table-column>
            <el-table-column fixed="right" label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="addEdit(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 全选 -->
          <div class="t-batch-operate">
            <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
          </div>
        </el-card>
        <!-- 学校信息 -->
        <campus-list
          v-show="nodeId!=-1 &&nodeLevel=='学校'"
          :schoolData="schoolData"
          @updateSchoolTree="_getSchoolTree"
        ></campus-list>
        <!-- 校区信息 -->
        <institution-list
          v-show="nodeLevel=='校区'"
          :campusData="campusData"
          @updateSchoolTree="_getSchoolTree"
        ></institution-list>
        <!-- 机构列表 -->
        <office-list
          v-show="nodeLevel=='机构'"
          :nodeId="nodeId"
          :nodeLevel="nodeLevel"
          :institutionData="institutionData"
          @updateSchoolTree="_getSchoolTree"
        ></office-list>
      </el-col>
    </el-row>
    <!-- 弹出层：新增/编辑学校信息 -->
    <add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @save="addEditSave"></add-edit>
  </div>
</template>
<script>
import {
  getSchoolTree,
  getSchoolList,
  getSchoolById,
  createSchool,
  updateSchool,
  getCampusById,
  getInstitutionById
} from '@/server/basic-module'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import orgTree from '@/components/orgTree.vue'
import campusList from './campus-list.vue'
import institutionList from './institution-list.vue'
import officeList from './office-list.vue'
import addEdit from './school-list-add.vue'
export default {
  data () {
    return {
      pageSizes,
      pageSize,
      SkipCount: 0,
      style: '',
      currentPage: 0,
      isSelectAll: false,
      addEditVisible: false,
      addEditForm: {},
      conditionForm: {},
      tableData: [],
      nodeLevel: null,
      nodeLable: '学校',
      nodeId: '',
      // tab切换
      activeName: 'first',
      activeTreeName: 'school',
      form: [],
      total: 0,
      schoolListTree: [],
      schoolData: {},
      campusData: {},
      institutionData: {}
    }
  },
  components: {
    pagination,
    orgTree,
    addEdit,
    campusList,
    institutionList,
    officeList
  },
  activated () {
    this._getSchoolTree()
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
    _getSchoolTree () {
      this.schoolListTree = []
      getSchoolTree().then(result => {
        this.schoolListTree.push(result)
      })
    },
    // 获取学校列表
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        name: this.conditionForm.name
      }
      getSchoolList(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
      })
    },
    // 学校据id获取学校信息

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
      if (data.id) {
        updateSchool(data)
          .then(result => {
            this.$message.success('保存成功')
            this.queryList()
            this._getSchoolTree()
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
      } else {
        createSchool(data)
          .then(result => {
            this.$message.success('保存成功')
            this.queryList()
            this._getSchoolTree()
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
    // 删除学校
    del (row) {
      // this.$confirm(`此操作将 删除学校 【${row.name}】数据， 是否继续？`, '提示', {
      // 	confirmButtonText: '确定',
      // 	cancelButtonText: '取消',
      // 	type: 'warning'
      // }).then(() => {
      // 	deleteCampusById(row).then(() => {
      // 		this.$message.success('校区删除成功！');
      // 		this.initDataList()
      // 		this.$refs.pagination.currentPage=1
      // 	}).catch(err => {
      // 		this.$message({
      // 				showClose: true,
      // 				message: err.message,
      // 				type: 'error'
      // 		})
      // 	})
      // }).catch(() => {})
    },
    // 启用停用
    isEneble (row) {
      this.$confirm(
        `此操作将 ${row.isAvailable ? '停用' : '启用'} 【${
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
          row.enable = !row.enable
          updateCampusStatus(row)
            .then(() => {
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
    // tab切换
    handleClick (tab, event) {
      // console.log(tab, event);
    },
    /* 选择的组织机构 */
    haddleOrganizationNode (node) {
      this.nodeLevel = node.level
      this.nodeLable = node.label
      this.nodeId = node.id
      this.institutionData = {}
      let nodeId = ''
      // 学校据机构号或者校区代码查询机构信息
      if (node) {
        nodeId = node.id
      }
      if (node.id === -1 && node.level == null && node.label === '学校') {
        this.initDataList()
        return
      } else if (node.id !== -1 && node.level === '学校') {
        // 学校据id查询学校信息
        getSchoolById(nodeId).then(result => {
          this.schoolData = result
        })
        return
      } else if (node.level === '校区') {
        // 学校据id查询校区信息
        getCampusById(nodeId).then(result => {
          this.campusData = result
        })
        return
      } else if (node.level === '机构') {
        // 学校据id查询机构信息
        getInstitutionById(nodeId).then(result => {
          this.institutionData = result
        })
        return
      }
    }
  }
}
</script>
