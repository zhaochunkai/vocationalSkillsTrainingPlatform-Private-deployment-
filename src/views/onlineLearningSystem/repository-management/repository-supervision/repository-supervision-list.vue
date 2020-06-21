<template>
<div>
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <!-- 资源树 -->
        <org-tree :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>
      </el-card>
    </el-col>
    <el-col :span="19" >
      <!-- 资源列表 -->
      <el-card v-show="JSON.stringify(this.nodeSelect) != '{}'&& this.nodeSelect.level!='根'" :style="style">
        <div slot="header" class="t-box-card-header">
          <span>资源列表</span>
        </div>
        <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
            <el-form-item label="资源标题">
              <el-input class="input-append" v-model="conditionForm.Key" placeholder="资源标准/关键字"></el-input>
            </el-form-item>
            <el-form-item label="资源类型">
              <el-select v-model="conditionForm.Type" clearable>
                <el-option v-for="(item,i) of dictionary.ZYLX" :key="i" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资源标准">
              <el-select v-model="conditionForm.Standard" clearable>
                <el-option v-for="(item,i) of dictionary.ZYBZ" :key="i" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="学科">
              <el-input class="input-append" v-model="conditionForm.Discipline"></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="监管状态">
              <el-select v-model="conditionForm.ApprovalStatus">
                <el-option label="全部" value="All"></el-option>
                <el-option label="启用" value="Enable"></el-option>
                <el-option label="停用" value="Disable"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="queryList">查询</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作按钮 -->
        <!-- <div class="t-operate-buttons">
          <el-button type="info" size="mini" @click="updStatus">启用</el-button>
          <el-button type="info" size="mini" @click="updStatus">停用</el-button>
        </div> -->
        <!-- 表格 -->
        <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="title" sortable label="资源标题">
            <template slot-scope="scope" show-overflow-tooltip>
              <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.title}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="资源类型"  width="100"></el-table-column>
          <el-table-column prop="standard" label="资源标准" width="150"></el-table-column>
          <!-- <el-table-column prop="discipline" label="所属学科" width="150"></el-table-column> -->
          <el-table-column prop="approvalStatus" label="审核状态" width="100"></el-table-column>
          <el-table-column prop="usageStatus" label="状态" width="80"></el-table-column>
          <el-table-column  fixed="right" label="操作" width="220" align="left">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="updStatus(scope.row)">{{scope.row.usageStatus=='启用'?'停用': '启用'}}</el-button>
            </template>
          </el-table-column>
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
  </el-row>
</div>
</template>
<script>
import { getWarehouseResourceList } from '@/server/resource-module'
import { getWarehouseTree, getDictionaryItems } from '@/server/basic-module'
import { updateResourceStatus } from '@/server/online-module'
import orgTree from '@/components/orgTree.vue'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
export default {
  data () {
    return {
      style: '',
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      resourceTree: [],
      conditionForm: {},
      tableData: [],
      isSelectAll: false,
      addEditVisible: false,
      addEditForm: {},
      nodeId: '',
      nodeName: '',
      nodeSelect: {},
      /* -------------- 数据字典- 字典码 -------------- */
      dicJudgeName: {
        ZYBZ: 'ZYBZ', // 资源标准
        ZYLX: 'ZYLX' // 资源类型
      },
      dictionary: {}
    }
  },
  components: {orgTree, pagination},
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getWarehouseTree()
    /* -------------- 数据字典- 获取数据字典下拉数据 -------------- */
    for (let item in this.dicJudgeName) {
      getDictionaryItems(this.dicJudgeName[item]).then(result => {
        this.$set(this.dictionary, item, result)
      })
    }
  },
  methods: {
    toInfomationPage (row) { // 跳转至资源信息模块
      this.$router.push({path: '/repository/infomation', query: {id: row.id}})
    },
    _getWarehouseTree () { // 资源树
      this.resourceTree = []
      getWarehouseTree().then(result => {
        this.resourceTree.push(result)
      }).then(() => {
        if (this.nodeId && this.nodeSelect.level !== '根') {
          this.initDataList()
        }
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
    // 获取资源列表，应该增加子库id绑定查询
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        Key: this.conditionForm.Key,
        Type: this.conditionForm.Type,
        Standard: this.conditionForm.Standard,
        Discipline: this.conditionForm.Discipline,
        ApprovalStatus: this.conditionForm.ApprovalStatus,
        id: this.nodeId
      }
      getWarehouseResourceList(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
      })
    },
    /* 选择的组织机构 */
    haddleOrganizationNode (node) {
      this.nodeSelect = node
      this.nodeId = node.id
      this.nodeName = node.label
      if (this.nodeSelect.level !== '根') {
        this.initDataList()
      }
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
    updStatus (row) {
      let data = row || this.multipleSelection || {}
      this.$confirm(`此操作将 【${data.usageStatus === '启用'?'停用': '启用'}】 资源【${data.title ? data.title.substr(data.title.indexOf('_') + 1) : data.title}】，请确认？`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        data.enable = row.usageStatus !== '启用'
        updateResourceStatus(data).then(result => {
          this.$message.success('设置资源状态成功')
          this.queryList()
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
      color:#00f;
    }
  }
}
</style>
