
<template>
<div>
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <!-- 班级树 -->
        <org-tree :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>
      </el-card>
    </el-col>
    <el-col :span="19" >
      <!-- 学历跟踪列表 -->
      <el-card :style="style" v-show="JSON.stringify(nodeSelect) != '{}'&& nodeSelect.level=='班级'">
        <div slot="header" class="t-box-card-header">
          <span>【{{nodeSelect.label}}】学生列表</span>
        </div>
        <!-- 查询 -->
        <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
          <el-form-item label="姓名">
            <el-input class="input-append" v-model="conditionForm.Name"></el-input>	
          </el-form-item>
          <el-form-item label="电话">
            <el-input class="input-append" v-model="conditionForm.Tel"></el-input>	
          </el-form-item>
          <el-form-item label="学历">
            <!-- <el-select v-model="conditionForm.resource" clearable>
              <el-option v-for="(item,i) of resourceList" :key="i" :label="item.name" :value="item.type"></el-option>
            </el-select> -->
            <el-select v-model="conditionForm.education">
              <el-option v-for="(item,i) of dictionary.Education" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;"  
          v-loading="loading"
          element-loading-text="数据加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(250,250,250,0.8)">
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="name" sortable label="姓名" show-overflow-tooltip >
            <template slot-scope="scope">
              <el-button type="text" style="color:#00f" @click="toStudentTrack(scope.row)">{{scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="planningStudyTotalDuration" label="项目要求学习时长" width="150"></el-table-column>
          <el-table-column prop="actualStudyTotalDuration" label="项目实际学习时长" width="150"></el-table-column>
          <el-table-column prop="examinationType" label="总体学习进度">
            <template slot-scope="scope">
              <el-progress :percentage="scope.row.progress"></el-progress>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="age" label="年龄" width="80"></el-table-column> -->
          <el-table-column prop="sex" label="性别" width="80"></el-table-column>
          <el-table-column prop="education" label="学历" width="120"></el-table-column>
          <el-table-column prop="tel" label="联系电话" width="120"></el-table-column>
        </el-table>		
        <!-- 分页组件 -->
        <div class="t-operate-footer">
          <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div>
        <!-- 跟踪学生学习情况 -->
        <student-track :dataForm="dataForm" :visible.sync="studentVisible"></student-track>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>
<script>
import { getGradeTree,getDictionaryItems } from '@/server/basic-module'
import { getLearnToTrackList } from '@/server/statistical-module';
import pagination from '@/components/pagination'
import orgTree from '@/components/orgTree'
import { pageSizes, pageSize } from '@/config.js'
import studentTrack from './learning-tracking-student'
export default {
  components: {pagination,orgTree,studentTrack},
  data() {
    return {
      style: '',
      conditionForm: {},
      ClassId:null,
      // -------------树------------
      resourceTree: [],
      nodeSelect: {},
      // -------------表格------------
      pageSizes,
      pageSize,
      total:0,
      tableData: [],
      loading:true,
      // -------------检索------------ 
      trainingProgramsId:null,
      programs: [],
      courseList: [],
      resourceList: [
        {name: '全部',type: 'All'},
        {name: '线上（移动端）',type: 'Simulation'},
        {name: '线下',type: 'Official'}
      ],
      // -------------编辑------------
      dataForm: {},
      studentVisible:false,
      /* ------------------[-----------数据字典- 字典码-------------- */ 
      dicJudgeName: {
        Education: 'Education', // 学历
      },
      dictionary: {},
    }
  },
  watch: {
  },
  activated() {
		this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getGradeTree()
    /* ------------------[-----------数据字典- 获取数据字典下拉数据-------------- */ 
    for(let item in this.dicJudgeName) {
      getDictionaryItems(this.dicJudgeName[item]).then(result => {
          this.$set(this.dictionary, item, result)   
      })
    }
  },
  methods: {
    _getGradeTree () {
      this.resourceTree = []
      getGradeTree({state: '3,4'}).then(result => {  // 查询状态为3-培训中、4-已结束的项目
        this.resourceTree.push(result)
      })
    },
    /**接收改变后每页多少条*/
    handleSize (SkipCount, pageSize) {
      this.initialData(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.initialData(SkipCount, pageSize);
    },
    queryList() {  
      this.initialData();
    },
    // 获取试题列表
    initialData(SkipCount = 0, pageSize = this.pageSize) {
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        Name: this.conditionForm.Name,
        Tel: this.conditionForm.Tel,
        ClassId : this.ClassId ,
        Education: this.conditionForm.education        
      }
      this.loading=true;
      getLearnToTrackList(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount;
        this.loading=false;
      }).catch(err => { 
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    /* ------------------------------------ 操作按钮 -------------------------- */
    toStudentTrack(row) {
      this.dataForm={
        trainingProgramId:row.trainingProgramId,
        studentId:row.studentId,
        classId: this.ClassId
      }
      this.studentVisible=true;
    },
    /* 选择的树节点 */
    haddleOrganizationNode (node) {
      this.nodeSelect = node;
      if (node.level == '班级') {
        this.ClassId=node.id
        this.initialData();
      }
    },
  }
}
</script>
<style lang="less" scoped>
.t-header-title span{
  font-size:14px;
  width:300px;
  text-align:left;
  padding-left:10px;
  
}
</style>