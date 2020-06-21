<template>
<div>
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <!-- 学习项目树 -->
        <org-tree ref="orgTree" :currentNodeAll="nodeSelect" :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>
      </el-card>
    </el-col>
    <el-col :span="19" >
      <!-- 报名信息列表 -->
      <el-card v-show="JSON.stringify(this.nodeSelect) != '{}'&& this.nodeSelect.level!='根'" :style="style">
        <div slot="header" class="t-box-card-header">
          <span>报名人员列表</span>
        </div>
        <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
          <el-form-item label="姓名/手机号/身份证号">
            <el-input class="input-append" v-model="conditionForm.IdCardOrTelOrName"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="conditionForm.Status">
              <el-option label="全部" value="All"></el-option>
              <el-option label="待审核" value="ToAudit"></el-option>
              <el-option label="未通过" value="NotPass"></el-option>
              <el-option label="已通过" value="Pass"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源">
            <el-select v-model="conditionForm.Source">
              <el-option label="全部" value="All"></el-option>
              <el-option label="线上（移动端）" value="Online"></el-option>
              <el-option label="线下" value="Offline"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 操作按钮 -->
        <div class="t-operate-buttons">
          <el-button type="primary" size="mini" @click="addEdit()">新增</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="primary" size="mini" @click="exportTemplate">导出模板</el-button>
          <el-button type="primary" size="mini" @click="importFile">导入学生</el-button>
        </div>
        <!-- 表格 -->
        <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="name" sortable label="姓名" align="center">
            <template slot-scope="scope">
              <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="sex" label="性别" align="center">
          </el-table-column>
          <el-table-column prop="birthday" label="出生日期" align="center">
            <template slot-scope="scope">
              {{new Date(scope.row.birthday).toLocaleDateString()}}
            </template>
          </el-table-column>
          <el-table-column prop="idCard" label="身份证号" width="150" align="center"></el-table-column>
          <el-table-column prop="tel" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="education" label="学历" align="center"></el-table-column>
          <el-table-column prop="source" label="来源" align="center"></el-table-column>
          <el-table-column prop="bindWeChat" label="绑定微信" width="90" align="center">
            <template slot-scope="scope">
              <span v-if="!scope.row.bindWeChat">未绑定</span>
              <el-tooltip v-else effect="dark" content="点击可解绑微信" placement="top">
                <el-button style="color:#f00;" type="text" size="small" @click="UnBindWechat(scope.row)">微信解绑</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="60" align="center"></el-table-column>
          <el-table-column  fixed="right" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addEdit(scope.row)">修改</el-button>
              <el-button type="text" size="small" v-if="scope.row.status=='待审核'" @click="del(scope.row)">删除</el-button>
              
              <el-button style="color:#a0a;" type="text" size="small" v-if="certificateList && certificateList.length>0" @click="uploadFile(scope.row)">上传证书和附件</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 全选 -->
        <div class="t-batch-operate">
            <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
        </div>
        <!-- 分页组件 -->
        <div class="t-operate-footer">
          <pagination ref="pagination" :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <!-- 弹出层：新增/编辑报名信息 -->
  <add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @save="addEditSave" @updateList="queryList"></add-edit>
  <!-- 学生档案 -->
  <student-profile :dataForm="addEditForm" :visible.sync="profileVisible"></student-profile>
  <!-- 学生导入 -->
  <el-dialog
    title="文件上传"
    :visible.sync="importVisible"
    width="500px"
    @close="importVisible = false">
    <el-upload class="image-upload-pic" ref="upload" action="fakeaction"
      :http-request="handleUploadFile"
      :before-remove="beforeRemove"
      :on-exceed="handleExceed"
      :before-upload="beforeFileUpload"
      :file-list="fileList"
      accept=".xls,.xlsx,.csv"
      :limit="1"
    >
      <el-button size="small" type="primary" icon="el-icon-plus avatar-uploader-icon">选取文件</el-button>
      <el-tag type="danger" style="color:#f00;">仅支持.xls,.xlsx,.csv，文件大小≤4MB！</el-tag>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="importVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="importSave">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 上传证书和附件 -->
  <upload-certificate :programId="nodeId" :certificateList="certificateList" :dataForm="addEditForm" :visible.sync="uploadVisible"></upload-certificate>
</div>
</template>
<script>
import filter from '@/utils/filter.js'
import { getStudentInfoTemplate } from '@/server/blob-module'
import { UploadExternalFiles } from '@/server/files-module'
import {getTrainingProgramsTree} from '@/server/basic-module'
import {
  getProgramRequiredCertificateTypes,
  ImportStudentInfo,
  getStudentInfoListByProgramId,
  updateStudentInfo,
  createStudentEntry,
  deleteStudentInfo,
  unBindWechat
} from '@/server/training-module'
import orgTree from '@/components/orgTree.vue'
import {pageSizes, pageSize} from '@/config.js'
import pagination from '@/components/pagination'
import addEdit from './registration-list-add.vue'
import importFile from './registration-list-import.vue'
import uploadCertificate from './upload-certificate'
import studentProfile from '@/views/common/infomation-module/student-profile.vue'
export default {
  data () {
    return {
      pageSizes,
      pageSize,
      SkipCount: 0,
      style: '',
      currentPage: 0,
      total: 0,
      resourceTree: [],
      conditionForm: {
        Status: 'ToAudit' // 待审核
      },
      tableData: [],
      isSelectAll: false,
      addEditVisible: false,
      addEditForm: {},
      nodeId: '',
      nodeName: '',
      nodeSelect: {},
      profileVisible: false,
      // 导入
      fileList: [],
      fileKey: '',
      importVisible: false,
      // 项目要求的证书
      certificateList: [],
      uploadVisible: false
    }
  },
  components: {orgTree, pagination, addEdit, importFile, studentProfile, uploadCertificate},
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getTrainingProgramsTree()
    this.foucsOnNode()
  },
  methods: {
    /* -------------------------- 查询 -------------------------- */
    // 获取培训项目绑定的毕业要求证书类型
    _getProgramRequiredCertificateTypes () {
      getProgramRequiredCertificateTypes(this.nodeId).then(res => {
        this.certificateList = res
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 培训项目树
    _getTrainingProgramsTree () {
      this.resourceTree = []
      getTrainingProgramsTree().then(result => {
        this.resourceTree.push(result)
      }).then(() => {
        if (this.nodeId && this.nodeSelect.level !== '根') {
          this.initDataList()
        }
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
    // 根据项目id获取报名列表
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        Source: this.conditionForm.Source,
        Status: this.conditionForm.Status,
        IdCardOrTelOrName: this.conditionForm.IdCardOrTelOrName
      }
      getStudentInfoListByProgramId(this.nodeId, data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    /* 选择的组织机构 */
    haddleOrganizationNode (node) {
      this.nodeSelect = node
      this.nodeId = node.id
      this.nodeName = node.label
      if (this.nodeSelect.level !== '根') {
        this.initDataList()
        this._getProgramRequiredCertificateTypes()
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
    /* -------------------------- 操作 -------------------------- */
    // 上传证书和附件
    uploadFile (row) {
      this.addEditForm = row
      this.uploadVisible = true
    },
    // 导出学生模板
    exportTemplate () {
      getStudentInfoTemplate().then(res => {
        filter.downloadBlobFile(res, '学生信息模板.xlsx')
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 学生导入
    importFile () {
      this.fileList = []
      this.importVisible = true
    },
    // 确定导入
    importSave () {
      ImportStudentInfo(this.fileKey, this.nodeId).then(res => {
        if (!res.success) {
          this.$message.error(res.msg)
        } else {
          this.queryList()
          this.$message.success(res.msg)
        }
      }).catch(err => {
        console.log(err)
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
      this.importVisible = false
    },
    // 文件上传
    handleUploadFile (params) {
      let file = params.file
      let formData = new FormData()
      formData.append('upload', file)
      params.onProgress({percent: 0})
      UploadExternalFiles(formData).then(res => {
        params.onProgress({percent: 100})
        this.fileKey = res
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 上传前格式与大小校验
    beforeFileUpload (file) {
      let isType = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!file.type) {
        const name = file.name
        // file.type为空时，根据文件后缀名进行验证
        let typeName = name.substring(name.lastIndexOf('.') + 1).toLocaleLowerCase()
        isType = typeName === 'xlsx' || typeName === 'xls' || typeName === 'csv'
      }
      const isLimitSize = file.size / 1024 / 1024 <= 4
      if (!isType) {
        this.$message.error('上传文件只能是 xls xlsx csv 格式!')
      }
      if (!isLimitSize) {
        this.$message.error('上传文件大小不能超过 4MB!')
      }
      return isLimitSize && isType
    },
    handleExceed (files, fileList) {
      this.$alert(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`).then(() => {})
    },
    // 查看学生档案
    toInfomationPage (row) {
      this.addEditForm = {
        studentId: row.id, // 学生id
        name: row.name, // 学生姓名
        programId: this.nodeId // 项目id
      }
      this.profileVisible = true
    },
    foucsOnNode () {
      setTimeout(() => {
        if (this.nodeSelect && JSON.stringify(this.nodeSelect) !== '{}') {
          this.$refs.orgTree.checkNode()
        }
      }, 500)
    },
    addEdit (row) {
      this.addEditForm = row || {}
      this.addEditVisible = true
      this.addEditForm.nodeId = this.nodeId
      this.addEditForm.nodeName = this.nodeName
      this.addEditForm.registrationProject = this.nodeId
    },
    addEditSave (data) {
      if (data.id) {
        updateStudentInfo(data).then(result => {
          this.$message.success('保存成功')
          this.queryList()
          this.foucsOnNode()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      } else {
        createStudentEntry(data).then(result => {
          this.$message.success('保存成功')
          this.queryList()
          this.foucsOnNode()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }
    },
    del (data) {
      let row = data || this.multipleSelection[0]
      this.$confirm(`此操作将删除选中数据 【${row.name}】， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          id: row.id,
          trainingProgramsId: this.nodeId
        }
        deleteStudentInfo(obj).then(() => {
          this.$message.success('数据删除成功！')
          this._getTrainingProgramsTree()
          this.initDataList()
          this.$refs.pagination.currentPage = 1
          this.foucsOnNode()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }).catch(() => {})
    },
    UnBindWechat (row) { // 微信解绑
      this.$confirm(`此操作将解除学生 【${row.name}】的微信绑定， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unBindWechat(row.id).then(() => {
          this.$message.success('微信解绑成功！')
          this._getTrainingProgramsTree()
          this.foucsOnNode()
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
