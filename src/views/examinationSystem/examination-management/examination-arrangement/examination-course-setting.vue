<template>
<div>  <!-- 考试安排：设置考场和试卷等 -->
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card>
        <!-- 班级树 -->
        <el-tree :style="style" :data="resourceTree" ref="tree" node-key="id" default-expand-all :expand-on-click-node="false" :render-content="renderContent"></el-tree>
      </el-card>
    </el-col>
    <el-col :span="19">
      <div v-if="currentNode && currentNode.level=='班级'">
        <div>
          <el-button type="warning" size="small" @click="chooseCourse">点击选取课程</el-button>
          <el-tag type="danger" style="color:#f00;margin-left:10px;font-weight:600;">请在【选取课程】后，对每个课程设置相应的【考卷】和【考场】</el-tag>
        </div>
        <div class="t-header-title" v-if="parentNode && currentNode">
          <span v-if="parentNode">所属项目：{{parentNode.label}} </span>
          <span v-if="classId" style="background:#c6e3f7;">所在班级：{{currentNode.label}}</span>
        </div>
        <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="courseName" label="考试科目" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="teacherName" label="录入成绩老师" width="100"></el-table-column>
          <el-table-column prop="strategyName" sortable label="考试时间段" width="400" align="center">
            <template slot-scope="scope">
              <div class="t-flex">
                <el-date-picker style="width:184px" size="mini" v-model="scope.row.examinationBeginTime" type="datetime" placeholder="设置开始时间" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                <span> - </span>
                <el-date-picker style="width:184px" size="mini" v-model="scope.row.examinationEndTime" type="datetime" placeholder="设置截止时间" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="试卷" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="(item,i) of scope.row.examArrangeWithExaminationPapers" :key="i">
                <span v-html="item.examinationPaperName?`${item.examinationPaperName}<br>`: ''"></span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="考场" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="(item,i) of scope.row.examinationPlaceConfig" :key="i">
                考试场地：{{item.examinationPlaceName}} <br/>
                考试人数：{{item.numberOfPeople}} <br/>
                监考老师：{{item.teacherNames}}
              </span>
            </template>
          </el-table-column>
          <el-table-column  fixed="right" label="操作" width="130" align="center">
            <template slot-scope="scope">
              <div style="margin-bottom:5px;"><el-button type="success" style="background-color: #40bb04;" size="mini" @click="drawPaper(scope.row)">① 抽取试卷</el-button></div>
              <div><el-button type="success" style="background-color: #40bb04;" size="mini" @click="examSet(scope.row)">② 设置考场</el-button></div>
              <div><el-button type="text" size="mini" @click.native.prevent="deleteRow(scope.$index, tableData)">删除</el-button></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>
  <div style="margin-top:10px;">
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="save">保存考场安排</el-button>
    <el-button v-if="id" type="primary" size="small" @click="next">上一页</el-button>
  </div>
  <!-- 选取课程：引入模态框类型的穿梭框组件:dataList-所有角色，chooseValue-已分配的角色， -->
  <transfer :visible.sync="showTransfer" :dataList="transferData" :alias="alias" :chooseValue="chooseValue" @saveTransfer="getTransferDate" :title="title"></transfer>
  <!-- 设置考场 -->
  <exam-site :visible.sync="showExamSite" :dataForm="courseFrom" :dataList="examSiteData" @save="saveSiteArrange"></exam-site>
  <!-- 抽取试卷 -->
  <paper-select :visible.sync="showPaper" :dataForm="courseFrom" :dataList="PaperData" @save="savePaper"></paper-select>
</div>
</template>
<script>
import transfer from '@/components/transfer.vue'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import { getTrainingProgramsBindCourse } from '@/server/training-module'
import {
  SaveAssignSubject,
  UpdateArrange,
  getFlagLecturerBycourse
} from '@/server/examination-module'
import examSite from './eaxmimation-site-setting'
import paperSelect from './examination-paper-select'
export default {
  components: {transfer, examSite, paperSelect, pagination},
  props: ['resourceTree', 'id', 'assignSubject'],
  data () {
    return {
      style: '',
      // ----项目班级树
      classId: null,
      currentNode: {},
      parentNode: {},
      // ----选取课程
      showTransfer: false,
      alias: {key: 'id', label: 'label'},
      transferData: [],
      chooseValue: [],
      title: '选取课程',
      pickerOptions: { // 开始时间
        disabledDate (time) {
          let _now = Date.now()
          return time.getTime() < _now - 24 * 3600 * 1000
        }
      },
      // ------课程列表
      pageSizes,
      pageSize,
      total: 0,
      tableData: [],
      isSelectAll: false,
      multipleSelection: [],
      // ------考场设置
      showExamSite: false,
      examSiteData: [],
      courseFrom: {},
      // -------抽取试卷
      showPaper: false,
      PaperData: []
    }
  },
  watch: {
    assignSubject (newVal) {
      if (newVal && JSON.stringify(newVal) !== '{}') {
        this.classId = ''
        this.tableData = []
        this.currentNode = {}
        this.parentNode = {}
        this.examSiteData = []
        this.courseFrom = {}
        this.PaperData = []
        this.style = `max-height:${document.body.clientHeight * 0.7 - 100}px;overflow:scroll;`
        // this.$refs.tree.setCurrentKey(this.assignSubject.classId); // 设置新节点被选中
        // 树节点默认选中
        if (this.assignSubject.classId) {
          let data = {
            id: this.assignSubject.classId,
            label: this.assignSubject.className,
            level: '班级',
            children: null,
            flagQuestion: false
          }
          if (this.resourceTree && this.resourceTree.length > 0 && this.$refs.tree.getNode(data)) {
            this.currentNode = this.$refs.tree.getNode(data).data // 选中节点的数据组
            this.parentNode = this.$refs.tree.getNode(data).parent.data // 选中节点的父节点数据组
            this.$refs.tree.setCurrentNode(this.currentNode)
          }
          this.classId = this.assignSubject.classId
        }
      }
    },
    classId (newVal) {
      this.tableData = []
      this.chooseValue = []
      if (newVal && newVal === this.assignSubject.classId) {
        this.tableData = this.assignSubject.examinationCourseConfig
        if (this.tableData && this.tableData.length > 0) {
          this.tableData.forEach(item => {
            this.$set(item, 'examinationBeginTime', item.examinationBeginTime.replace(/T/, ' '))
            this.$set(item, 'examinationEndTime', item.examinationEndTime.replace(/T/, ' '))
            this.chooseValue.push(item.courseId)
            if (item.examArrangeWithExaminationPapers && item.examArrangeWithExaminationPapers.length > 0) {
              item.examArrangeWithExaminationPapers.forEach(el => {
                el.examinationPaperId = el.constructionExaminationPaperId
                el.examinationPaperName = el.constructionExaminationPaperName
              })
            }
          })
        }
      }
    }
  },
  methods: {
    renderContent (h, { node, data, store }) {
      return (
        <div class="custom-tree-node" style="width: 100%;display: block;text-align: left;" on-click={() => this.getNode(node)}>
          <el-button style="color:#666;font-size:13px;" type="text" title={node.label}>{node.label}</el-button>
        </div>
      )
    },
    // -----------------------------------------查询-----------------------------------
    _getTrainingProgramsBindCourse () { // 获取列表，传递数据给穿梭框
      this.transferData = []
      getTrainingProgramsBindCourse(this.parentNode.id).then(result => {
        this.transferData = result
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
    _getFlagLecturerBycourse (val) {
      let data = {
        classId: this.classId,
        courseId: val.courseId
      }
      getFlagLecturerBycourse(data).then(res => {
        // this.$alert(`课程`)
        // console.log(res)
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // -----------------------------------------操作-----------------------------------
    close () {
      this.$emit('close')
    },
    next () {
      this.$emit('next', 'BasicInfo')
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    chooseCourse () { // 选取课程
      this.showTransfer = true
    },
    getTransferDate (ids) { // 获得已经选择的课程id集合
      let newTable = []
      this.chooseValue = ids
      this.transferData.forEach(item => { // 遍历所有课程数据，将已选择的课程放入到一个新数组中
        if (ids.indexOf(item.id) !== -1) {
          let obj = {
            courseId: item.id,
            courseName: item.label
          }
          newTable.push(obj)
        }
      })
      this.tableData.forEach(item => { // 筛选去除重复数据
        for (let i = newTable.length - 1; i >= 0; i--) {
          let obj = newTable[i]
          if (obj.courseId === item.courseId) {
            newTable.splice(i, 1)
          }
        }
      })
      this.tableData = this.tableData.concat(newTable)
      this.tableData.forEach(item => {
        this._getFlagLecturerBycourse(item)
      })
    },
    drawPaper (row) { // 抽取试卷
      this.courseFrom = row
      this.showPaper = true
    },
    savePaper (data, courseId) { // 获取选择的试卷数据
      this.tableData.forEach(item => {
        if (item.courseId === courseId) {
          this.$set(item, 'examArrangeWithExaminationPapers', data)
        }
      })
    },
    examSet (row) { // 设置考场
      this.courseFrom = row
      this.showExamSite = true
    },
    saveSiteArrange (sites, courseId) { // 获取选择的考场数据
      this.tableData.forEach(item => {
        if (item.courseId === courseId) {
          this.$set(item, 'examinationPlaceConfig', sites)
        }
      })
    },
    /* 选择的班级 */
    getNode (node) {
      this.currentNode = node.data
      if (this.currentNode.level === '班级') {
        this.classId = this.currentNode.id
        this.parentNode = node.parent.data
        this._getTrainingProgramsBindCourse()
      }
    },
    save () { // 考场安排设置
      if (this.tableData.length === 0) {
        this.$alert('请对相应的班级设置课程详细考试安排！')
        return
      }
      for (let i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i]
        if (!item.examinationBeginTime || !item.examinationEndTime) {
          this.$alert(`请设置课程【${item.courseName}】的考试开始时间或结束时间！`)
          return
        }
        if (new Date(item.examinationBeginTime) >= new Date(item.examinationEndTime)) {
          this.$alert(`课程【${item.courseName}】的考试开始时间必须小于结束时间！`)
          return
        }
        if (!item.examArrangeWithExaminationPapers || item.examArrangeWithExaminationPapers.length === 0) {
          this.$alert(`请抽取课程【${item.courseName}】的试卷！`)
          return
        }
        if (!item.examinationPlaceConfig || item.examinationPlaceConfig.length === 0) {
          this.$alert(`请设置课程【${item.courseName}】的考试场地！`)
          return
        }
        for (let j = 0; j < item.examinationPlaceConfig.length; j++) {
          let examPlace = item.examinationPlaceConfig[j]
          if (!examPlace.teacherIds || examPlace.teacherIds.length === 0) {
            this.$alert(`请设置课程【${item.courseName}】- 考场【${examPlace.examinationPlaceName}】的监考老师！`)
            return
          }
          if (examPlace.numberOfPeople < 1) {
            this.$alert(`课程【${item.courseName}】- 考场【${examPlace.examinationPlaceName}】的考试人数不得小于1！`)
            return
          }
        }
      }
      if (this.assignSubject && JSON.stringify(this.assignSubject) !== '{}' && this.assignSubject.id !== '00000000-0000-0000-0000-000000000000') { // 具体安排的id存在，则更新
        let obj = {
          classId: this.classId, // 班级id
          trainingProgramId: this.parentNode.id, // 培训项目id
          examinationCourseConfig: this.tableData
        }
        UpdateArrange(this.assignSubject.id, obj).then(() => {
          this.$message.success('考试安排保存成功！')
          this.close()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      } else { // 否则，创建具体安排
        let obj = {
          classId: this.classId, // 班级id
          trainingProgramId: this.parentNode.id, // 培训项目id
          examinationCourseConfig: this.tableData
        }
        SaveAssignSubject(this.id, obj).then(() => {
          this.$message.success('考试安排保存成功！')
          this.close()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }
    }
  }
}
</script>
