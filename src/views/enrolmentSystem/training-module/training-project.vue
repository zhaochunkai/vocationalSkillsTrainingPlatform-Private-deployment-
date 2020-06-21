<template>
  <div>
    <!-- 学习项目列表 -->
    <el-card :style="style">
      <div slot="header" class="t-box-card-header">
        <span>学习项目列表</span>
      </div>
      <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
        <el-form-item label="项目名称">
          <el-input class="input-append" v-model="conditionForm.name" placeholder="请输入学习项目名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="conditionForm.Status" clearable>
            <el-option
              v-for="(item,i) of dictionary.PXXMZT"
              :key="i"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="范围">
          <el-date-picker
            v-model="searchDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <div class="t-operate-buttons">
        <!-- <el-button type="primary" size="mini">导入</el-button> -->
        <el-button type="primary" size="mini" @click="addEdit()">新增</el-button>
      </div>
      <!-- 表格 -->
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
        <el-table-column prop="projectName" sortable label="项目名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              type="text"
              style="color:#00f"
              @click="goToInformation(scope.row)"
            >{{scope.row.projectName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="charge" label="学费(元)" width="80" align="center">
          <template slot-scope="scope">
            <strong>{{scope.row.charge}}</strong>
          </template>
        </el-table-column>
        <el-table-column prop="liveFaceAttendanceCycle" label="人脸考勤间隔" width="130" align="center">
          <template slot-scope="scope" slot="header">
            <span>人脸考勤<br>间隔(分钟)</span>
          </template>
          <template slot-scope="scope">
            <el-button @click="settingTime(scope.row)" type="text" title="点击设置间隔时长">
              <span
                v-if="!scope.row.liveFaceAttendanceCycle && !scope.row.onlineFaceAttendanceCycle"
                style="color:#0a0;font-size:12px;"
              >点我设置</span>
              <span v-else style="color:#0a0;font-size:12px;" >
                <span v-show="scope.row.liveFaceAttendanceCycle">直播 {{Math.floor(scope.row.liveFaceAttendanceCycle/60)}} 分钟<br></span>
                <span v-show="scope.row.onlineFaceAttendanceCycle">学习 {{Math.floor(scope.row.onlineFaceAttendanceCycle/60)}} 分钟</span>
              </span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="onlineFaceAttendanceCycle" label="证书类型" width="90" align="center">
          <template slot-scope="scope" slot="header">
            <span>毕业要求<br>证书类型</span>
          </template>
          <template slot-scope="scope">
            <el-button @click="settingCertificate(scope.row)" type="text" title="点击设置毕业要求证书类型">
              <span
                style="color:#0a0;font-size:12px;"
              >点我设置</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="recruitStudentsStartDate" label="报名时间" width="174" align="center">
          <template
            slot-scope="scope"
          >{{new Date(scope.row.recruitStudentsStartDate) | formatDate}} ~ {{new Date(scope.row.recruitStudentsStopDate) | formatDate}}</template>
        </el-table-column>
        <el-table-column prop="recruitStudentsNumbers" label="招生人数(人)" width="160" align="center">
          <template slot-scope="scope">
            <strong>{{scope.row.recruitStudentsNumbers}}</strong>
            <span style="color:#999;">{{scope.row.limit?'': '（允许超员）'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="trainingProgramType" label="项目类型" width="90" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" width="75" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state !== '启动报名'">{{scope.row.state}}</span>
            <el-tooltip v-else class="item" effect="dark" content="可以点击查看报名二维码" placement="top">
              <el-button @click="showQrCode(scope.row)" size="small" type="text">启动报名</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="340" align="center">
          <template slot-scope="scope">
            <div class="t-text-right">
              <el-button
                type="text"
                size="small"
                v-show="scope.row.state=='创建中'"
                @click="addEdit(scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                v-show="scope.row.state=='创建中'"
                @click="del(scope.row)"
              >删除</el-button>
              <el-button type="text" size="mini" @click="setState(scope.row)">设置项目状态</el-button>
              <el-button type="primary" size="mini" @click="settingCourseSheme(scope.row)">设置课程和培养方案</el-button>
            </div>
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
    <add-edit :dictionary="dictionary" :dataForm="addEditForm" :visible.sync="addEditVisible" @updateList="queryList"></add-edit>
    <!-- 设置项目状态 -->
    <edit-state :dictionary="dictionary" :dataForm="addEditForm" :visible.sync="editStateVisible" @save="editStateSave"></edit-state>
    <!-- 设置项目培养方案 -->
    <course-sheme :TrainingProgramsId="TrainingProgramsId" :visible.sync="shemeVisible" @queryList="queryList"
    ></course-sheme>
    <!-- 项目详情 -->
    <program-information :dictionary="dictionary" :dataForm="addEditForm" :visible.sync="programInfoVisible"></program-information>
    <!-- 人脸识别间隔时长 -->
    <el-dialog title="设置人脸考勤间隔时长" :visible.sync="faceFormVisible" width="500px">
      <el-form :model="faceForm" size="small" inline label-width="180px">
        <el-form-item label>
          <el-tag type="danger" style="color:#f00;">建议设置的时长不超过30分钟</el-tag>
        </el-form-item>
        <el-form-item label="直播课堂人脸考勤间隔">
          <el-input
            v-model="faceForm.liveFaceAttendanceCycle"
            type="number"
            min="0"
            placeholder="建议设置的时长不超过 30 分钟"
          >
            <el-button slot="append">分钟</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="在线学习人脸考勤间隔">
          <el-input
            v-model="faceForm.onlineFaceAttendanceCycle"
            type="number"
            min="0"
            placeholder="建议设置的时长不超过 30 分钟"
          >
            <el-button slot="append">分钟</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="faceFormVisible = false" size="small">关 闭</el-button>
        <el-button type="primary" @click="saveTimes" size="small">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 设置毕业要求证书 -->
    <project-certificate :dataForm="addEditForm" :visible.sync="certificateVisible" ></project-certificate>
    <!-- 报名二维码 -->
    <el-dialog title="报名二维码" :visible.sync="qrCodeVisible" width="500px">
      <div class="text-right">
        <el-button
          type="primary"
          size="small"
          v-print="print"
        >打印报名二维码</el-button>
      </div>
      <div id="printCompletion" class="text-center">
        <img :src="qrCodePic" width="90%">
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  GenerateProgramQrCode,
  settingFaceAttendanceCycle,
  getTrainingProgramsList,
  deleteTrainingPrograms,
  updateTrainingProgramsStatus
} from '@/server/training-module'
import { getDictionaryItems } from '@/server/basic-module'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import addEdit from './training-project-add'
import editState from './training-project-state'
import courseSheme from './training-project-courseSheme'
import programInformation from './project-module/project-infomation'
import projectCertificate from './project-certificate-setting'
export default {
  name: 'trainingProject',
  components: {
    addEdit,
    editState,
    pagination,
    courseSheme,
    programInformation,
    projectCertificate
  },
  data () {
    return {
      style: '',
      /* ------------------ 数据字典- 字典码 -------------- */
      dicJudgeName: {
        PXXMZT: 'PXXMZT', // 学习项目状态
        PXXMLX: 'PXXMLX' // 学习项目类型
      },
      dictionary: {},
      /* ---- 分页组件数据 ---- */
      pageSize,
      pageSizes,
      total: 0,
      SkipCount: 0,
      /* ---- 表格相关数据 ---- */
      isSelectAll: false,
      addEditVisible: false,
      editStateVisible: false,
      addEditForm: {},
      shemeVisible: false,
      TrainingProgramsId: '',
      tableData: [],
      /* ---- 查询条件 ---- */
      conditionForm: {},
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date(
                new Date(new Date().toDateString()).getTime() +
                  3600 * 1000 * 24 * 1 -
                  1
              )
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date(
                new Date(new Date().toDateString()).getTime() +
                  3600 * 1000 * 24 * 1 -
                  1
              )
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date(
                new Date(new Date().toDateString()).getTime() +
                  3600 * 1000 * 24 * 1 -
                  1
              )
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '今年',
            onClick (picker) {
              const end = new Date(
                new Date().getFullYear() + '-12-31 23:59:59'
              )
              const start = new Date(
                new Date().getFullYear() + '-01-01 00: 00: 00'
              )
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      searchDate: '',
      startTime: '',
      endTime: '',
      // 人脸识别间隔时长
      faceFormVisible: false,
      faceForm: {},
      // 项目详细信息
      programInfoVisible: false,
      // 毕业证书
      certificateVisible: false,
      // 报名二维码
      qrCodeVisible: false,
      qrCodePic: '',
      print: ''

    }
  },
  activated () {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`
    this.initDataList()
    /* ------------------ 数据字典- 获取数据字典下拉数据 -------------- */
    for (let item in this.dicJudgeName) {
      getDictionaryItems(this.dicJudgeName[item]).then(result => {
        this.$set(this.dictionary, item, result)
      })
    }
  },
  watch: {
    searchDate (newVal) {
      if (newVal) {
        this.startTime = newVal[0]
        this.endTime = newVal[1]
      }
    },
    'faceForm.liveFaceAttendanceCycle' (newVal) {
      if (newVal < 0) {
        this.$set(this.faceForm, 'inliveFaceAttendanceCyclep', 0)
      }
    },
    'faceForm.onlineFaceAttendanceCycle' (newVal) {
      if (newVal < 0) {
        this.$set(this.faceForm, 'onlineFaceAttendanceCycle', 0)
      }
    }

  },
  methods: {
    /* ************************************************************ */
    /* *************************** 查询 *************************** */
    /* ************************************************************ */
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
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        name: this.conditionForm.name,
        Status: this.conditionForm.Status,
        StartTime: this.startTime,
        EndTime: this.endTime
      }
      getTrainingProgramsList(data).then(result => {
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
    // 获取报名二维码
    _GenerateProgramQrCode () {
      GenerateProgramQrCode(this.addEditForm.id).then(res => {
        this.qrCodePic = res
      })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
    },
    /* *************************** 操作 *************************** */
    // 显示报名二维码
    showQrCode (row) {
      this.addEditForm = row
      this._GenerateProgramQrCode()
      this.print = {
        id: '#printCompletion',
        popTitle: `${this.addEditForm.projectName}-报名二维码`,
        extraCss: '',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      }
      this.qrCodeVisible = true
    },
    // 设置毕业要求正证书类型
    settingCertificate (row) {
      this.addEditForm = row
      this.certificateVisible = true
    },
    // 设置人脸识别间隔 ，单位秒
    settingTime (row, type) {
      this.faceForm = {
        id: row.id,
        liveFaceAttendanceCycle: Math.floor(row.liveFaceAttendanceCycle / 60),
        onlineFaceAttendanceCycle: Math.floor(
          row.onlineFaceAttendanceCycle / 60
        )
      }
      this.faceFormVisible = true
    },
    // 保存人脸识别间隔时长
    saveTimes () {
      let data = {
        id: this.faceForm.id,
        liveFaceAttendanceCycle:
          Number(this.faceForm.liveFaceAttendanceCycle) * 60,
        onlineFaceAttendanceCycle:
          Number(this.faceForm.onlineFaceAttendanceCycle) * 60
      }
      settingFaceAttendanceCycle(data)
        .then(res => {
          this.$message.success('设置成功')
          this.queryList()
          this.faceFormVisible = false
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
    },
    // 设置项目课程和培养方案
    settingCourseSheme (row) {
      this.shemeVisible = true
      this.TrainingProgramsId = row.id
    },
    // 点击项目名称前往详情页面
    goToInformation (row) {
      this.addEditForm = row
      this.programInfoVisible = true
    },
    // 删除
    del (data) {
      let row = data || this.multipleSelection[0]
      this.$confirm(
        `此操作将删除选中数据 【${row.projectName}】， 是否继续？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          deleteTrainingPrograms(row)
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
        .catch()
    },
    // 新增|编辑
    addEdit (row) {
      this.addEditForm = row || {}
      this.addEditVisible = true
    },
    // 设置项目状态
    setState (row) {
      this.addEditForm = row || {}
      this.editStateVisible = true
    },
    editStateSave (data) {
      updateTrainingProgramsStatus(data)
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
    }
  }
}
</script>
