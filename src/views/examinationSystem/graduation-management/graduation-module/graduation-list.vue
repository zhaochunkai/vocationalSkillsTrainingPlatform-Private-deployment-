
<template>
<div>
  <!-- 毕业管理 -->
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <!-- 专业树 -->
        需要新接口
        <!-- <org-tree :dataList="TreeData" @selectNode="haddleOrganizationNode"></org-tree>     -->
        <el-tree :data="TreeData" ref="tree" node-key="id" default-expand-all @node-click="haddleOrganizationNode"></el-tree>                            
      </el-card>
    </el-col>
    <el-col :span="19" v-show="nodeLevel">
      <el-card :style="style" v-show="JSON.stringify(nodeSelect) != '{}' && nodeLevel=='班级'">
        <div slot="header" class="t-box-card-header">
          <span>学生列表</span>
        </div>
        <!-- 查询 -->
        <el-form class="t-form-block" ref="form" label-width="60px" size="small" inline>      
          <el-form-item label="姓名" prop="type">
            <el-input v-model="conditionForm.name"></el-input>
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
          <el-form-item label="状态">
            <el-select v-model="conditionForm.stauts" filterable clearable>
              <el-option v-for="(item,i) of dictionary.BYPDJG" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
        </el-form>              
        <!-- 操作按钮 -->
        <div class="t-operate-buttons">
          <el-button type="success" size="small" @click="aotuJudge()">毕业自动判定</el-button>
          <el-button type="primary" size="small" @click="batchApproval()">毕业批量审批</el-button>
          <el-button type="primary" size="small" @click="exportFile()">导出</el-button>
          <el-button type="primary" size="small" @click="printFile()">打印</el-button>
        </div>     
        <!-- 表格 -->
        <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="institution" sortable label="准考证号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="studentName" label="姓名" width="100"></el-table-column>
          <el-table-column prop="yearSemester" label="学年学期" width="200"></el-table-column>
          <el-table-column prop="trainingProgram" label="班级" width="160">
            <template slot-scope="scope">
              {{className}}
            </template>
          </el-table-column>
          <el-table-column prop="graduationTime" label="毕业日期" width="100">
            <template slot-scope="scope">
              {{new Date(scope.row.graduationTime).toLocaleDateString()}}
            </template>
          </el-table-column>
          <el-table-column prop="pass" label="达标状态" width="80">
            <template slot-scope="scope">
              {{scope.row.pass?'达标':'不达标'}}
            </template>
          </el-table-column>
          <el-table-column prop="approved" label="审核状态" width="80">
            <template slot-scope="scope">
              {{scope.row.approved?'已审核':'未审核'}}
            </template>
          </el-table-column>
          <el-table-column prop="graduationJudgementResult" label="毕业判定结果" width="100"></el-table-column>
          <el-table-column  fixed="right" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="approval(scope.row)">审批</el-button>
              <el-button type="primary" size="small" @click="privewApproval(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>	
        <!-- 分页组件 -->
        <div class="t-operate-footer">
          <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div>

        <!-- 批量审批 -->
        <approval-batch :chooseList="chooseList" :statusList="dictionary.BYPDJG" :visible.sync="batchVisible" @initialData="initialData"></approval-batch>
        <!-- 单个学生审批 -->
        <approval-single :dataForm="dataForm" :educationList="dictionary.Education" :statusList="dictionary.BYPDJG" :visible.sync="singleVisible" @initialData="initialData"></approval-single>
        <!-- 查看审批信息 -->
        <approval-Info :dataForm="dataForm" :visible.sync="approvalInfoVisible" @initialData="initialData"></approval-Info>
      </el-card>

      <!-- 毕业自动判定 -->
      <!-- <el-dialog title="毕业自动判定" :visible.sync="autoVisible" width="30%">
        本次毕业自动判定的人数 <strong>88</strong> 人
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="autoVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="saveAuto()">确 定</el-button>
        </span>
      </el-dialog> -->
    </el-col>
  </el-row>
</div>
</template>
<script>
import { 
 getDictionaryItems, getGradeTree,getAcademicYearSpinnerData,getSemesterSpinnerData
} from '@/server/basic-module';
import { 
  getGraduationRecord,updateGraduationRecordApprove,updateGraduationRecordPassState,createGraduationRecordAutoJudge
  
} from '@/server/examination-module';
import orgTree from '@/components/orgTree.vue'
import pagination from "@/components/pagination";
import { pageSizes, pageSize } from "@/config.js";
import approvalBatch from './graduation-approval-batch'
import approvalSingle from './graduation-approval-single'
import approvalInfo from './graduation-approval-Info'
export default {
  components:{orgTree,pagination,approvalBatch,approvalSingle,approvalInfo},
  data(){
    return {
      style:'',
      style2:'',
      //-------------树   
      TreeData:[],   
      nodeSelect:{},
      nodeId:'',
      nodeName:'',
      nodeLevel:'',
      classId:'',
      className:'',
      projectNode:{},
      //-------------表格------------
      pageSizes,
      pageSize,
		  SkipCount:0,
      total:0,
      tableData:[
        {id:1,examName:'44444'}
      ],
      isSelectAll:false,
      multipleSelection:[],
      //-------------检索------------
      stautsList:[], 
      conditionForm:{},
      AcademicYearData:[],
      candidateNo:'',
      name:'',
      //-------------批量审批------------
      chooseList:[],
      batchVisible:false,
      //-------------毕业自动判定--------
      autoVisible:false,
      //--------------审批---
      singleVisible:false,
      dataForm:{},
      approvalInfoVisible:false,
      /**-----------------------------数据字典- 字典码-------------- */ 
      dicJudgeName:{
        BYPDJG:'BYPDJG', // 毕业判定结果
        Education:'Education', // 学历
      },
      dictionary:{},

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
    this._getGradeTree();
    /**-----------------------------数据字典- 获取数据字典下拉数据-------------- */ 
    for(let item in this.dicJudgeName){
      getDictionaryItems(this.dicJudgeName[item]).then(result=>{
          this.$set(this.dictionary, item, result)   
      })
    }
  },
  methods:{
    //-------------------------------------查询-------------------------------------
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
    _getGradeTree(){  // 专业课程点树
      this.TreeData=[];
      getGradeTree().then(result=>{
        this.TreeData.push(result);
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
    // 获取学生列表
    initialData(SkipCount = 0, pageSize = this.pageSize){
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        classId:this.classId,
        StudentName:this.conditionForm.name,
        // Result:''
      }
      getGraduationRecord(data).then(result=>{
        this.tableData = result.items
        this.total = result.totalCount;
      })
    },
    _createGraduationRecordAutoJudge(){
      createGraduationRecordAutoJudge(this.projectNode.id).then(result=>{
        this.$alert('自动判定成功！')
        this.queryList()
      }).catch(err=>{ 
        this.$message({
          showClose: true,
          message:err.message,
          type: 'error'
        });
      }) 
    },
    /*------------------------------------ 操作 --------------------------*/
    privewApproval(row){  // 查看审批信息
      this.dataForm=row||{};
      this.approvalInfoVisible=true;
    },
    aotuJudge(){  // 毕业自动判定
      this._createGraduationRecordAutoJudge();
      // this.autoVisible=true;
    },
    batchApproval(){  // 批量审批
      if(this.multipleSelection.length==0){
        this.$alert('请选择学生后，再批量审批');
        return;
      }
      this.chooseList==[];
      this.multipleSelection.forEach(item=>{
        this.chooseList.push(item.id)
      })
      this.batchVisible=true;
    },
    approval(row){  // 单个学生审批
      this.dataForm=row||{};
      this.$set(this.dataForm,'trainingProgramsId',this.projectNode.id)
      this.singleVisible=true;
    },
    printFile(){  // 打印
      
    },
    exportFile(){ // 审批
      
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
    /* 选择的组织机构 */
    haddleOrganizationNode(node){
      this.nodeSelect=node;
      this.nodeId = node.id
      this.nodeName=node.label;        
      this.nodeLevel = node.level 
      this.classId='';
      this.className='';
      this.projectNode={};
      if(node.level=='班级'){
        this.classId=node.id;
        this.className=node.label;
        this.projectNode=this.$refs.tree.getNode(node.id).parent.data;
        this.initialData();
      }
    },    
    // drawPaper(row){  // 
    //   let data=row || {};
    //   if(data){
    //     this.$set(this.paperForm,'id',data.id);
    //   }
    //   this.batchVisible=true;
    // },
    close(){
      this.$router.push({path:'/marking/paper/list'})
    },
  }
}
</script>