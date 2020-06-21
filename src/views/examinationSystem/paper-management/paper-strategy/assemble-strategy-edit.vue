<template>
<el-dialog class="t-dialog" v-if="visible" :title="form.id?'编辑组卷策略': '新增组卷策略'" :visible="visible" :close-on-click-modal="false" width="60%" @close="close" >
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="basicInfo">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="100px" size="small">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="策略名称" prop="strategyName">
                  <el-input v-model="form.strategyName" :disabled="form.id?true: false"></el-input>
                </el-form-item>
                <el-form-item label="总分" prop="totalPoints">
                  <el-input  v-model.number="form.totalPoints" type="number" min="0">
                    <el-button slot="append">分</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学习项目" prop="trainingProgramsId">
                <el-select v-model="trainingProgramsId" filterable :remote-method="remoteMethod" placeholder="请输入项目名称检索" :disabled="form.id?true: false"
                  remote
                  reserve-keyword
                >
                  <el-option v-for="(item,i) of programs" :key="i" :label="item.name" :value="item.id"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="考试科目" prop="courseId">
                  <el-select v-model="form.courseId" filterable clearable placeholder="请选择项目后，再选择考试科目" :disabled="form.id?true: false">
                    <el-option v-for="(item,i) of courseList" :key="i" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" type="textarea" :rows="3"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- 试题策略初值状态 -->
          <div class="t-header-title">
            <span>设置试题类型</span>
          </div>
          <el-table class="t-table-list" ref="multipleTable" border size="small" :data="questionTypeList" tooltip-effect="dark" style="width:100%;">
            <el-table-column type="index" width="55" align="center"> </el-table-column>
            <el-table-column prop="label" label="试题策略类型" width="100" ></el-table-column>
            <el-table-column label="试题策略难易程度">
              <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.checkedList">
                  <el-checkbox v-for="(item,i) of DifficultyLevelEnumList" :label="item.type" :key="i">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column prop="score" label="每题分值" width="100px">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.score" size="mini" type="number" min="0"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8">
          <!-- 试题策略知识点树 -->
          <el-card :style="style">
            <el-tree v-if="form.courseId" :data="genarteTreeData" ref="tree" node-key="id" default-expand-all :expand-on-click-node="false" :render-content="renderContent"></el-tree>
          </el-card>
        </el-col>
      </el-row>
      <div class="t-text-right">
        <el-button size="small" @click="close">返 回</el-button>
        <el-button type="success" size="small" @click="strategy()">生成试题策略</el-button>
        <el-button type="primary" size="small" @click="next('questionType')">下一页</el-button>
        <el-button v-if="form.id" type="primary" size="small" @click="save">保 存</el-button>
      </div>
    </el-tab-pane>
    <!-- 试题策略 -->
    <el-tab-pane label="试题策略" name="questionType" v-if="form.id || showNext">
      <el-tag>总分： {{form.totalPoints}}  ｜ 试题策略总量：
        <span v-for="(item,i) of questionTypeList" :key="i">
          {{item.label}}：{{item.count?item.count:0}} ，
        </span>
        <span>合计：{{totalCount?totalCount:0}} 题</span>
      </el-tag>
      <el-row type="flex" class="row-bg" justify="space-between" :gutter="10" style="margin-bottom:10px;">
        <el-col>
          <el-table class="t-table-list"  ref="multipleTable" show-summary border size="small" :data="form.questionTypeConfig" tooltip-effect="dark" style="width:100%;">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="questionTypeName" label="试题策略类型名称" width="140" ></el-table-column>
            <el-table-column prop="difficultyLevelName" label="难易程度" width="100" ></el-table-column>
            <el-table-column prop="questionCount" label="试题策略数量" width="160">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.questionCount" size="mini" type="number" min="0"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="score" label="每题分值"></el-table-column>
            <el-table-column prop="scoreCount" fixed="right" label="总分值（ 数量 * 单题分值 ）" width="180" align="center">
              <template slot-scope="scope">
                {{scope.row.questionCount?scope.row.scoreCount=scope.row.score * scope.row.questionCount:0}}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col style="width:120px;">
          <div style="height:100%;position:relative;"></div>
        </el-col>
      </el-row>
      <div class="t-text-right">
        <el-button size="small" @click="close">返 回</el-button>
        <el-button type="primary" size="small" @click="next('basicInfo')">上一页</el-button>
        <el-button type="primary" size="small" @click="save">保 存</el-button>
        <!-- <el-button type="primary" size="small" @click="save ('saveGoon')">保存并继续新增</el-button> -->
      </div>
    </el-tab-pane>
  </el-tabs>
</el-dialog>
</template>
<script>
import orgTree from '@/components/orgTree.vue'
import { getTrainingProgramsBindCourse, getTrainingProgramsPullDown } from '@/server/training-module'
import { getChapterTree, getSectionTree, getKnowledgeTree } from '@/server/basic-module'
import { getAssembleStrategyById } from '@/server/examination-module'
export default {
  props: ['visible', 'dataForm', 'TreeData'],
  data () {
    return {
      style: '',
      // ----试题策略知识点树----
      id: null, // 试题策略id
      // TreeData: [],
      genarteTreeData: [],
      courseOrQuestion: 'Course',
      questionTypeList: [
        {name: 'SingleChoice', label: '单选题', checkedList: []},
        {name: 'MultipleChoice', label: '多选题', checkedList: []},
        {name: 'TrueFalse', label: '判断题', checkedList: []}
        // {name: 'BlankFill', label: '填空题', checkedList: []},
        // {name: 'ShortAnswer', label: '解答题', checkedList: []},
        // {name: 'Read', label: '阅读题', checkedList: []}
      ],
      DifficultyLevelEnumList: [
        {name: '容易', type: 'Easy'},
        {name: '初级', type: 'Primary'},
        {name: '中级', type: 'MiddleRank'},
        {name: '高级', type: 'Advanced'},
        {name: '困难', type: 'Difficulty'}
      ],
      // -------表单-------
      form: {
        questionTypeConfig: []
      },
      rules: {
        strategyName: [{required: true, message: '请输入策略名称', trigger: 'blur'}],
        totalPoints: [{required: true, message: '请输入总分', trigger: 'blur'}],
        trainingProgramsId: [{required: true, message: '请选择学习项目', trigger: 'blur'}],
        courseId: [{required: true, message: '请选择考试科目', trigger: 'blur'}]
      },
      questionSubjectOptions: [],
      strategyWithKnowledgePoint: [], // 选取的知识点集合
      activeName: 'basicInfo',
      trainingProgramsId: null,
      programs: [],
      courseList: [],
      showNext: false,
      loading: false,
      // 题目数量和分数计算
      totalCount: 0

    }
  },
  components: {orgTree},
  watch: {
    visible (newVal) {
      if (newVal) {
        this.showNext = false
        this.strategyWithKnowledgePoint = []
        this.style = `max-height:${document.body.clientHeight * 0.7 - 100}px;overflow:scroll;`
        this.trainingProgramsId = null
        this.questionTypeList = [
          {name: 'SingleChoice', label: '单选题', checkedList: []},
          {name: 'MultipleChoice', label: '多选题', checkedList: []},
          {name: 'TrueFalse', label: '判断题', checkedList: []}
          // {name: 'BlankFill', label: '填空题', checkedList: []},
          // {name: 'ShortAnswer', label: '解答题', checkedList: []},
          // {name: 'Read', label: '阅读题', checkedList: []}
        ]
        this.form = {}
        if (this.dataForm) {
          this.trainingProgramsId = this.dataForm.trainingProgramsId
          this.id = this.dataForm.id
          if (this.id) {
            this._getAssembleStrategyById() // 试题策略基本信息
          }
        }
        this.activeName = 'basicInfo'
        this._getTrainingProgramsPullDown() // /学习项目下拉列表
      }
    },
    trainingProgramsId (newVal) {
      if (newVal) {
        this.$set(this.form, 'trainingProgramsId', newVal)
        this.$set(this.form, 'courseId', '')
        this._getTrainingProgramsBindCourse() // 获取学习项目下的课程
      }
    },
    'form.courseId' (newVal) {
      if (newVal) {
        this.genarteTreeData = this.TreeData.filter(item => {
          return item.id === newVal
        })
        this.genarteTreeData.forEach(item => {
          this._getChapterTree(item)
        })
      }
    },
    'form.totalPoints' (newVal) {
      if (newVal < 1) {
        this.$set(this.form, 'totalPoints', '')
      }
    },
    'form.questionTypeConfig': {
      handler (newVal, oldVal) {
        if (newVal && newVal.length > 0) {
          this.questionTypeList.forEach(el => {
            let count = 0
            this.totalCount = 0
            newVal.forEach((item, i) => {
              if (el.name === item.questionType) {
                count += item.questionCount
              }
              if (item.questionCount < 0) {
                this.$set(item, 'questionCount', 0)
              }
              this.totalCount += item.questionCount
            })
            this.$set(el, 'count', count)
          })
        }
      },
      immediate: true,
      deep: true
    },
    questionTypeList: {
      handler (newVal, oldVal) {
        if (newVal && newVal.length > 0) {
          newVal.forEach((item, i) => {
            if (item.score < 0) {
              this.$set(item, 'score', 0)
            }
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    renderContent (h, {node, data, store}, trueOrFalse = true) { // 可以勾选节点： 非课程节点、无子级的节点
      trueOrFalse = data.trueOrFalse || false
      return (
        <span class="custom-tree-node">
          <span v-show={data.level === '课程'}>
            {node.label}
          </span>
          <span v-show={data.level !== '课程'}>
            <span v-show={(data.children && data.children.length > 0)}>
              {node.label}
            </span>
            <span v-show={!data.children || data.children.length === 0}>
              <el-checkbox checked={trueOrFalse} v-model={trueOrFalse} style="margin-right:1rem;" on-change={(trueOrFalse) => this.changeOptions(data, trueOrFalse)}>{node.label}</el-checkbox>
            </span>
          </span>
        </span>
      )
    },
    _getAssembleStrategyById () {
      this.strategyWithKnowledgePoint = []
      getAssembleStrategyById(this.id).then(result => {
        this.form = Object.assign({}, result)
        this.trainingProgramsId = this.form.trainingProgramsId
        result.strategyWithKnowledgePoint.forEach(item => {
          this.$set(item, 'trueOrFalse', true)
        })
        this.strategyWithKnowledgePoint = result.strategyWithKnowledgePoint
        this.questionTypeList.forEach(item => {
          item.checkedList = []
          result.questionTypeConfig.forEach(el => {
            if (item.name === el.questionType) {
              item.checkedList.push(el.difficultyLevel)
              this.$set(item, 'score', el.score)
            }
          })
        })
      })
    },
    _getTrainingProgramsPullDown (query) {
      let data = {
        name: query,
        status: '0,1,2,3'
      }
      getTrainingProgramsPullDown(data).then(res => {
        this.loading = false
        this.programs = res
      })
    },
    remoteMethod (query) {
      this.loading = true
      this._getTrainingProgramsPullDown(query)
    },
    _getTrainingProgramsBindCourse () { // 根据项目id查询课程
      this.courseList = []
      getTrainingProgramsBindCourse(this.trainingProgramsId).then(result => {
        this.courseList = result
      })
    },
    FilterCheckedNodes (arr, fun, nodeType) {
      arr.forEach(item => {
        this.strategyWithKnowledgePoint.forEach(el => {
          if (el.knowledgePointId === item.id && el.courseCatalogLevel === nodeType) {
            this.$set(item, 'trueOrFalse', true)
          }
        })
        if (fun) {
          this[fun](item)
        }
      })
      return arr
    },
    _getChapterTree (node) { // 获取 章列表 树
      let data = {
        courseOrQuestion: this.courseOrQuestion,
        courseId: node.id
      }
      getChapterTree(data).then(result => {
        node.children = this.FilterCheckedNodes(result, '_getSectionTree', 'Chapter')
      })
    },
    _getSectionTree (node) { // 获取 节列表 树
      let data = {
        courseOrQuestion: this.courseOrQuestion,
        chapterId: node.id
      }
      getSectionTree(data).then(result => {
        node.children = this.FilterCheckedNodes(result, '_getKnowledgeTree', 'Section')
      })
    },
    _getKnowledgeTree (node) { // 获取 知识点列表 树
      let data = {
        courseOrQuestion: this.courseOrQuestion,
        sectionId: node.id
      }
      getKnowledgeTree(data).then(result => {
        node.children = this.FilterCheckedNodes(result, '', 'KnowledgePoint')
      })
    },
    /* ----------------------------------- 操作按钮 ----------------------------------- */
    handleClick (tab, event) {},
    strategy () {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.warning('请完善基本信息！')
          return
        }
        let questionTypeConfig = []
        for (let i = 0; i < this.questionTypeList.length; i++) {
          let item = this.questionTypeList[i]
          if (item.checkedList.length > 0 && (!item.score || item.score <= 0)) {
            this.$message.warning('请输入试题分值！')
            return
          }
          item.checkedList.forEach(el => {
            let limitObj = this.DifficultyLevelEnumList.find(limit => {
              return limit.type === el
            })

            let obj = {
              questionType: item.name,
              questionTypeName: item.label,
              difficultyLevel: el,
              difficultyLevelName: limitObj.name,
              score: item.score
            }
            questionTypeConfig.push(obj)
          })
        }
        this.$set(this.form, 'questionTypeConfig', questionTypeConfig)
        if (questionTypeConfig.length === 0) {
          this.$alert('请先设置试题类型！')
        } else {
          this.$confirm(`试题类型设置成功，是否继续？`, '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }).then(() => {
            this.showNext = true
            this.activeName = 'questionType'
          })
        }
      })
    },
    next (data) {
      if (data === 'questionType') {
        this.$refs.form.validate((valid) => {
          this.showNext = true
          if (!valid) {
            this.$message.warning('请完善基本信息！')
            this.showNext = false
            return
          } else {
            if (!this.form.questionTypeConfig || this.form.questionTypeConfig.length === 0) {
              this.$alert('请先设置试题类型，并【生成试题策略】！')
              this.showNext = false
              return
            }
          }
          this.activeName = data
        })
      } else {
        this.showNext = true
        this.activeName = data
      }
    },
    // 根据node的level生成对应的节点类型， 章-chapter|节-section|知识点-knowledgePoint
    genarateLevelType (level) {
      let typeName = level.split(',')[0]
      let type = ''
      switch (typeName) {
        case '章':
          type = 'Chapter'
          break
        case '节':
          type = 'Section'
          break
        case '知识点':
          type = 'KnowledgePoint'
          break
        default:
          type = 'Course'
      }
      return type
    },
    // 复选框选择知识点
    changeOptions (node, trueOrFalse) {
      let obj = {
        trueOrFalse: trueOrFalse,
        knowledgePointId: node.id,
        courseCatalogLevel: this.genarateLevelType(node.level) // 类型
      }
      if (this.form.id) {
        this.$set(obj, 'questionAssembleStrategyId', this.form.id)
      }
      let arr = JSON.parse(JSON.stringify(this.strategyWithKnowledgePoint)) // 将知识点集合重赋值
      let finds = arr.find((item, i) => {
        return item.knowledgePointId === obj.knowledgePointId && item.courseCatalogLevel === obj.courseCatalogLevel
      })
      arr.forEach((item, i) => {
        // 如果集合中存在知识点id，但是又没有被选择，则从集合中删除该数据
        if (item.knowledgePointId === obj.knowledgePointId &&
            item.courseCatalogLevel === obj.courseCatalogLevel &&
            !obj.trueOrFalse
        ) {
          this.strategyWithKnowledgePoint.splice(i, 1)
        }
      })
      // 如果集合中不存在该知识点id，且被选中，则push
      if (!finds && obj.trueOrFalse) {
        this.strategyWithKnowledgePoint.push(obj)
      }
    },
    // 相同题型分值是相同的
    scoreIniti (row) {
      this.form.questionTypeConfig.forEach(item => {
        if (row.questionType === item.questionType) {
          item.score = row.score
        }
      })
    },
    close () {
      this.$emit('update:visible', false)
    },
    save (type) {
      this.form.totalPoints = Number(this.form.totalPoints)
      let amount = 0 // 试题策略总分值
      let paperCount = 0 // 试题策略总数量
      this.form.questionTypeConfig.forEach(item => {
        this.$set(item, 'score', Number(item.score))
        this.$set(item, 'questionCount', Number(item.questionCount))
        amount += item.score * item.questionCount
        paperCount += item.questionCount
      })
      if (amount !== this.form.totalPoints) {
        this.$alert('【试题策略类型】中的总分值必须和【基本信息】中的总分一致')
        return
      }
      this.$set(this.form, 'questionCount', paperCount)
      this.$set(this.form, 'strategyWithKnowledgePoint', this.strategyWithKnowledgePoint)
      this.$emit('save', this.form)
      this.close()
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-form .el-form-item{
  max-width:100%;
}
.addBtn{
  position: absolute;
  right:0;bottom:10px;
}
.fiexdBtns{
  margin:20px 0;
  display:block;
}
/deep/.el-checkbox__input.is-checked .el-checkbox__inner{
  border-color: #0a0;
  background-color: #0a0;
}
</style>
