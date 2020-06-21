<template>
<el-dialog class="t-dialog" :title="dataForm.title" v-if="visible" :visible="visible" :close-on-click-modal="false" width="70%" append-to-body @close="close">      
  <div style="margin-bottom:10px;display:block;">
    <el-button size="small" @click="close">返 回</el-button>        
    <el-button type="primary" size="small" @click="save">确 定</el-button>   
  </div>   
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card>
        <div slot="header" class="t-box-card-header">
          <span>项目【{{dataForm.projectName}}】{{dataForm.personType=='Teacher'?'课程列表':'班级列表'}}</span>
        </div>
        <el-tree :data="TreeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-card>
    </el-col>
    <el-col :span="18">
      <el-card>          
        <!-- 人员列表 -->
        <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>     
          <el-table-column prop="name" sortable label="姓名"></el-table-column>
        </el-table>	
        <!-- 全选 -->
        <div class="t-batch-operate">
          <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
        </div>
        <!-- 分页组件 -->
        <!-- <div class="t-operate-footer">
          <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div> -->
      </el-card>
    </el-col>
  </el-row>  
</el-dialog>
</template>
<script>
import { getDictionaryItems } from '@/server/basic-module';
import { getIdentityUserById } from '@/server/identity-module';
import { getTrainingProgramsList,getTrainingProgramsBindCourse } from '@/server/training-module';
import { 
  getEvaluationNotPlanTeacherOrganizeInfo,getEvaluationNotPlanTeacherListByCourseId,
  getEvaluationNotPlanStudentOrganizeInfo,getEvaluationNotPlanStudentListByClassId
} from '@/server/online-module';
import pagination from "@/components/pagination";
import { pageSizes, pageSize } from "@/config.js";
export default {
  props:['dataForm', 'visible'],
  data () {
    return {
      /* ------------------------左侧树--------------------------- */
      TreeData:[],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      nodeSelected:{},
      /* ------------------------未分配--------------------------- */
      isSelectAll:false,
      tableData:[],
      multipleSelection:[],
      pageSizes,
      pageSize,
      SkipCount:0,
      total:0,
      /* ------------------------数据字典- 字典码------------------------ */ 
      // dicJudgeName:{
      //   PJZBLX:'PJZBLX', // 学历
      // },
      // dictionary:{},
    }
  },
  activated(){
    /* ------------------数据字典- 获取数据字典下拉数据-------------- */ 
    // for(let item in this.dicJudgeName){
    //   getDictionaryItems(this.dicJudgeName[item]).then(result=>{
    //     this.$set(this.dictionary, item, result)   
    //   })
    // }
  },
  watch: {
    visible(newVal){
      if(newVal){  
        this.tableData=[];
        this.isSelectAll=false;
        this.multipleSelection=[];
        if(this.dataForm.personType=='Teacher'){
          this._getEvaluationNotPlanTeacherOrganizeInfo(); //获取课程，并根据课程获取教师列表
        }else{
          this._getEvaluationNotPlanStudentOrganizeInfo(); //获取班级，并根据班级获取学员列表
        }
      }
    },
  },
  components:{pagination},
  methods: {
    /***************************************************************************************************
     * ********************************************** 查询 ********************************************* 
     * ************************************************************************************************ */
    /* ---------------------------------- 获取课程列表 ---------------------------------- */  
    _getEvaluationNotPlanTeacherOrganizeInfo(){
      this.TreeData=[];
      getEvaluationNotPlanTeacherOrganizeInfo(this.dataForm.programeId).then(result=>{
        this.TreeData=result;
      })
    },
    /* ---------------------------------- 获取教师列表 ---------------------------------- */   
    _getEvaluationNotPlanTeacherListByCourseId(){
      getEvaluationNotPlanTeacherListByCourseId(this.dataForm.programeId,this.nodeSelected.id).then(res=>{
        this.tableData=res; // {id,name}
      })
    },
    /* ---------------------------------- 获取班级列表 ---------------------------------- */ 
    _getEvaluationNotPlanStudentOrganizeInfo(){
      this.TreeData=[];
      getEvaluationNotPlanStudentOrganizeInfo(this.dataForm.programeId).then(result=>{
        this.TreeData=result;
      })
    }, 
    /* ---------------------------------- 获取学生列表 ---------------------------------- */   
    _getEvaluationNotPlanStudentListByClassId(){
      getEvaluationNotPlanStudentListByClassId(this.nodeSelected.id).then(res=>{
        this.tableData=res; // {id,name}
      })
    },
    /* ---------------------------------- 右侧人员列表 ---------------------------------- */    
    toggleSelection (rows) { // 全选   
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        });
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    selectAll(){          // 全选   
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange(val){  // 多选    
      this.multipleSelection = val 
      this.isSelectAll = this.tableData.length === this.multipleSelection.length       // 判断是否是全选
    },
    handleSize (SkipCount, pageSize) { /**接收改变后每页多少条*/
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataListAll(SkipCount, pageSize);
    },      
    handleCurrent (SkipCount, pageSize) { /* 接收当前页数 */
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataListAll(SkipCount, pageSize);
    },
    queryList(){
      this.initDataListAll(this.SkipCount, this.pageSize);
    },
    initDataListAll(SkipCount = 0, pageSize = this.pageSize){ // 初始化：根据获取指标列表
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
      }
      // getEvaluationIndicator(data).then(result=>{
      //   this.tableData = result.items
      //   this.total = result.totalCount;
      // })
    },  
    /***************************************************************************************************
     * ********************************************** 操作 ********************************************* 
     * ************************************************************************************************ */
    handleNodeClick(data) {
      this.nodeSelected=data;
      if(this.dataForm.personType=='Teacher'){
        this._getEvaluationNotPlanTeacherListByCourseId();// 根据课程获取教师列表
      }else{
        this._getEvaluationNotPlanStudentListByClassId();  //根据班级获取学员列表
      }

    },
    save(){  // 评价计划保存
      this.$emit('getProfessional',this.multipleSelection,this.dataForm)
      this.close()
    },
    close(){
      this.$emit('update:visible', false)
    },
  }
}
</script>
<style lang="less" scoped>
</style>
