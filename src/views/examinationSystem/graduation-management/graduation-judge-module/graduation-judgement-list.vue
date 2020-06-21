
<template>
<div>
  <!-- 毕业判定条件 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>毕业判定条件</span>
    </div>
    <!-- 查询 -->
    <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
      <el-form-item label="机构名称" prop="" >
        <el-input v-model="filterlabel" @focus="chooseUnit">
          <el-button slot="append" size="small" @click="clear">清空已选机构</el-button>
        </el-input>
        <el-dialog width="30%" title="选取机构" :visible.sync="UnitTreeVisible" append-to-body>
          <el-button type="primary" @click="UnitTreeVisible = false">确 定</el-button>
          <org-tree :dataList="SchoolTree" ref="orgTree" @selectNode="haddleOrganizationNode" ></org-tree>
          <org-tree :dataList="EnterpriseTree" ref="EnterTree" @selectNode="haddleOrganizationNode"></org-tree>
        </el-dialog>
      </el-form-item> 
      <el-form-item label="学年" prop="AcademicYear">
        <el-select v-model="conditionForm.AcademicYearId" filterable clearable placeholder="请选择学年">
          <el-option v-for="(item,i) of AcademicYearData" :key="i" :label="item.academicYearName" :value="item.id"></el-option>
        </el-select>
      </el-form-item> 
      <el-form-item label="学期" prop="SemesterId" v-if="conditionForm.AcademicYearId">
        <el-select v-model="conditionForm.SemesterId" filterable clearable>
          <el-option v-for="(item,i) of SemesterList" :key="i" :label="item.semesterName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学习项目">
        <el-select v-model="conditionForm.TrainingProgramId" filterable clearable placeholder="请选择培训中的学习项目">
          <el-option v-for="(item,i) of programs" :key="i" :label="item.projectName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form>                         
    <!-- 操作按钮 -->
    <div class="t-operate-buttons">
      <el-button type="primary" size="small" @click="edit()">新增</el-button>
    </div>          
    <!-- 表格 -->
    <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="competentAuthorityNames" sortable label="毕业判定机构" show-overflow-tooltip></el-table-column>
      <el-table-column prop="academicYearName" label="学年" width="120"></el-table-column>
      <el-table-column prop="semesterName" label="学期" width="120"></el-table-column>
      <el-table-column prop="trainingProgram" label="培训项目" width="150" show-overflow-tooltip >
        <template slot-scope="scope">
          <span style="font-weight:600;color:#333;">{{scope.row.trainingProgram}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="standard" label="判定条件" show-overflow-tooltip></el-table-column>
      <el-table-column prop="requirement" label="达标要求" width="130" show-overflow-tooltip></el-table-column>
      <el-table-column  fixed="right" label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
          <el-button type="primary" size="mini" @click="privew(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>	
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination ref="pagination" :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>

    <!-- 编辑毕业判定条件 -->
    <add-edit :dataForm="editForm" :visible.sync="addEditVisible" @initialData="initialData"></add-edit>
    <!-- 查看毕业判定条件 -->
    <judge-info :dataForm="editForm" :visible.sync="infoVisible"></judge-info>

  </el-card>
</div>
</template>
<script>
import { 
  getAcademicYearSpinnerData,getSemesterSpinnerData,
  getSchoolTree,getEnterpriseTree
} from '@/server/basic-module';
import { 
  getTrainingProgramsList
} from '@/server/training-module';
import { 
  getGraduationJudgement,deleteGraduationJudgementById
  
} from '@/server/examination-module';
import orgTree from '@/components/orgTree.vue'
import pagination from "@/components/pagination";
import { pageSizes, pageSize } from "@/config.js";
import addEdit from './graduation-judgement-list-edit'
import judgeInfo from './graduation-judgement-infomation'
export default {
  components:{orgTree,pagination,addEdit,judgeInfo},
  data(){
    return {
      style:'',
      conditionForm:{},
      //-------------表格------------
      pageSizes,
      pageSize,
		  SkipCount:0,
      total:0,
      tableData:[],
      isSelectAll:false,
      multipleSelection:[],
      //-------------检索------------ 
      AcademicYearData:[],
      SemesterList:[],
      ExaminationType:[
        {name:'全部',type:'All'},
        {name:'模拟考试',type:'Simulation'},
        {name:'正式考试',type:'Official'}
      ],
      programs:[],
      UnitTreeVisible:false,
      filterlabel:'',
      SchoolTree:[],
      EnterpriseTree:[],
      //-------------编辑------------
      editForm:{},
      addEditVisible:false,
      paperForm:{},
      paperVisible:false,
      // -----------查看-------------
      infoVisible:false,
    }
  },
  watch:{
    'conditionForm.AcademicYearId'(newVal){
      if(newVal){
        this._getSemesterSpinnerData(); // 根据学年获取下属学期
      }
    }
  },
  activated(){
		this.style = `height:${document.body.clientHeight-200}px;overflow:scroll;`
    this._getAcademicYearSpinnerData();
    this._getTrainingProgramsList();
    this._getSchoolTree()
    this._getEnterpriseTree();
    this.initialData();
  },
  methods:{
    /*--------------------------------------------查询---------------------------------------*/
    // 获取学校信息树
    _getSchoolTree(){
      this.SchoolTree=[]
      getSchoolTree().then(result=>{
        this.SchoolTree.push(result);
      })
    },
    // 获取企业信息树
    _getEnterpriseTree(){
      this.EnterpriseTree=[]
      getEnterpriseTree().then(result=>{
        this.EnterpriseTree.push(result);
      })
    },
    _getTrainingProgramsList(){ // 状态为“3-培训中”的项目
      let data = {
				SkipCount: 0, 
				MaxResultCount: 200,
				// Status:3 
			};
			getTrainingProgramsList(data).then(result=>{
				this.programs=result.items;
			})
    }, 
    _getAcademicYearSpinnerData(){ // 获取学年下拉框数据
      this.AcademicYearData=[];
			getAcademicYearSpinnerData().then(result=>{
        this.AcademicYearData=result;
			})
    }, 
    _getSemesterSpinnerData(){// 根据学年获取下属学期
      this.SemesterList=[];
      getSemesterSpinnerData(this.conditionForm.AcademicYearId).then(result=>{
        this.SemesterList=result;
      })
    }, 
    /**接收改变后每页多少条*/
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
    queryList(){  
      this.initialData(this.SkipCount, this.pageSize);
    },
    // 获取试题列表
    initialData(SkipCount = 0, pageSize = this.pageSize){
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        SemesterId:this.conditionForm.SemesterId,
        TrainingProgramId:this.conditionForm.TrainingProgramId,
      }
      getGraduationJudgement(data).then(result=>{
        this.tableData = result.items
        this.total = result.totalCount;
      })
    },
    /*------------------------------------ 操作按钮 --------------------------*/
    privew(data){
      this.editForm=data||{}
      this.infoVisible=true;
    },
    chooseUnit(){
      this.UnitTreeVisible=true;
    },
    /* 选择的组织机构 */
    haddleOrganizationNode(node){
      this.$set(this.conditionForm,'orgId',node.id); // 机构id
      this.filterlabel = node.label
    },
    clear(){  // 清空已选机构
      this.conditionForm.orgId='';
      this.filterlabel = ''
    },
    // 全选
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        });
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    selectAll(){
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange(val){
      this.multipleSelection = val
        // 判断是否是全选
      this.isSelectAll = this.tableData.length === this.multipleSelection.length
    },    
    edit(row){   
      let data=row || {};
      // if(data){
      //   this.$set(this.editForm,'id',data.id);
      // }
      this.editForm=data;
      this.addEditVisible=true;  
    },
    del(row){
      let data=row || {};
      
      this.$confirm(`此操作将删除项目【${row.trainingProgram}】的毕业判定条件 ， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString:true,
        type: 'warning'
      }).then(() => { 
        deleteGraduationJudgementById(row.id).then(()=>{
          this.$message.success('删除成功！');
          this.initialData();
          this.$refs.pagination.currentPage=1
        }).catch(err=>{ 
          this.$message({
            showClose: true,
            message:err.message,
            type: 'error'
          });
        })  
      })
    }
  }
}
</script>
<style lang="less" scoped>


</style>