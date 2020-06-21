<template>
<div>
<!-- 组卷策略信息 -->
<el-card :style="style">
  <div slot="header" class="t-box-card-header">
    <span>组卷策略信息</span>
  </div>
  <!-- 基本信息 -->
  <div class="t-header-title">
    <span>基本信息</span>
  </div>  
  <el-table class="t-table-list"  ref="multipleTable" border size="small" :data="basicData" tooltip-effect="dark" style="width:100%;">
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="strategyName" label="试题策略名称" width="300" ></el-table-column>
    <el-table-column prop="courseName" label="考试科目" width="200" ></el-table-column>
    <el-table-column prop="questionCount" label="试题总量" width="90" ></el-table-column>
    <el-table-column prop="totalPoints" label="总分" width="90" ></el-table-column>
    <el-table-column prop="remark" label="备注"></el-table-column>
  </el-table>
  <!-- 试题策略 -->
  <div class="t-header-title">
    <span>试题策略</span>
  </div> 
  <el-table class="t-table-list" ref="multipleTable" show-summary border size="small" :data="questionTypeConfigData" tooltip-effect="dark" style="width:100%;">
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="questionTypeName" label="试题策略类型名称" ></el-table-column>
    <el-table-column prop="difficultyLevelName" label="难易程度"></el-table-column>
    <el-table-column prop="questionCount" label="试题策略数量"></el-table-column>
    <el-table-column prop="score" label="每题分值"></el-table-column>
    <el-table-column prop="scoreCount" fixed="right" label="总分值（ 数量 * 单题分值 ）" width="180" align="center">
      <template slot-scope="scope">
        {{scope.row.questionCount?scope.row.scoreCount=scope.row.score * scope.row.questionCount:0}}
      </template>
    </el-table-column>
  </el-table> 
  <div >
    <el-button size="small" @click="close">返 回</el-button>
  </div>  
</el-card>
</div>
</template>
<script>
import { getAssembleStrategyById, } from '@/server/examination-module';

export default {
  data() {
    return {
      style: '',
      // ----试题策略知识点树----
      id:null, // 试题策略id
      basicData: [],
      questionTypeList: [
        {name: 'SingleChoice',label: '单选题',checkedList: []},
        {name: 'MultipleChoice',label: '多选题',checkedList: []},
        {name: 'TrueFalse',label: '判断题',checkedList: []},
        // {name: 'BlankFill',label: '填空题',checkedList: []},
        // {name: 'ShortAnswer',label: '解答题',checkedList: []},
        // {name: 'Read',label: '阅读题',checkedList: []}
      ],
      DifficultyLevelEnumList: [
        {name: '容易',type: 'Easy'},
        {name: '初级',type: 'Primary'},
        {name: '中级',type: 'MiddleRank'},
        {name: '高级',type: 'Advanced'},
        {name: '困难',type: 'Difficulty'}
      ],
      // -------表单-------
      form: {},
      questionTypeConfigData: []
    }
  },
  activated() {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this.id=this.$route.query.id;
    this._getAssembleStrategyById();
  },
  methods: { 
    _getAssembleStrategyById() {
      this.basicData= []
      this.questionTypeConfigData= []
      getAssembleStrategyById(this.id).then(result => {
        this.basicData.push(result)
        this.questionTypeList.forEach(item => {
          item.checkedList= []
          result.questionTypeConfig.forEach(el => {
            if (item.name==el.questionType) {
              item.checkedList.push(el.difficultyLevel)
            }
          })
        })
        this.questionTypeConfigData=result.questionTypeConfig;
      })
    },
    /* -----------------------------------------------------------操作按钮----------------------------------- */
    close () {
      this.$router.push({path: '/assemble/strategy'})
    },
  }
}
</script>
<style lang="less" scoped>
.fiexdBtns{
  margin:20px 0;
  display:block;
}
</style>


