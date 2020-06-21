<template>
  <el-dialog
    class="t-dialog"
    title="选择资源"
    v-if="visible"
    :visible="visible"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    append-to-body
  >
    <div class="t-header-title">
      <span>{{dataForm.label}}</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="6">
        <!-- 课程知识点树 -->
        <el-card :style="style">
          <org-tree :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
          <el-form-item label="搜索资源">
            <el-input class="input-append" v-model="conditionForm.Key"></el-input>
          </el-form-item>
          <el-form-item label="上传者">
            <el-input class="input-append" v-model="conditionForm.Key"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" width="50" label="序号"> </el-table-column>
          <el-table-column prop="title" label="资源标题">
            <template slot-scope="scope">
              <el-button type="text" style="color:#00f" @click="fileInfo(scope.row)">{{scope.row.title}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="资源类型" width="120"></el-table-column>
          <el-table-column prop="standard" label="资源标准" width="120"></el-table-column>
          <el-table-column prop="type" label="建议学习时长"  width="120" align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.suggestedLearningTime == 0" style="font-size:12px;">未设置</span>
                <span v-else style="font-size:12px;font-weight:600;">
                  {{scope.row.suggestedLearningTime | numToSFM}}
                </span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="date" label="使用课程" width="80"></el-table-column>
          <el-table-column prop="date" label="上传者" width="80"></el-table-column> -->
        </el-table>
        <!-- 全选 -->
        <div class="t-batch-operate">
          <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
        </div>
        <!-- 分页组件 -->
        <div class="t-operate-footer">
          <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">关 闭</el-button>
      <el-button type="primary" size="small" @click="save">确 定</el-button>
    </div>
    <!-- 资源文件内容 -->
    <files-info ref="fileInformation" :dataForm="fileFrom" :visible.sync="fileVisible"></files-info>

  </el-dialog>
</template>
<script>
import { getCourseCatalogById } from '@/server/online-module'
import { getWarehouseResourceList } from '@/server/resource-module'
import { getWarehouseTree } from '@/server/basic-module'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import orgTree from '@/components/orgTree.vue'
import filesInfo from '../repository-management/repository-infomation/resource-files-info'
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      style: '',
      form: {},
      resourceTree: [],
      rules: {
        acquiredMinutes: [{ required: true, message: '请输入学时', trigger: 'blur' }],
        resourceId: [{ required: true, message: '请选择资源进行绑定', trigger: 'blur' }]
      },
      nodeId: '-1',
      nodeLabel: '', // 课程节点名称
      nodeName: '',
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      tableData: [],
      isSelectAll: false,
      multipleSelection: [],
      currentRow: null,
      conditionForm: {},
      /* -------------传递过来的数据-------------------- */
      courseId: '', // 课程 id
      chapterOrKnowlodgeId: '', // 章/节/知识点 id
      KnowlodgeLevel: '', // 知识点树节点 level
      /* -----------------资源预览-------------------------- */
      fileFrom: {},
      fileVisible: false
    }
  },
  components: {pagination, orgTree, filesInfo},
  watch: {
    visible (newVal) {
      if (newVal) {
        this.style = `max-height:${document.body.clientHeight * 0.7 - 100}px;overflow:scroll;`
        this.courseId = this.dataForm.courseId
        this.nodeLabel = this.dataForm.nodeLabel
        this.chapterOrKnowlodgeId = this.dataForm.id
        this.KnowlodgeLevel = this.dataForm.level
        this._getWarehouseTree()
        // 章|节学时
        if (this.chapterOrKnowlodgeId) {
          this._getCourseCatalogById()
        }
      }
    }
  },
  methods: {
    /* --------------------------------- 查询 --------------------------------- */
    // 获取章|节学时
    _getCourseCatalogById () {
      getCourseCatalogById(this.chapterOrKnowlodgeId).then(result => {
        this.$set(this.form, 'acquiredMinutes', Number(result.acquiredMinutes))
      })
    },
    // 资源树
    _getWarehouseTree () {
      this.resourceTree = []
      getWarehouseTree().then(result => {
        this.resourceTree.push(result)
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
    // 获取资源列表，应该增加子库id绑定查询
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        Key: this.conditionForm.Key,
        Type: this.conditionForm.Type,
        Standard: this.conditionForm.Standard,
        ApprovalStatus: this.conditionForm.ApprovalStatus,
        id: this.nodeId
      }
      getWarehouseResourceList(data).then(result => {
        this.total = result.totalCount
        if (this.dataForm.choosesIds.length > 0) {
          this.tableData = result.items.filter(item => {
            return this.dataForm.choosesIds.indexOf(item.id) === -1
          })
        } else {
          this.tableData = result.items
        }
      })
    },
    /* --------------------------------- 查询 --------------------------------- */
    /* 选择的树节点 */
    haddleOrganizationNode (node) {
      this.nodeId = node.id
      this.nodeName = node.label
      if (node.id !== -1) {
        this.initDataList()
      }
    },
    fileInfo (data) {
      this.fileFrom = Object.assign({}, data, {
        fileKey: data.trustedFileName
      })
      this.fileVisible = true
      this.$refs.fileInformation.choose() // 在父组件中调用子组件的方法
    },
    close () {
      this.$emit('update:visible', false)
    },
    save () {
      let data = []
      this.multipleSelection.forEach(item => {
        let obj = {
          resourceId: item.id,
          title: item.title,
          type: item.type,
          standard: item.standard,
          suggestedLearningTime: item.suggestedLearningTime,
          trustedFileName: item.trustedFileName
        }
        data.push(obj)
      })
      this.$emit('getData', data)
      this.close()
    }
  }
}
</script>
<style lang="less" scoped>
.t-form-block{margin-top:10px;}
/deep/.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
/deep/.el-table__body tr.current-row>td,
/deep/.el-table__body tr.hover-row.current-row>td,
/deep/.el-table__body tr.hover-row.el-table__row--striped.current-row>td,
/deep/.el-table__body tr.hover-row.el-table__row--striped>td,
/deep/.el-table__body tr.hover-row>td{
  background-color: #d7e4f9;
}
</style>
