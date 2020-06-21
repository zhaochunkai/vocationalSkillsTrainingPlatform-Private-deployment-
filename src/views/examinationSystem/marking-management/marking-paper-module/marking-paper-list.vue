
<template>
<div>
  <!-- 阅卷列表 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>阅卷列表</span>
    </div>
    <!-- 查询 -->
    <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
      <el-form-item label="考试名称">
        <el-input class="input-append" v-model="conditionForm.ExamName" placeholder="请输入试卷名称"></el-input>	
      </el-form-item>
      <el-form-item label="学年" prop="AcademicYear">
        <el-select v-model="conditionForm.AcademicYearId" filterable clearable placeholder="请选择学年">
          <el-option v-for="(item,i) of AcademicYearData" :key="i" :label="item.academicYearName" :value="item.id"></el-option>
        </el-select>
      </el-form-item> 
      <el-form-item label="学期" prop="SemesterId" v-if="conditionForm.AcademicYearId">
        <el-select v-model="conditionForm.courseId" filterable clearable>
          <el-option v-for="(item,i) of SemesterList" :key="i" :label="item.semesterName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试类别">
        <el-select v-model="conditionForm.ExaminationType" clearable>
          <el-option v-for="(item,i) of ExaminationType" :key="i" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form>        
    <!-- 表格 -->
    <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="examName" sortable label="考试名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.examName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="examinationTypeName" label="考试类别" width="80" align="center"></el-table-column>
      <el-table-column prop="methodOfExaminationName" label="考试方式" width="80" align="center"></el-table-column>
      <el-table-column prop="examinationPaperName" sortable label="试卷名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" style="color:#00f" @click="toPaperPage(scope.row)">{{scope.row.examinationPaperName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="学年学期" width="180">
        <template slot-scope="scope">
          {{scope.row.academicYear}} {{scope.row.semesterId}}
        </template>
      </el-table-column>
      <el-table-column prop="sponsorUnitName" label="考试主管单位" width="200"></el-table-column>
      <el-table-column prop="examinationStatusName" label="状态" width="70" align="center"></el-table-column>
      <el-table-column  fixed="right" label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewDetail(scope.row)">查看详情</el-button>
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
    <!-- 具体考试安排信息 -->
    <arrgent-info :dataForm="editForm" :visible.sync="arrangeInfoVisible"></arrgent-info>
  </el-card>
</div>
</template>
<script>
import { getAcademicYearSpinnerData,getSemesterSpinnerData } from '@/server/basic-module';
import { getExaminationArrange } from '@/server/examination-module';
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import arrgentInfo from '../../examination-management/examination-arrangement-infomation' // 考试安排详细信息
export default {
  components: { pagination,arrgentInfo },
  data() {
    return {
      style: '',
      conditionForm: {},
      // -------------表格------------
      pageSizes,
      pageSize,
		  SkipCount:0,
      total:0,
      tableData: [],
      isSelectAll:false,
      multipleSelection: [],
      // -------------检索------------ 
      AcademicYearData: [],
      SemesterList: [],
      ExaminationType: [
        {name: '全部',type: 'All'},
        {name: '模拟考试',type: 'Simulation'},
        {name: '正式考试',type: 'Official'}
      ],
      // -------------编辑------------
      dataForm: {},
      viewDetailVisible:false,
      // -------------考试安排信息------------
      editForm: {},
      arrangeInfoVisible:false,
    }
  },
  watch: {
    'conditionForm.AcademicYearId'(newVal) {
      if (newVal) {
        this._getSemesterSpinnerData(); // 根据学年获取下属学期
      }
    }
  },
  activated() {
		this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getAcademicYearSpinnerData();
    this.initialData();
  },
  methods: {
    // -----------------------------------------查询-----------------------------------     
    _getAcademicYearSpinnerData() { // 获取学年下拉框数据
      this.AcademicYearData= []
			getAcademicYearSpinnerData().then(result => {
        this.AcademicYearData=result;
			})
    }, 
    _getSemesterSpinnerData() { // 根据学年获取下属学期
      this.SemesterList= []
      getSemesterSpinnerData(this.conditionForm.AcademicYearId).then(result => {
        this.SemesterList=result;
      })
    }, 
    /* 接收改变后每页多少条*/
    handleSize (SkipCount, pageSize) {
			this.SkipCount = SkipCount
			this.pageSize = pageSize
      this.initialData(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
			this.SkipCount = SkipCount
			this.pageSize = pageSize
      this.initialData(SkipCount, pageSize);
    },
    queryList() {  
      this.initialData(this.SkipCount, this.pageSize);
    },    
    initialData(SkipCount = 0, pageSize = this.pageSize) {  // 获取考试安排列表
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        ExamName: this.conditionForm.ExamName,
        AcademicYear: this.conditionForm.AcademicYearId,
        SemesterId: this.conditionForm.SemesterId,
        ExaminationType: this.conditionForm.ExaminationType,
      }
      getExaminationArrange(data).then(result => {
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
    /* ------------------------------------ 操作按钮 -------------------------- */ 
    toInfomationPage(row) {  // 查看考场安排详细信息
      this.editForm=row;
      this.arrangeInfoVisible=true;
    },
    toPaperPage(row) { // 查看试卷

    },
    viewDetail(row) {
      let data={
        id:row.id,
        examName:row.examName,
        
      }
      this.$router.push({path: '/marking/paper/class/list',query:data})
    },
  }
}
</script>