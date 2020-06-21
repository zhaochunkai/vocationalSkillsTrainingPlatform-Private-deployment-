<template>
  <el-dialog class="t-dialog" title="考勤管理" v-if="visible" :visible="visible" :close-on-click-modal="false" width="70%" @close="close">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="考勤基本信息" name="basicInfo"  v-if="operate">   
        <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="100px" size="small">      
          <el-form-item label="学年学期" prop="semesterName">
            <el-input v-model="form.semesterName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="考勤日期" prop="attendanceTime">
            <div style="display:flex;justify-content: space-between;">
              <div class="t-info-div" style="width:50%;">{{new Date(form.attendanceTime) | formatDate}}</div>
              本学期{{form.attendanceDate}}
            </div>
          </el-form-item>
          <el-form-item label="学习项目">
            <el-input  v-model="form.trainingProgramName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="班级" >
            <el-input  v-model="form.className" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="课程">
            <el-input  v-model="form.courseName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="节次">
            <div class="t-info-div">
              {{form.pointInTimeName}} 第 {{form.section}} 节
            </div>
          </el-form-item>
          <el-form-item label="上课地点">
            <el-input  v-model="form.place" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="任课老师">
            <el-input  v-model="form.teacher" :readonly="true"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align:right">
          <el-button style="margin-bottom:10px;" size="small" @click="close">返 回</el-button>
          <el-button style="margin-bottom:10px;margin-left:10px;" type="primary" size="small" @click="next">下一页</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="考勤明细信息" name="details">
        <div class="t-box-card-header">
          <span>统计信息</span>
        </div>
        <el-row style="padding-bottom:10px;" class="totalList">
          <el-col :span="6">考勤日期：{{new Date(form.attendanceTime) | formatAllDate}} </el-col>
          <el-col :span="6">本学期：{{form.attendanceDate}}</el-col>
          <el-col :span="6">节次：{{form.section}}</el-col>
          <el-col :span="6">学习项目：{{form.trainingProgramName}}</el-col>
          <el-col :span="6">课程：{{form.courseName}}</el-col>
          <el-col :span="6">班级：{{form.className}}</el-col>
          <el-col :span="6">上课地点：{{form.place}}</el-col>
          <el-col :span="6">任课老师：{{form.teacher}}</el-col>
        </el-row>
        <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
          <el-table-column label="班级总人数" align="center" prop="headcount"></el-table-column>
          <el-table-column label="应到" align="center" prop="should"></el-table-column>
          <el-table-column label="实到" align="center" prop="reality"></el-table-column>
          <el-table-column label="请假" align="center" prop="leave"></el-table-column>
          <el-table-column label="迟到" align="center" prop="beLate"></el-table-column>
          <el-table-column label="缺席" align="center" prop="absent"></el-table-column>
          <el-table-column label="早退" align="center" prop="leaveEarly"></el-table-column>
          <el-table-column label="按时到" align="center" prop="onTime"></el-table-column>
        </el-table>
        <div class="t-box-card-header" style="margin-top:1rem;">
          <span>明细信息</span>
        </div>
        <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
          <el-form-item label="姓名或手机号">
            <el-input class="input-append" v-model="conditionForm.nameOrTel"></el-input>
          </el-form-item>
          <el-form-item label="考勤状态">
            <el-select v-model="conditionForm.attendanceStatus">
              <el-option label="缺席" value="Absent"></el-option>
              <el-option label="准时" value="OnTime"></el-option>
              <el-option label="迟到" value="BeLate"></el-option>
              <el-option label="早退" value="LeaveEarly"></el-option>
              <el-option label="请假" value="Leave"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="listData" tooltip-effect="dark" style="width: 100%;">
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column label="姓名" align="center" sortable prop="studentName"></el-table-column>
          <el-table-column label="手机号" align="center"  prop="tel"></el-table-column>
          <el-table-column label="考勤状态" align="center" prop="attendanceStatus"></el-table-column>
          <el-table-column label="考勤方式" align="center" prop="attendanceType"></el-table-column>
          <el-table-column label="操作时间" align="center" prop="attendanceTime" v-if="!operate">
            <template slot-scope="scope" v-if="scope.row.attendanceTime">
              {{new Date(scope.row.attendanceTime) | formatAllDate}}
            </template>
          </el-table-column>
          <el-table-column label="操作人" align="center" prop="executor" v-if="!operate"></el-table-column>         
          <el-table-column  fixed="right" label="操作" width="400" align="center" v-if="operate">
            <template slot-scope="scope">
              <div v-show="scope.row.attendanceStatus=='缺席'">
                <!-- <el-button type="primary" size="mini" @click="setStatus(scope.row,'Absent')">缺席</el-button> -->
                <el-button type="primary" size="mini" @click="setStatus(scope.row,'BeLate')">迟到</el-button>
                <el-button type="primary" size="mini" @click="setStatus(scope.row,'LeaveEarly')">早退</el-button>
                <el-button type="primary" size="mini" @click="setStatus(scope.row,'Leave')">请假</el-button>
                <el-button type="success" size="mini" @click="setStatus(scope.row,'OnTime')">准时</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div class="t-operate-footer">
            <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div>
        <div style="text-align:right">
          <el-button style="margin-bottom:10px;" size="small" @click="close">返 回</el-button>
        </div>

      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import { getAttendanceById,getAttendanceStudentListById,AttendanceStatus } from '@/server/online-module';
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
export default {
  props: ['dataForm', 'visible' , 'operate'],
  data () {
    return {
      form: {},
      fileList: [],       
      rules: {},
      activeName: 'details',
      conditionForm: {},
      tableData: [],
      listData: [
        {name: 'weerer'}
      ],
      pageSizes,
      pageSize,
		  SkipCount:0,
      total:0,
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.activeName='details'
        this.id=this.dataForm.id;
        if (this.id) {
          this._getAttendanceById();
          this.initDataList();
        }
      }
    },
  },
  components: {pagination},
  activated() {    
    let date=new Date();
    this.$set(this.form,'date',date.toLocaleDateString()); // 默认获取当前日期
  },
  methods: {
    _getAttendanceById() {
      this.tableData= []
      getAttendanceById(this.id).then(result => {
        this.form = Object.assign({}, result)
        this.tableData.push(result)
      })
    },
    /* 接收改变后每页多少条*/
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
      this.initDataList(this.SkipCount, this.pageSize);
    },
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        id: this.id
      }
      if (this.conditionForm.nameOrTel) {
        this.$set(data, 'nameOrTel', this.conditionForm.nameOrTel)
      }
      if (this.conditionForm.attendanceStatus) {
        this.$set(data, 'attendanceStatus', this.conditionForm.attendanceStatus)
      }
      getAttendanceStudentListById(data).then(result => {
        this.listData=result.items;
        this.total = result.totalCount
      })
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    next() {
      this.activeName='details';
    },
    close () {
      this.$emit('update:visible', false)
    },
    setStatus(row,status) {  // 设置学生考勤状态。注：只能操作未考勤的学生 
      let data={
        id: this.id,
        studentId:row.studentId,
        attendanceStatus:status        
      }
      AttendanceStatus(data).then(() => {
        this.$message.success(`设置学生 【${row.studentName}】 考勤状态成功！`);
        this.queryList()
      })
    },
  }
}
</script>
<style lang="less" scoped>
.t-box-card-header{
  line-height:40px;
  border-bottom:1px solid #ddd;
  margin-bottom:20px;
  span{
    padding:11px 100px 12px;
    border:1px solid #ddd;
    background: #ddd;
    border-bottom:none;
    font-weight: 600;
  }
}
.infomation{
  span{
    margin-right:50px;
  }
}
/deep/.el-form .el-form-item {
    max-width: 600px;
}
.t-form-block{
  /deep/.el-input__inner,
  /deep/.el-textarea__inner{
    border:none;
    background: #eee;
  }
  /deep/.el-input.is-disabled .el-input__inner {
    background-color: #eee;
    color: #666;
  }
}
.t-operate-footer{
  margin-bottom:1rem;
}
.totalList{
  line-height:2rem;
}
</style>
