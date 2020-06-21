<template>
<div>
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <!-- 专业树 -->
        <org-tree ref='orgTree' :currentNodeAll="nodeSelect" :dataList="TreeData" @selectNode="haddleOrganizationNode"></org-tree>
      </el-card>
    </el-col>
    <el-col :span="19" v-show="nodeLevel">
      <!-- 课程列表 -->
      <el-card v-show="JSON.stringify(this.nodeSelect) !== '{}'&& this.nodeLevel!=='根' && this.nodeId!='-1'" :style="style">
        <div slot="header" class="t-box-card-header">
          <span>课程列表 （ 所属专业【{{nodeName}}】 ）</span>
        </div>
        <!-- <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
          <el-form-item label="课程名称">
            <el-input class="input-append" v-model="conditionForm.Title"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
        </el-form> -->
        <!-- 操作按钮 -->
        <div class="t-operate-buttons">
          <el-button type="primary" size="mini" @click="bind()">绑定课程</el-button>
          <!-- <el-button type="primary" size="mini" @click="UnBind()">解绑课程</el-button> -->
        </div>
        <!-- 表格 -->
        <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
          <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
          <el-table-column prop="name" sortable label="课程名称"></el-table-column>
          <el-table-column  fixed="right" label="操作" width="250" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="UnBind(scope.row)">解绑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 全选 -->
        <!-- <div class="t-batch-operate">
          <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
        </div> -->
        <!-- 分页组件 -->
        <!-- <div class="t-operate-footer">
          <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div> -->
      </el-card>
    </el-col>
  </el-row>
  <!-- 绑定课程 -->
  <!-- 引入模态框类型的穿梭框组件:title-标题，dataList-所有角色，chooseValue-已分配的角色，alias-穿梭框匹配的id和那么，saveTransfer-保存已选择的数据 -->
  <transfer :visible.sync="transferVisible" :title="title" :dataList="transferData" :alias="alias" :chooseValue="chooseValue" @changeVisibility="transferHide" @saveTransfer="getTransferDate"></transfer>
</div>
</template>
<script>
import { getMajorTree, getCourseList, getMajorList } from '@/server/basic-module'
import {
  getMajorBindCourseList,
  MajorBindCourses,
  MajorUnBindCourses
} from '@/server/examination-module'
import orgTree from '@/components/orgTree.vue'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import transfer from '@/components/transfer.vue'
export default {
  data () {
    return {
      pageSizes,
      pageSize,
      style: '',
      total: 0,
      TreeData: [],
      conditionForm: {},
      tableData: [],
      isSelectAll: false,
      nodeSelect: {},
      nodeId: '',
      nodeName: '',
      nodeLevel: '',
      /* -------------------穿梭框传递数据------------------- */
      title: '课程绑定',
      transferVisible: false,
      transferData: [],
      alias: {key: 'id', label: 'name'},
      chooseValue: [], // 穿梭框默认选中列表，由alias.key组成的数组
      transferString: '',
      itemId: '',
      treeObj: {}
    }
  },
  components: {orgTree, pagination, transfer},
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getMajorTree()
    this._getCourseList()
  },
  methods: {
    // ------------------------------------ 查询 -----------------------------------
    _getMajorList () {
      this.TreeData = []
      this.treeObj = {
        label: '试题库',
        id: -1,
        level: '根',
        children: []
      }
      getMajorList().then(result => {
        result.items.forEach(item => {
          let newObj = {
            label: item.name,
            id: item.id,
            level: '专业'
          }
          this.treeObj.children.push(newObj)
        })
        this.TreeData.push(this.treeObj)
      })
    },
    // 获取列表，传递数据给穿梭框
    _getCourseList () {
      this.transferData = []
      getCourseList({MaxResultCount: 200}).then(result => {
        this.transferData = result.items
        this.transferData.forEach(item => {
          item.name = `${item.name}（${item.testingWay}）`
        })
      })
    },
    // 专业树
    _getMajorTree () {
      this.TreeData = []
      getMajorTree().then(result => {
        this.TreeData.push(result)
        this.foucsOnNode()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    /* 接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this._getMajorBindCourseList(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this._getMajorBindCourseList(SkipCount, pageSize)
    },
    queryList () {
      this._getMajorBindCourseList()
    },
    // 获取专业已绑定的课程列表
    _getMajorBindCourseList () {
      this.chooseValue = []
      getMajorBindCourseList(this.nodeId).then(result => {
        this.tableData = result
        this.total = result.totalCount
        // 将id存入到chooseValue作为默认值
        for (var item of result) {
          this.chooseValue.push(item.id)
        }
      })
    },
    // 获得穿梭框的数据，并保存到数据库
    getTransferDate (data) {
      MajorBindCourses(this.nodeId, data).then(() => {
        this.$message.success('课程绑定成功')
        this._getMajorBindCourseList()
        this._getMajorTree()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
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
    // ------------------------------------ 操作 -----------------------------------
    /* 选择的组织机构 */
    haddleOrganizationNode (node) {
      this.nodeSelect = node
      this.nodeId = node.id
      this.nodeName = node.label
      this.nodeLevel = node.level
      if (node.id !== -1) {
        this._getMajorBindCourseList()
      }
    },
    foucsOnNode () {
      setTimeout(() => {
        if (this.nodeSelect && JSON.stringify(this.nodeSelect) !== '{}') {
          this.$refs.orgTree.checkNode()
        }
      }, 500)
    },
    bind (row) {
      this.transferVisible = true
    },
    UnBind (row) {
      this.$confirm(`此操作将解绑课程 【${row.name}】， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        MajorUnBindCourses(this.nodeId, [row.id]).then(result => {
          this.$message.success('解绑成功')
          this._getMajorBindCourseList()
          this._getMajorTree()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }).catch(() => {})
    },
    transferHide (data) { // 隐藏穿梭框
      this.transferVisible = data
    }
  }
}
</script>
<style lang="less" scoped>
.specialCol{
  background:#a5f373;
  /deep/.el-button{
    span{
      color:#00f;
    }
  }
}
</style>
