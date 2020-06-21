<template>
<div>
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <!-- 学习项目树 -->
        <org-tree :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>
      </el-card>
    </el-col>
    <el-col :span="19" v-show="this.nodeSelect.level!='根'">
      <el-row :gutter="5" class="btnsParent">
        <el-col :span="10">
          <!-- 未分班列表 -->
          <el-card v-show="JSON.stringify(this.nodeSelect) != '{}'&& this.nodeSelect.level!='根'" :style="style">
            <div slot="header" class="t-box-card-header">
              <span>未分班学生列表</span>
            </div>
            <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
              <el-form-item label="姓名">
                <el-input class="input-append" v-model="conditionForm.Name" placeholder="拼音首字母/姓名"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="queryList">查询</el-button>
              </el-form-item>
              <el-tag type="danger" style="color:#000;">已选择<strong style="font-size:1.2rem;color:#f00;"> {{multipleSelection.length}} </strong>人</el-tag>
            </el-form>
            <!-- 表格 -->
            <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="50"> </el-table-column>
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column prop="name" sortable label="姓名">
                <template slot-scope="scope">
                  <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.name}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="idCard" label="身份证号" width="180"></el-table-column>
              <el-table-column prop="sex" label="性别" width="100"></el-table-column>
            </el-table>
            <!-- 全选 -->
            <div class="t-batch-operate">
              <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
            </div>
            <!-- 分页组件 -->
            <div class="t-operate-footer">
              <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
            </div>
          </el-card>
        </el-col>
        <el-col :span="14" style="display:flex;">
          <div class="btns"  v-show="JSON.stringify(this.nodeSelect) != '{}'&& this.nodeSelect.level!='根'">
            <div class="btn"><el-button type="success" size="medium" @click="saveData()">到右边 &gt;</el-button></div>
            <div class="btn"><el-button type="success" size="medium" @click="removeData()">&lt; 到左边</el-button></div>
            <div class="btn"><el-button type="success" size="medium" @click="clearData()">清空学生</el-button></div>
          </div>
          <!-- 已分班列表 -->
          <el-card v-show="JSON.stringify(this.nodeSelect) != '{}'&& this.nodeSelect.level!='根'" :style="style">
            <div slot="header" class="t-box-card-header">
              <span>已分班学生列表</span>
            </div>
            <!-- 操作按钮 -->
            <div class="t-operate-buttons">
                <span>班级</span>
                <el-select v-model="classId" placeholder="请选择班级" size="small">
                  <el-option v-for="(item,i) of classList" :key="i" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-button type="primary" size="small" @click="createClassBtn('create')">创建班级</el-button>
                <el-button type="primary" size="small" @click="createClassBtn('update')">修改班级</el-button>
                <el-tag type="danger" style="color:#000;">现有<strong style="font-size:1.2rem;color:#000;"> {{classTotal}} </strong>人</el-tag>
            </div>
            <!-- 表格 -->
            <el-table class="t-table-list"  ref="multipleClassTable" stripe size="small" :data="classStuData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="classHandleSelectionChange">
              <el-table-column type="selection" width="50"> </el-table-column>
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column prop="name" sortable label="姓名">
                <template slot-scope="scope">
                  <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.name}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="idCard" label="身份证号" width="180"></el-table-column>
              <el-table-column prop="sex" label="性别" width="100"></el-table-column>
            </el-table>
            <!-- 全选 -->
            <div class="t-batch-operate">
              <el-checkbox v-model="isclassSelectAll" class="t-select-all" @change="classselectAll()">全选</el-checkbox>
            </div>
            <!-- 分页组件 -->
            <div class="t-operate-footer">
              <pagination :total="classTotal" @sizeChange="classHandleSize" @currentChange="classHandleCurrent"></pagination>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
  <!-- 新增|编辑班级 -->
  <class-edit :classTotal="classTotal" :dataForm="addEditForm" :visible.sync="addEditVisible" @refresh="_getClassList" @changeStudentList="changeStudentList"></class-edit>
  <!-- 学生档案 -->
  <student-profile :dataForm="addEditForm" :visible.sync="profileVisible"></student-profile>
</div>
</template>
<script>
import { getTrainingProgramsTree } from '@/server/basic-module'
import {
  getUnPlacementStudentList,
  getClassList,
  getClassStudentList,
  SetAddClassStudent,
  SetRemoveClassStudent,
  SetClearClassStudent
} from '@/server/training-module'
import orgTree from '@/components/orgTree.vue'
import studentProfile from '@/views/common/infomation-module/student-profile.vue'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import classEdit from './class-edit'
export default {
  data () {
    return {
      pageSizes,
      pageSize,
      SkipCount: 0,
      style: '',
      total: 0,
      resourceTree: [],
      conditionForm: {},
      tableData: [], // 未分班学生
      isSelectAll: false,
      multipleSelection: [],
      isclassSelectAll: false, // 已分班
      multipleClassSelection: [],
      classStuData: [], // 已分班学生
      classTotal: 0,
      classList: [], // 班级列表
      classId: '', // 已选择的班级id
      addEditVisible: false,
      refuseEditVisible: false,
      addEditForm: {},
      nodeId: '',
      nodeName: '',
      nodeSelect: {},
      profileVisible: false
    }
  },
  components: {orgTree, pagination, classEdit, studentProfile},
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getTrainingProgramsTree()
  },
  watch: {
    classId (newVal) {
      if (newVal) {
        this._getClassStudentList()
      }
    }
  },
  methods: {
    /* -------------------------- 查询 -------------------------- */
    _getTrainingProgramsTree () { // 学习项目树
      this.resourceTree = []
      getTrainingProgramsTree().then(result => {
        this.resourceTree.push(result)
      }).then(() => {
        if (this.nodeId && this.nodeSelect.level !== '根') {
          this.initDataList()
        }
      })
    },
    queryList () {
      this.initDataList(this.SkipCount, this.pageSize)
    },
    // 根据项目id获取，未分班的学生
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        id: this.nodeId,
        Name: this.conditionForm.Name,
        SkipCount: SkipCount,
        MaxResultCount: pageSize
      }
      getUnPlacementStudentList(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
      })
    },
    /* -------------------------- 操作 -------------------------- */
    // 刷新班级学生列表
    changeStudentList () {
      console.log('ds')
      this.haddleOrganizationNode(this.nodeSelect)
    },
    // 跳转至学生档案模块
    toInfomationPage (row) {
      this.addEditForm = {
        studentId: row.id, // 学生id
        name: row.name, // 学生姓名
        programId: this.nodeId // 项目id
      }
      this.profileVisible = true
    },
    /* 选择的组织机构 */
    haddleOrganizationNode (node) {
      this.nodeSelect = node
      this.nodeId = node.id
      this.nodeName = node.label
      this.classId = ''
      this.classTotal = 0
      this.classStuData = []
      if (this.nodeSelect.level !== '根') {
        this.initDataList() // 获取项目下的未分班学生
        this._getClassList() // 获取项目下的班级列表
      }
    },
    // ------------------------------------------------未分班------------------------------------
    /* 接收改变后每页多少条 ---未分班 */
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    /* 接收当前页数    ---未分班 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
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
    // ----------------------------------------------- 已分班 ---------------------------------------
    /* 接收改变后每页多少条 ---已分班 */
    classHandleSize (SkipCount, pageSize) {
      this._getClassStudentList(SkipCount, pageSize)
    },
    /* 接收当前页数 ---已分班 */
    classHandleCurrent (SkipCount, pageSize) {
      this._getClassStudentList(SkipCount, pageSize)
    },
    // 全选
    // toggleSelection (rows) {
    //   if (rows) {
    //     rows.forEach(row => {
    //       this.$refs.multipleClassTable.toggleRowSelection(row)
    //     })
    //   } else {
    //     this.$refs.multipleClassTable.clearSelection()
    //   }
    // },
    classselectAll () {
      this.$refs.multipleClassTable.toggleAllSelection()
    },
    classHandleSelectionChange (val) {
      this.multipleClassSelection = val
      // 判断是否是全选
      this.isclassSelectAll = this.classStuData.length === this.multipleClassSelection.length
    },
    // 根据班级id获取，已分班的学生
    _getClassStudentList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        id: this.classId,
        SkipCount: SkipCount,
        MaxResultCount: pageSize
      }
      getClassStudentList(data).then(result => {
        this.classStuData = result.items
        this.classTotal = result.totalCount
      })
    },
    createClassBtn (type) { // 创建/编辑班级
      this.addEditVisible = true
      this.addEditForm.trainingProgramId = this.nodeId
      this.addEditForm.trainingProgramName = this.nodeName
      this.addEditForm.id = this.classId
      if (type === 'create') { // 创建
        this.addEditForm.id = ''
      } else { // 修改
        this.addEditForm.id = this.classId
      }
    },
    // 根据项目id获取班级列表
    _getClassList () {
      let data = {
        tpId: this.nodeId
      }
      getClassList(data).then(result => {
        this.classList = result.items
        this.classId = ''
      })
    },
    // --------------------保存分班数据-------------------------------
    saveData () {
      let StudentIds = []
      this.multipleSelection.forEach(item => { // 遍历选择的未分班列表，提取学生id集合
        StudentIds.push(item.id)
      })
      if (!this.classId) {
        this.$message.warning('请先选择班级')
        return
      }
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择未分班的学生')
        return
      }
      SetAddClassStudent(this.classId, StudentIds).then(result => {
        this.$message.success('学生分班成功')
        this.queryList()
        this._getClassStudentList()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    removeData () {
      let StudentIds = []
      this.multipleClassSelection.forEach(item => { // 遍历选择的已分班列表，提取学生id集合
        StudentIds.push(item.id)
      })
      if (!this.classId) {
        this.$message.warning('请先选择班级')
        return
      }
      if (this.multipleClassSelection.length === 0) {
        this.$message.warning('请选择已分班的学生')
        return
      }
      SetRemoveClassStudent(this.classId, StudentIds).then(result => {
        this.$message.success('移除班级学生成功')
        this.queryList()
        this._getClassStudentList()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    clearData () {
      if (!this.classId) {
        this.$message.warning('请先选择班级')
        return
      }
      this.$confirm(`此操作将清空班级里的所有学生，请确认？`, '提示', {
        confirmButtonText: '清空',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        SetClearClassStudent(this.classId).then(result => {
          this.$message.success('清空学生成功')
          this.queryList()
          this._getClassStudentList()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }).catch(() => {})
    }
  }
}
</script>
<style lang="less" scoped>
.specialCol{
  background:#a5f373;
  /deep/.el-button{
    span{
      color:#000;
    }
  }
}

.btns{
  margin-right:5px;
  text-align:center;
  .btn{
    margin:20px auto 0;
  }
}
</style>
