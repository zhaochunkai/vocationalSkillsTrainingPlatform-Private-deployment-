<template>
<div>
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>考勤列表</span>
    </div>
    <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
      <el-form-item label="学期">
        <el-select v-model="conditionForm.SemesterId">
          <el-option v-for="(item,i) of SemesterList" :key="i" :label="item.semesterName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学习项目">
        <el-select v-model="programId">
          <el-option v-for="(item,i) of programs" :key="i" :label="item.projectName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程">
        <el-select v-model="conditionForm.courseId">
          <el-option v-for="(item,i) of courseList" :key="i" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="conditionForm.classId">
          <el-option v-for="(item,i) of classList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form>                              
    <!-- 操作按钮 -->
    <div class="t-operate-buttons">
      <!-- <el-button type="primary" size="mini">导入</el-button> -->
      <!-- <el-button type="info" size="mini">新增</el-button> -->
      <!-- <el-button type="primary" size="mini" @click="del()">删除</el-button> -->
    </div>
    <!-- 表格 -->
    <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="semesterName" label="学年学期"></el-table-column>
      <el-table-column prop="trainingProgramName" sortable label="学习项目"></el-table-column>
      <el-table-column prop="className" sortable label="班级"></el-table-column>
      <el-table-column prop="courseName" sortable label="课程"></el-table-column>
      <el-table-column prop="attendanceDate" sortable label="考勤日期">
        <!-- <template slot-scope="scope">
          {{new Date(scope.row.birthday).toLocaleDateString()}}
        </template> -->
      </el-table-column>
      <el-table-column prop="section" label="节次">
        <template slot-scope="scope">
          <el-button type="text" style="color:#00f" @click="addEdit(scope.row,false)">{{scope.row.pointInTimeName}} 第{{scope.row.section}}节</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="headcount" label="班级总人数"></el-table-column>
      <el-table-column prop="should" label="应到人数"></el-table-column>
      <el-table-column prop="reality" label="实到人数"></el-table-column>
      <el-table-column prop="leave" label="请假人数"></el-table-column>
      <el-table-column prop="beLate" label="迟到人数"></el-table-column>
      <el-table-column prop="absent" label="缺席"></el-table-column>
      <el-table-column prop="leaveEarly" label="早退人数"></el-table-column>
      <el-table-column prop="onTime" label="按时到人数"></el-table-column>
      <el-table-column  fixed="right" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addEdit(scope.row,true)">更新考勤</el-button>
          <!-- <el-button type="text" size="small" @click="del(scope.row)">删除-需要？</el-button> -->
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
<!-- 弹出层：新增/编辑报名信息 -->
<add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @save="addEditSave" :operate="operate"></add-edit>
</div>
</template>
<script>
import {getDefaultSemester} from  '@/server/basic-module.js'
import { 
  getClassList,
  getTrainingProgramsBindCourse,
  getTrainingProgramsList,
} from '@/server/training-module';
import { 
  getAttendanceList
} from '@/server/online-module';
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import addEdit from "./attendance-list-edit.vue" 
export default {
  data() {return {
    pageSizes,
    pageSize,
    SkipCount:0,
    style: '',
    total:0,
    operate:false,
    conditionForm: {},
    tableData: [],
    isSelectAll:false,
    addEditVisible:false,
    addEditForm: {},
    programs: [],
    programId: '',
    courseList: [],
    classList: [],
    SemesterList: [],
  }},
  components: {pagination,addEdit},
  activated() {
		this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getDefaultSemester();
    this._getTrainingProgramsList();
    this.initDataList();
  },
  watch: {
    programId(newVal) {
      if (newVal) {
        this._getTrainingProgramsBindCourse(); // 获取学习项目下的课程
        this._getClassList();   // 获取学习项目下的班级
        this.$set(this.conditionForm,'trainingProgramId',newVal);
      }
    }
  },
  methods: {
    _getDefaultSemester() {
      this.SemesterList = []
      getDefaultSemester().then(result => {
        this.SemesterList.push(result)
      })
    },
    _getTrainingProgramsList() { // 状态为“3-培训中”的项目
      let data = {
				SkipCount: 0, 
				MaxResultCount: 200,
				Status:3 
			};
			getTrainingProgramsList(data).then(result => {
				this.programs=result.items;
			})
    },    
    _getTrainingProgramsBindCourse() { // 根据项目id查询课程
      this.courseList= []
      getTrainingProgramsBindCourse(this.programId).then(result => {
        this.courseList=result
      })
    },
    _getClassList() { // 根据项目id查询班级
      let data = {
        tpId: this.programId
      }
      getClassList(data).then(result => {
        this.classList=result.items;
        
      })
    }, 
    toInfomationPage(row,operate) {  // 查看节次考勤信息
      this.operate=operate;
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
    queryList() {      
      this.initDataList(this.SkipCount, this.pageSize);
    },    
    // 根据项目id获取报名列表
    initDataList(SkipCount = 0, pageSize = this.pageSize) {
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        SemesterId: this.conditionForm.SemesterId,
        ClassId: this.conditionForm.ClassId,
        CourseId: this.conditionForm.CourseId,
        TrainingProgramId: this.conditionForm.TrainingProgramId,
      }
      getAttendanceList(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount;
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
    addEdit(row,operate) {
      this.addEditForm = row || {}
      this.addEditVisible = true
      this.operate=operate;
    },
    addEditSave (data) {
      if (data.id) {
        updateStudentInfo(data).then(result => {
          this.$message.success('保存成功')
          this.queryList()
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
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        }) 
      }
    },
    del(data) {
      let row= data || this.multipleSelection[0];
      // this.$confirm(`此操作将删除选中的数据 【${row.name}】数据， 是否继续？`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      // }).then(() => {                
      //     deleteWarehouse(row).then(() => {
      //         this._getTrainingProgramsTree();
      //     })
      //     this.$message.success('数据删除成功！')
      // }).catch(() => {})
    },
  },
}
</script>
<style lang="less" scoped>

</style>