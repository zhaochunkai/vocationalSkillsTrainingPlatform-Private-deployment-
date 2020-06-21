<template>
<el-dialog class="t-dialog" :title="dataForm.id?'编辑评价计划': '新增评价计划'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="80%" @close="close">
  <el-tabs v-model="activeName">
    <el-tab-pane label="评价计划信息" name="first">
      <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="评价名称" prop="evaluationName">
          <el-input v-model="form.evaluationName"></el-input>
        </el-form-item>
        <el-form-item label="评价类型" prop="evaluationType">
          <el-radio-group v-model="form.evaluationType" :disabled="dataForm.id?true:false">
            <el-radio v-for="(item,i) of evaluationTypeLists" :key="i" :label="item.type">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评价周期" prop="evaluationPeriod">
          <el-radio-group v-model="form.evaluationPeriod">
            <!-- <el-radio label="Semester">学期</el-radio> -->
            <el-radio label="Date">日期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择日期" v-show="form.evaluationPeriod== 'Date'">
          <el-date-picker
            v-model="evaluationPeriodDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="学习项目" prop="trainingProgramsId">
          <el-select v-model="form.trainingProgramsId" filterable :disabled="dataForm.id?true:false"
            remote
            reserve-keyword
            :remote-method="_getTrainingProgramsPullDown"
          >
            <el-option v-for="(item,i) of programeList" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择班级" prop="classId" :rules="classRule" v-if="form.evaluationType === 'StudentEvaluationTeacher' || form.evaluationType ==='TeacherEvaluationStudent'">
          <el-select v-model="form.classId" clearable :disabled="dataForm.id?true:false">
            <el-option v-for="(item,i) of classLists" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描 述" prop="description">
          <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="设置评价指标" name="second" v-if="showSecond">
      <el-row :gutter="120">
        <el-col :span="12">
          <el-card>
            <div slot="header" class="t-box-card-header">
              <span>未分配指标</span>
            </div>
            <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="mini">
              <el-form-item label="名称">
                <el-input class="input-append" v-model="conditionForm.IndicatorName"></el-input>
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="conditionForm.IndicatorType">
                  <el-option label="全部" value="All"></el-option>
                  <el-option v-for="(item,i) of evaluationTypeLists" :key="i" :label="item.name+'指标'" :value="item.type"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="queryList">查询</el-button>
              </el-form-item>
            </el-form>
            <!-- 表格 -->
            <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column prop="indicatorName" label="指标名称" show-overflow-tooltip></el-table-column>
              <el-table-column prop="indicatorTypeName" label="指标类型" width="140" align="center"></el-table-column>
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
        <el-col :span="12">
          <el-card>
            <div slot="header" class="t-box-card-header">
              <span>已分配指标</span>
            </div>
            <!-- 表格 -->
            <el-table class="t-table-list"  ref="multipleTableIndicator" stripe size="small" :data="tableDataIndicator" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChangeIndicator">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column prop="indicatorName" label="指标名称" show-overflow-tooltip></el-table-column>
              <el-table-column prop="indicatorTypeName" label="指标类型" width="140" align="center"></el-table-column>
            </el-table>
            <!-- 全选 -->
            <div class="t-batch-operate">
              <el-checkbox v-model="isSelectAllIndicator" class="t-select-all" @change="selectAllIndicator()">全选</el-checkbox>
            </div>
          </el-card>
        </el-col>
        <div><el-button class="divide" type="success" size="medium" @click="DivideIndicator">分配 &gt;</el-button></div>
        <div><el-button class="Undivide" type="success" size="medium" @click="UnDivideIndicator">&lt; 解绑</el-button></div>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="设置评价者" name="third" v-if="showSecond && form.evaluationType !== 'ProjectEvaluation' && form.evaluationType !== 'StudentEvaluationTeacher'">
      <!-- 选取评价者|被评价者 -->
      <commentators-setting v-if="form.evaluationType !== 'TeacherMutualEvaluation'" :commentatorData="commentatorData" :commentatorChooseData="commentatorChooseData" :dataForm="form" @getProfessional="getProfessional"></commentators-setting>
      <tree-transfer v-else TreeType="user" :alias="alias" :chooseValue="chooseValue" isMultiple="true" @saveTransfer="getNewTransfer"></tree-transfer>
    </el-tab-pane>
    <el-tab-pane label="设置被考评者" name="fourth" v-if="showSecond && form.evaluationType !== 'ProjectEvaluation' && form.evaluationType !== 'TeacherEvaluationStudent'">
      <!-- 选取评价者|被评价者 -->
      <commentators-setting :commentatorData="commentatorData" :commentatorChooseData="commentatorChooseData" :dataForm="form" @getProfessional="getProfessional"></commentators-setting>
    </el-tab-pane>
  </el-tabs>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="nextStep(-1)" v-show="activeName !== 'first'">上一页</el-button>
    <span v-if="form.evaluationType === 'ProjectEvaluation'">
      <el-button type="primary" size="small" @click="nextStep(1)" v-if="activeName !== 'second'">下一页</el-button>
    </span>
    <span v-else>
      <el-button type="primary" size="small" @click="nextStep(1)" v-if="form.evaluationType === 'TeacherEvaluationStudent' && activeName !== 'third'">下一页</el-button>
      <el-button type="primary" size="small" @click="nextStep(1)" v-if="form.evaluationType !== 'TeacherEvaluationStudent' && activeName !== 'fourth'">下一页</el-button>
    </span>
    <el-button type="primary" size="small" @click="save" v-if="dataForm.id || showSecond">保 存</el-button>
  </span>
</el-dialog>
</template>
<script>
// import { getIdentityUserById } from '@/server/identity-module'
import { getTrainingProgramsPullDown, getClassList } from '@/server/training-module'
import { getEvaluationPlanById, getEvaluationIndicator, createEvaluationPlan, updateEvaluationPlan, getEvaluationNotPlanTeacherOrganizeInfo, getEvaluationTeacherListByClassId, getEvaluationTeacherListByTpId, getPlanIndicatorList, getEvaluationNotPlanIndicator, getPlanCommentByList } from '@/server/online-module'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import commentatorsSetting from './evaluating-commentators-setting'
import treeTransfer from '@/components/tree-transfer'
export default {
  props: ['dataForm', 'visible'],
  components: {commentatorsSetting, pagination, treeTransfer},
  data () {
    return {
      activeName: 'first',
      nextBtns: ['first', 'second', 'third', 'fourth'],
      showSecond: false,
      // // 教师|班级列表
      commentatorData: [],
      // 选择机构老师
      alias: {key: 'id', label: 'name'}, // 穿梭框默认选中列表，由alias.key组成的数组
      chooseValue: [],
      /* ------------------------日期选择--------------------------- */
      pickerOptions: {
        disabledDate (time) {
          let _now = Date.now()
          return time.getTime() < _now - 3600 * 1000 * 24
        },
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      evaluationPeriodDate: '',
      /* ------------------------评价计划--------------------------- */
      form: {},
      rules: {
        evaluationName: [
          { required: true, message: '请输入评价名称', trigger: 'blur' },
          { max: 30, message: '字符长度必须小于30', trigger: 'blur' }
        ],
        evaluationType: { required: true, message: '请选择评价类型', trigger: 'blur' },
        evaluationPeriod: { required: true, message: '请选择评价周期', trigger: 'blur' },
        trainingProgramsId: { required: true, message: '请选择项目', trigger: 'blur' }
      },
      evaluationTypeLists: [
        {type: 'ProjectEvaluation', name: '项目评价'},
        {type: 'StudentEvaluationTeacher', name: '学生评价教师'},
        {type: 'TeacherEvaluationStudent', name: '教师评价学生'},
        {type: 'TeacherMutualEvaluation', name: '教师互评'}
      ],
      classRule: { required: true, message: '请选择班级', trigger: 'blur' },
      semesterList: {},
      programeList: [],
      projectName: '',
      classLists: [],
      /* ------------------------未分配--------------------------- */
      conditionForm: {
        IndicatorType: 'All'
      },
      isSelectAll: false,
      tableData: [],
      multipleSelection: [],
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      /* ------------------------已分配--------------------------- */
      isSelectAllIndicator: false,
      tableDataIndicator: [],
      multipleSelectionIndicator: [],
      /* ------------------------评价者------------------------ */
      checkList: [],
      evaluatorData: [],
      evaluatorList: [],
      attachedName: '',
      /* ------------------------项目或班级相关评论/被评论者------------------------ */
      ProfessionalCommentatorsVisible: false,
      professionForm: {},
      commentatorChooseData: [],
      Commentator: [], // 评价者
      BeCommentator: [] // 被评价者
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this._getTrainingProgramsPullDown() // 获取状态为“3-培训中”培训项目
        this.tableDataIndicator = [] // 已分配指标
        this.BeCommentator = []
        this.Commentator = []
        this.commentatorChooseData = []
        this.commentatorData = [] // 人员表格
        this.form = {}
        this.showSecond = false
        this.activeName = 'first'
        this.evaluationPeriodDate = ''
        this.$set(this.form, 'evaluationType', 'ProjectEvaluation')
        this.$set(this.form, 'evaluationPeriod', 'Date')
        if (this.dataForm.id) {
          this._getEvaluationPlanById()
          // 获取评价计划的指标 二选一
          this._getPlanIndicatorList()
          // 未设置评价计划的指标列表
          this._getEvaluationNotPlanIndicator()
          this.activeName = 'second'
          // 评价者|被评价者
          if (this.dataForm.evaluationType === 'TeacherMutualEvaluation') {
            this._getPlanCommentByList()
            this._getPlanBeCommentByList()
          } else if (this.dataForm.evaluationType === 'TeacherEvaluationStudent') {
            this._getPlanCommentByList()
          } else {
            this._getPlanBeCommentByList()
          }
        } else {
          this.initDataListAll() // 获取所有的指标列表
        }
      }
    },
    'form.trainingProgramsId' (newVal) {
      if (newVal) {
        if (!this.dataForm.id) {
          this.$set(this.form, 'classId', null)
        }
        this.BeCommentator = []
        this.Commentator = []
        this.classLists = []
        this.commentatorData = [] // 人员表格
        this.programeList.forEach(item => {
          if (item.id === newVal) {
            this.projectName = item.name
          }
        })
        this._getClassList()
        if (this.form.evaluationType === 'TeacherMutualEvaluation') {
          this._getEvaluationTeacherListByTpId()
        }
      }
    },
    'form.classId' (newVal) {
      if (newVal) {
        this.commentatorData = [] // 人员表格
        this._getEvaluationTeacherListByClassId()
      }
    },
    'form.evaluationType' (newVal) {
      if (newVal) {
        this.BeCommentator = []
        this.Commentator = []
      }
    },
    'evaluationPeriodDate' (newVal) {
      if (newVal) {
        this.$set(this.form, 'startDate', newVal[0])
        this.$set(this.form, 'endDate', newVal[1])
      }
    }
  },
  methods: {
    /* ********************************************** 查询 ********************************************** */
    // 获取被考评人
    _getPlanBeCommentByList () {
      let data = {
        id: this.dataForm.id,
        isBeCommentator: true
      }
      getPlanCommentByList(data).then(res => {
        this.commentatorChooseData = res
        console.log('被考评人')
        this.BeCommentator = res
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 获取考评人
    _getPlanCommentByList () {
      let data = {
        id: this.dataForm.id,
        isBeCommentator: false
      }
      getPlanCommentByList(data).then(res => {
        if (this.form.evaluationType === 'TeacherMutualEvaluation') {
          // 获取教师互评的考评人-穿梭框默认值
          this.chooseValue = []
          res.forEach(item => {
            this.chooseValue.push(item.teacherId)
          })
        } else {
          this.commentatorChooseData = res
        }
        this.Commentator = res
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 根据班级id 获取教师列表
    _getEvaluationTeacherListByClassId () {
      getEvaluationTeacherListByClassId(this.form.classId).then(res => {
        this.commentatorData = res
        this.commentatorChooseData.forEach(el => {
          this.commentatorData.forEach((item, i) => {
            if (el.teacherId === item.id) {
              this.commentatorData.splice(i, 1)
            }
          })
        })
      })
    },
    // 根据项目id 获取教师列表
    _getEvaluationTeacherListByTpId () {
      getEvaluationTeacherListByTpId(this.form.trainingProgramsId).then(res => {
        this.commentatorData = res
        this.commentatorChooseData.forEach(el => {
          this.commentatorData.forEach((item, i) => {
            if (el.teacherId === item.id) {
              this.commentatorData.splice(i, 1)
            }
          })
        })
      })
    },
    // 获取状态为“3-培训中”培训项目
    _getTrainingProgramsPullDown (query) {
      let data = {
        name: query,
        status: '3'
      }
      getTrainingProgramsPullDown(data).then(res => {
        this.programeList = res
      })
    },
    // 获取有排课的班级列表
    _getEvaluationNotPlanTeacherOrganizeInfo () {
      getEvaluationNotPlanTeacherOrganizeInfo(this.form.trainingProgramsId).then(result => {
        this.classLists = result
      })
    },
    _getClassList () {
      let data = {
        tpId: this.form.trainingProgramsId
      }
      getClassList(data).then(result => {
        this.classLists = result.items
      })
    },
    // 获取评价计划详情
    _getEvaluationPlanById () {
      getEvaluationPlanById(this.dataForm.id).then(result => {
        this.showSecond = true
        this.form = Object.assign({}, result)
        this.$set(this.form, 'evaluationPeriod', 'Date')
        let startDate = new Date(this.form.startDate)
        let endDate = new Date(this.form.endDate)
        this.evaluationPeriodDate = [startDate, endDate]
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 获取评价计划的指标-已分配的评价指标
    _getPlanIndicatorList () {
      getPlanIndicatorList(this.dataForm.id).then(res => {
        this.tableDataIndicator = res
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 未设置评价计划的指标列表
    _getEvaluationNotPlanIndicator (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        IndicatorName: this.conditionForm.IndicatorName, // 指标名称
        IndicatorType: this.conditionForm.IndicatorType, // 指标类型
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        EvaluationPlanId: this.dataForm.id // 评价计划id
      }
      getEvaluationNotPlanIndicator(data).then(res => {
        this.tableData = res.items
        this.total = res.totalCount
      })
    },
    // 初始化：根据获取指标列表
    initDataListAll (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        IndicatorName: this.conditionForm.IndicatorName,
        IndicatorType: this.conditionForm.IndicatorType
      }
      getEvaluationIndicator(data).then(result => {
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
    // 全选
    selectAll () {
      this.$refs.multipleTable.toggleAllSelection()
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.isSelectAll = this.tableData.length === this.multipleSelection.length // 判断是否是全选
    },
    // 接收改变后每页多少条
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      if (this.dataForm.id) {
        // 未设置评价计划的指标列表
        this._getEvaluationNotPlanIndicator(SkipCount, pageSize)
      } else {
        this.initDataListAll(SkipCount, pageSize)
      }
    },
    // 接收当前页数
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      if (this.dataForm.id) {
        // 未设置评价计划的指标列表
        this._getEvaluationNotPlanIndicator(SkipCount, pageSize)
      } else {
        this.initDataListAll(SkipCount, pageSize)
      }
    },
    queryList () {
      if (this.dataForm.id) {
        // 未设置评价计划的指标列表
        this._getEvaluationNotPlanIndicator(this.SkipCount, this.pageSize)
      } else {
        this.initDataListAll(this.SkipCount, this.pageSize)
      }
    },
    /* ---------------------------------- 已选择的指标列表 ---------------------------------- */
    // 全选
    toggleSelectionIndicator (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTableIndicator.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTableIndicator.clearSelection()
      }
    },
    // 全选
    selectAllIndicator  () {
      this.$refs.multipleTableIndicator.toggleAllSelection()
    },
    // 多选
    handleSelectionChangeIndicator (val) {
      this.multipleSelectionIndicator = val
      // 判断是否是全选
      this.isSelectAllIndicator = this.tableDataIndicator.length === this.multipleSelectionIndicator.length
    },
    /* ********************************************** 操作 ********************************************** */
    // 下一步
    nextStep (num) {
      let indexNum = this.nextBtns.indexOf(this.activeName)
      this.nextBtns = ['first', 'second', 'third', 'fourth']
      if (this.form.evaluationType === 'StudentEvaluationTeacher') {
        this.nextBtns = ['first', 'second', 'fourth']
      }
      this.showSecond = false
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$alert('请完成评价计划信息填写！')
          this.showSecond = false
          this.activeName = 'first'
          return
        } else {
          this.showSecond = true
          this.activeName = this.nextBtns[indexNum + num]
        }
      })
    },
    // 解除绑定指标
    UnDivideIndicator () {
      if (this.multipleSelectionIndicator.length === 0) {
        this.$message.warning(`请选择需要解除绑定的指标！`)
        return
      }
      this.multipleSelectionIndicator.forEach(item => {
        this.tableDataIndicator.forEach((el, i) => {
          if (el.id === item.id) {
            this.tableDataIndicator.splice(i, 1)
            this.tableData.unshift(item)
          }
        })
      })
    },
    // 绑定指标
    DivideIndicator () {
      let add = this.multipleSelection // 待新增的数据
      if (add.length === 0) {
        this.$message.warning(`请选择要分配的指标！`)
        return
      }
      if (this.tableDataIndicator.length === 0) {
        this.tableDataIndicator = JSON.parse(JSON.stringify(add))
      } else {
        let selectedIds = []
        this.tableDataIndicator.forEach(el => {
          selectedIds.push(el.id)
        })
        add.forEach(item => {
          if (selectedIds.indexOf(item.id) === -1) {
            this.tableDataIndicator.push(item)
          }
        })
      }
      this.tableDataIndicator.forEach(el => {
        this.tableData.forEach((item, i) => {
          if (el.id === item.id) {
            this.tableData.splice(i, 1)
          }
        })
      })
    },
    // 选择机构的多个老师
    getNewTransfer (data) {
      this.Commentator = []
      data.forEach(item => {
        let obj = {
          teacherId: item,
          commentatorType: 'Teacher',
          isBeCommentator: false
        }
        this.Commentator.push(obj) // 评论者
      })
    },
    // 获取选取的人员数据
    getProfessional (dataList) {
      if (this.form.evaluationType === 'TeacherEvaluationStudent') {
        // 评论者
        this.Commentator = []
        dataList.forEach(item => {
          let obj = {
            teacherId: item.id,
            commentatorType: 'Teacher',
            isBeCommentator: false
          }
          this.Commentator.push(obj) // 评论者
        })
        // 被评人
        this.BeCommentator = [{
          classId: this.form.classId,
          commentatorType: 'Student',
          isBeCommentator: true
        }]
      } else {
        // 评论者
        if (this.form.evaluationType === 'StudentEvaluationTeacher') {
          this.Commentator = [{
            classId: this.form.classId,
            commentatorType: 'Student',
            isBeCommentator: false
          }]
        }
        // 被评人
        this.BeCommentator = []
        dataList.forEach(item => {
          let obj = {
            teacherId: item.id,
            commentatorType: 'Teacher',
            isBeCommentator: true
          }
          this.BeCommentator.push(obj)
        })
      }
    },
    // 评价计划保存
    save () {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$alert('请检查基本信息是否填写正确')
          this.activeName = 'first'
          return
        }
      })
      if (this.tableDataIndicator.length === 0) {
        this.$alert('请选择评价指标！')
        this.activeName = 'second'
        return
      }
      if (this.form.evaluationType !== 'ProjectEvaluation') {
        if (this.BeCommentator.concat(this.Commentator).length === 0) {
          this.$alert('请设置评价者 或 被考评者！')
          return
        }
      }
      if (this.form.evaluationType === 'ProjectEvaluation' || this.form.evaluationType === 'TeacherMutualEvaluation') {
        this.$set(this.form, 'classId', 0)
      }
      let indicators = []
      this.tableDataIndicator.forEach(item => {
        let obj = {
          evaluationIndicatorId: item.id
        }
        indicators.push(obj)
      })
      this.$set(this.form, 'indicators', indicators) // 指标
      this.$set(this.form, 'commentators', this.BeCommentator.concat(this.Commentator)) // 评价者或被评价者
      if (this.form.id) {
        updateEvaluationPlan(this.form).then(() => {
          this.$message.success('修改成功！')
          this.$emit('updateList')
          this.close()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      } else {
        createEvaluationPlan(this.form).then(() => {
          this.$message.success('保存成功！')
          this.$emit('updateList')
          this.close()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }
    },
    handleClick (tab, event) {
      this.next(this.activeName)
    },
    close  () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
.dateGroup{
  display: flex;
  justify-content: space-between;
  border-bottom: none;
  padding:0;
  margin-bottom: 0;
  .datespan{
    padding: 0 5px;
  }
}
/deep/.el-dialog {
  max-width: 1200px;
}
/deep/.el-card__header{
  color:#303030;
  background:#ddd;
  font-weight: 600;
}
/deep/.el-form .el-form-item {
  max-width: 700px;
}
.Undivide,
.divide{
  position: absolute;
  top:20%;
  left:50%;
  margin-left:-43px;
}
.divide{
  margin-top:-40px;
}
.Undivide{
  margin-top:10px;
}
</style>
