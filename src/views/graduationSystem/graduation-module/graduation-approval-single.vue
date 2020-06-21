<template>
<el-dialog class="t-dialog" v-if="visible" title="毕业审批" :visible="visible" :close-on-click-modal="false" width="80%" @close="close" >
  <!-- 单个学生审批 -->
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="approval">审 批</el-button>
  </div>
  <!-- 学生基本信息  -->
  <div class="t-header-title">
    <span>学生基本信息</span>
  </div>
  <!-- 表格 -->
  <el-table class="t-table-list" ref="multipleTable" border size="small" :data="userInfo.userList" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column prop="idCard" sortable label="准考证号" show-overflow-tooltip></el-table-column>
    <el-table-column prop="idCard" label="证件号" ></el-table-column>
    <el-table-column prop="studentName" label="姓名" width="100"></el-table-column>
    <el-table-column prop="projectName" label="学习项目"></el-table-column>
    <el-table-column prop="className" label="班级"></el-table-column>
    <el-table-column prop="sex" label="性别" width="100">
      <template slot-scope="scope">
        {{scope.row.sex=='1' ? '男' : '女'}}
      </template>
    </el-table-column>
    <el-table-column prop="education" label="学历" width="170">
      <template slot-scope="scope">
        <el-select v-model="scope.row.education" disabled size="small">
          <el-option v-for="(item,i) of educationList" :key="i" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="tel" label="联系电话" width="100"></el-table-column>
  </el-table>
  <!-- 毕业判定项目 -->
  <div class="t-header-title">
    <span>毕业判定项目</span>
  </div>
  <el-table class="t-table-list" ref="multipleTable" border size="small" :data="userInfo.graduationList" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column type="selection" width="55"> </el-table-column>
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <!-- <el-table-column prop="institution" sortable label="判定项目" show-overflow-tooltip></el-table-column> -->
    <el-table-column prop="title" label="标准"></el-table-column>
    <el-table-column prop="requirements" label="达标要求"></el-table-column>
    <el-table-column prop="state" label="达标状态" width="80"></el-table-column>
    <!-- <el-table-column prop="notPassReason" label="未通过原因" width="100"></el-table-column>
    <el-table-column prop="passStateModificationReason" label="修改原因" width="100"></el-table-column> -->
    <el-table-column  fixed="right" label="操作" width="220" align="center">
      <template slot-scope="scope">
        <!-- <el-button type="primary" size="small" @click="update(scope.row)">修改达标状态</el-button> -->
        <el-button type="primary" v-if="scope.row.isLook" size="small" @click="privew(scope.row)">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 审批 -->
  <el-dialog width="30%" title="审批" :visible.sync="approvalVisible" append-to-body>
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="110px" size="small">
      <el-form-item label="审批意见" prop="approveOpinion">
        <el-input v-model="form.approveOpinion" type="textarea" ></el-input>
      </el-form-item>
      <el-form-item label="毕业判定结果" prop="result">
        <el-select v-model="form.result" filterable clearable>
          <el-option v-for="(item,i) of statusList" :key="i" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button size="small" @click="approvalVisible=false">关 闭</el-button>
        <el-button type="primary" size="small" @click="saveAproval">保 存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!-- 毕业判定项目查看 -->
  <el-dialog width="80%" append-to-body :visible.sync="ResultsViewVisible">
    <span slot="title" class="dialog-footer">
      <span style="color: #666;">{{dataForm.studentName}}-成绩查看</span>
    </span>
    <div class='header'>
      <div>培训项目：{{gridData.projectName}}</div>
      <div style="margin:0 30px;">国考成绩总分：{{gridData.nationalExamScore}}</div>
      <div>培训成绩总分：{{gridData.totalTrainingScore}}</div>
    </div>
    <el-table :data="gridData.listData" border>
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column property="courseName" label="课程"></el-table-column>
      <el-table-column property="academicYearName" label="学年学期"></el-table-column>
      <el-table-column property="teachingWay" label="授课方式">
        <template slot-scope="scope">
            <p v-for="item in teachingMethod" :key="item.code">
              {{scope.row.teachingWay == item.code ? item.name : ''}}
            </p>
        </template>
      </el-table-column>
      <el-table-column property="score" label="成绩"></el-table-column>
      <el-table-column property="nature" label="成绩性质"></el-table-column>
      <el-table-column property="passMark" label="达标成绩"></el-table-column>
      <el-table-column property="isQualified" label="状态"></el-table-column>
    </el-table>
  </el-dialog>
</el-dialog>
</template>
<script>
import { getGraduationRecordById, updateGraduationRecordApprove, getIndividualTestInfo } from '@/server/examination-module'
import {
  getStudentBasicInfoById
} from '@/server/training-module'
export default {
  props: ['visible', 'educationList', 'teachingMethod', 'dataForm', 'userInfo'],
  data () {
    return {
      // ------------------------------学生基本信息
      studentInfo: [],
      tableData: [],
      // -----达标状态
      statusVisible: false,
      ResultsViewVisible: false,
      passForm: {},
      passRules: {
        reason: [{ required: true, message: '请输入修改原因', trigger: 'blur' }],
        pass: [{ required: true, message: '请输入选择达标状态', trigger: 'blur' }]
      },
      // -----审批
      approvalVisible: false,
      form: {},
      statusList: [{'name': '毕业', 'code': '0'}, {'name': '结业', 'code': '1'}, {'name': '肄业', 'code': '2'}, {'name': '推迟毕业', 'code': '3'}, {'name': '离校', 'code': '4'}],
      rules: {
        approveOpinion: [{ required: true, message: '请输入审批意见', trigger: 'blur' }],
        result: [{ required: true, message: '请输入选择判定结果', trigger: 'blur' }]
      },
      gridData: []
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.passForm = {}
        this.form = {}
        if (this.dataForm.id) {
          this._getGraduationRecordById()
        }
        if (this.dataForm.studentId) {
          // this._getStudentBasicInfoById()
        }
      }
    }
  },
  methods: {
    // ----------------------------------------查询-----------------------------------------
    _getGraduationRecordById () {
      this.tableData = []
      getGraduationRecordById(this.dataForm.id).then(result => {
        this.tableData.push(result)
      })
    },
    _getStudentBasicInfoById () {
      this.studentInfo = []
      let data = {
        id: this.dataForm.studentId,
        trainingProgramsId: this.dataForm.trainingProgramsId
      }
      getStudentBasicInfoById(data).then(result => {
        this.studentInfo.push(result)
      })
    },
    // ----------------------------------------操作-----------------------------------------
    privew () {
      getIndividualTestInfo({
        tpId: this.dataForm.projectNodeId,
        classId: this.dataForm.classId,
        studentId: this.dataForm.studentId
      }).then(res => {
        this.ResultsViewVisible = true
        this.gridData = res
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    approval () {
      this.approvalVisible = true
    },
    saveAproval () { // 审批
      this.$refs.form.validate((valid) => {
        if (!valid) return
        updateGraduationRecordApprove({
          'StudentIdList': [this.dataForm.studentId],
          'Opinion': this.form.approveOpinion,
          'Result': this.form.result,
          'ClassId': this.dataForm.classId,
          'TrainingProgramId': this.dataForm.projectNodeId
        }).then((res) => {
          this.$alert('审批成功！')
          this.approvalVisible = false
          this.close()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      })
    },
    close () {
      this.$emit('initialData')
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-form .el-form-item {
  max-width: 100%;
}
/deep/.el-input.is-disabled .el-input__inner{
  color:#666;
  background-color: #fff;
  border-color: #fff;
}
/deep/.el-select .el-input .el-select__caret {
  color: #fff;
}
.header{
  width: 100%;
  height: 30px;
  display: flex;
}
</style>
