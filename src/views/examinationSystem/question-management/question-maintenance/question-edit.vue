<template>
<el-dialog class="t-dialog" v-if="visible" :title="`${dataForm.id?'编辑': '新增'}${title}`" :visible="visible" :close-on-click-modal="false" custom-class="customClass" width="60%" @close="close">
  <el-row :gutter="20">
    <el-col :span="16">
      <!-- 基本信息 -->
      <div class="t-header-title">
        <span>基本信息</span>
      </div>
      <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="80px" size="small">
        <el-form-item label="关键词" prop="keyWord">
          <el-input v-model="form.keyWord"></el-input>
          <el-tag>多个关键词用英文逗号分隔</el-tag>
        </el-form-item>
        <el-form-item label="难易度" prop="difficultyLevel">
          <el-radio-group v-model="form.difficultyLevel">
            <el-radio v-for="(item, i) of DifficultyLevelEnumList" :key="i" :label="item.type">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题目" prop="title">
          <el-button type="success" size="mini" icon="el-icon-edit" @click="editPaperTitle('title')" style="background-color:#0a0;">编辑</el-button>
          <el-button size="small" type="text" @click="clearPaperTitle('title')">清空</el-button>
          <div class="t-editorContent t-textarea t-bgcolor-grey" v-html="form.title"></div>
        </el-form-item>
      </el-form>
      <!-- 选项信息 -->
      <div class="t-header-title">
        <span>选项信息</span>
      </div>
      <el-row class="row-bg" justify="space-between" :gutter="10" style="margin-bottom:10px;">
        <el-col>
          <el-table class="t-table-list"  ref="multipleTable" border size="small" :data="questionSubjectOptions" tooltip-effect="dark" style="width:100%;">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="optionNumber" label="选项编号" width="70" align="center">
              <template slot-scope="scope">
                {{scope.row.optionNumber}}
              </template>
            </el-table-column>
            <el-table-column prop="flagAnswer" label="正确答案" width="70" align="center">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.flagAnswer" style="margin-right:1rem;" @change="changeCheckbox(scope.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="optionContent" label="选项内容">
              <template slot-scope="scope">
                <div class="t-editorContent t-textarea" v-html="scope.row.optionContent"></div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="190" align="center" v-if="questionType!='TrueFalse'">
              <template slot="header" slot-scope='scope'>
                <el-button type="text" style="color:#f00;font-weight:600;" size="small" @click="addOption" icon="el-icon-plus">新增选项</el-button>
              </template>
              <template slot-scope="scope">
                <el-button type="success" size="mini" @click="editPaperTitle('questionValue',scope.$index)" style="background-color:#0a0;">编辑</el-button>
                <el-button size="small" type="text"  @click="clearPaperTitle('questionValue',scope.$index)">清空</el-button>
                <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, questionSubjectOptions)">删除选项</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 分析提示 -->
      <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="80px" size="small">
        <el-form-item label="分析提示" prop="answerAnalysis">
          <el-button type="success" size="mini" icon="el-icon-edit" @click="editPaperTitle('tips')" style="background-color:#0a0;">编辑</el-button>
          <el-button size="small" type="text" @click="clearPaperTitle('tips')">清空</el-button>
          <div class="t-editorContent t-textarea t-bgcolor-grey" v-html="form.answerAnalysis"></div>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="8">
      <!-- 相关知识点 -->
      <div class="t-header-title">
        <span>相关知识点</span>
      </div>
      <el-card :style="style">
        <el-tree :data="TreeData" ref="tree" node-key="id" default-expand-all :expand-on-click-node="false" :render-content="renderContent"></el-tree>
      </el-card>
    </el-col>
  </el-row>
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="save ('save')">保 存</el-button>
    <el-button v-if="!this.dataForm.id" type="primary" size="small" @click="save ('saveGoon')">保存并继续新增</el-button>
  </div>
  <!-- 富文本框 -->
  <el-dialog ref="innerDialog" width="750px" title="编辑内容" :visible.sync="innerVisible" append-to-body :close-on-click-modal="true">
    <Vue-editor ref="editor" v-model="editorValue" :editorToolbar="customToolbar"></Vue-editor>
    <div style="margin-top:10px;text-align:right;">
      <el-button size="small" type="primary" @click="innerVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</el-dialog>
</template>
<script>
import {
  getCourseTree,
  getChapterTree,
  getSectionTree,
  getKnowledgeTree
} from '@/server/basic-module'
import {
  getQuestionById,
  createQuestion,
  updateQuestionById
} from '@/server/examination-module'

export default {
  props: ['visible', 'dataForm', 'title'],
  data () {
    return {
      style: '',
      // ----试题知识点树----
      examinationQuestionId: null, // 节点id，试题目录id
      questionType: null, // 试题类型
      // id: null, // 试题id
      TreeData: [],
      editorContentType: 'title',
      // -----富文本框设置----
      innerVisible: false,
      index: 0,
      editorValue: '',
      customToolbar: [
        ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
        ['blockquote', 'code-block'], // 引用，代码块
        [{'header': 1}, {'header': 2}], // 标题，键值对的形式；1、2表示字体大小
        [{'list': 'ordered'}, {'list': 'bullet'}], // 列表
        [{'script': 'sub'}, {'script': 'super'}], // 上下标
        [{'indent': '-1'}, {'indent': '+1'}], // 缩进
        [{'direction': 'rtl'}], // 文本方向
        [{'size': ['small', false, 'large', 'huge']}], // 字体大小
        [{'header': [1, 2, 3, 4, 5, 6, false]}], // 几级标题
        [{'color': []}, {'background': []}], // 字体颜色，字体背景颜色
        [{'font': []}], // 字体
        // [{'align': []}], // 对齐方式
        [{'align': 'center'}, {'align': 'justify'}, {'align': 'right'}],
        ['clean'] // 清除字体样式
        // ['image'] // ['image', 'video'] 上传图片、上传视频
      ],
      // -------表单-------
      form: {
        title: '',
        answerAnalysis: ''
      },
      rules: {
        keyWord: [{required: true, message: '请输入关键字', trigger: 'blur'}],
        difficultyLevel: [{required: true, message: '请选择难易程度', trigger: 'blur'}],
        title: [{required: true, message: '请输入题目', trigger: 'blur'}]
      },
      DifficultyLevelEnumList: [
        {name: '容易', type: 'Easy'},
        {name: '初级', type: 'Primary'},
        {name: '中级', type: 'MiddleRank'},
        {name: '高级', type: 'Advanced'},
        {name: '困难', type: 'Difficulty'}
      ],
      questionSubjectOptions: [],
      knowledgePointWithQuestion: [], // 选取的知识点集合
      AcsiiA: 64,
      checkedCities1: ''
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.index = 0
        this.editorValue = ''
        this.form = {
          title: '',
          answerAnalysis: ''
        }
        this.knowledgePointWithQuestion = []
        this.form = Object.assign({}, this.dataForm)
        // this.id = this.dataForm.id
        this.examinationQuestionId = this.dataForm.examinationQuestionId
        this.questionType = this.dataForm.questionType
        if (this.dataForm.id) {
          this._getQuestionById() // 试题基本信息
        }
        if (this.examinationQuestionId) {
          this._getCourseTree() // 获取对应课程的知识点树
        }
        if (this.questionType === 'TrueFalse') { // 判断题固定选项
          this.questionSubjectOptions = [
            {optionNumber: 'A', flagAnswer: true, optionContent: '正确'},
            {optionNumber: 'B', flagAnswer: false, optionContent: '错误'}
          ]
        } else if (this.questionType === 'SingleChoice' || this.questionType === 'MultipleChoice') {
          // this.AcsiiA = 64
          this.questionSubjectOptions = [
            {optionNumber: 'A', flagAnswer: false, optionContent: ''},
            {optionNumber: 'B', flagAnswer: false, optionContent: ''},
            {optionNumber: 'C', flagAnswer: false, optionContent: ''},
            {optionNumber: 'D', flagAnswer: false, optionContent: ''}
          ]
        } else {
          this.AcsiiA = 64
          this.questionSubjectOptions = []
        }
        this.style = `max-height:${document.body.clientHeight * 0.7 - 100}px;overflow:scroll;`
      }
    },
    editorValue (newVal) {
      if (newVal) {
        if (this.editorContentType === 'title') {
          this.$set(this.form, 'title', this.editorValue)
        } else if (this.editorContentType === 'questionValue') {
          this.questionSubjectOptions[this.index].optionContent = this.editorValue
        } else {
          this.$set(this.form, 'answerAnalysis', this.editorValue)
        }
      }
    }
  },
  methods: {
    // 可以勾选节点： 非课程节点、无子级的节点
    renderContent (h, { node, data, store }, trueOrFalse = true) {
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
              <el-checkbox checked={trueOrFalse} v-model={trueOrFalse} style="margin-right:1rem;" on-change={(trueOrFalse) => this.changeOptions(data, trueOrFalse)}> {node.label}</el-checkbox>
            </span>
          </span>
        </span>
      )
    },
    // ----------------------------------- 勾选树节点 -----------------------------------
    changeCheckbox (row) {
      // 判断题|单选题：勾选当前选框，其他选框取消勾选
      if (row.flagAnswer && (this.questionType === 'SingleChoice' || this.questionType === 'TrueFalse')) {
        this.questionSubjectOptions.forEach(item => {
          if (item.optionNumber !== row.optionNumber) {
            item.flagAnswer = false
          }
        })
      }
    },
    // ----------------------------------------- 查询 -----------------------------------
    _getCourseTree () { // 获取课程树
      this.TreeData = []
      getCourseTree().then(result => {
        let obj = result.find(item => {
          return item.id === this.examinationQuestionId
        })
        this.TreeData.push(obj)
        this._getChapterTree(obj)
      })
    },
    _getChapterTree (node) { // 获取 章列表 树
      let data = {
        courseId: node.id
      }
      getChapterTree(data).then(result => {
        node.children = this.FilterCheckedNodes(result, '_getSectionTree', 'Chapter')
      })
    },
    _getSectionTree (node) { // 获取 节列表 树
      let data = {
        chapterId: node.id
      }
      getSectionTree(data).then(result => {
        node.children = this.FilterCheckedNodes(result, '_getKnowledgeTree', 'Section')
      })
    },
    _getKnowledgeTree (node) { // 获取 知识点列表 树
      let data = {
        sectionId: node.id
      }
      getKnowledgeTree(data).then(result => {
        node.children = this.FilterCheckedNodes(result, '', 'KnowledgePoint')
      })
    },
    FilterCheckedNodes (arr, fun, nodeType) {
      arr.forEach(item => {
        this.knowledgePointWithQuestion.forEach(el => {
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
    _getQuestionById () {
      getQuestionById(this.dataForm.id).then(result => {
        result.title = decodeURI(result.title)
        if (result.title === 'null') {
          result.title = ''
        }
        result.answerAnalysis = decodeURI(result.answerAnalysis)
        if (result.answerAnalysis === 'null') {
          result.answerAnalysis = ''
        }
        this.form = Object.assign({}, result)
        result.questionSubjectOptions.forEach(item => {
          item.optionContent = decodeURI(item.optionContent)
          if (item.optionContent === 'null') {
            item.optionContent = ''
          }
        })
        this.questionSubjectOptions = result.questionSubjectOptions
        this.AcsiiA = this.questionSubjectOptions[this.questionSubjectOptions.length - 1].optionNumber.charCodeAt()
        result.knowledgePointWithQuestion.forEach(item => {
          this.$set(item, 'trueOrFalse', true)
        })
        this.knowledgePointWithQuestion = result.knowledgePointWithQuestion
      })
    },
    /* -----------------------------------------------------------富文本编辑----------------------------------- */
    editPaperTitle (type, index) {
      this.index = 0
      this.editorValue = ''
      this.innerVisible = true
      this.editorContentType = type // 文本内容类型：title-标题，questionValue-选项，tips-分析
      setTimeout(() => {
        this.$refs.editor.quill.focus()
      }, 10)
      if (type === 'title') {
        this.editorValue = this.form.title
      } else if (type === 'questionValue') {
        this.index = index
        this.editorValue = this.questionSubjectOptions[index].optionContent
      } else {
        this.editorValue = this.form.answerAnalysis
      }
    },
    clearPaperTitle (type, index) {
      this.index = 0
      this.editorValue = ''
      if (type === 'title') {
        this.form.title = ''
      } else if (type === 'questionValue') {
        this.index = index
        this.questionSubjectOptions[index].optionContent = ''
      } else {
        this.form.answerAnalysis = ''
      }
    },
    /* -----------------------------------------------------------操作按钮----------------------------------- */
    genarateLevelType (level) { // 根据node的level生成对应的节点类型， 章-chapter|节-section|知识点-knowledgePoint
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
    changeOptions (node, trueOrFalse) { // 复选框选择知识点
      let obj = {
        trueOrFalse: trueOrFalse,
        knowledgePointId: node.id,
        courseCatalogLevel: this.genarateLevelType(node.level) // 类型
      }
      if (this.form.id) {
        this.$set(obj, 'questionId', this.form.id)
      }
      let arr = JSON.parse(JSON.stringify(this.knowledgePointWithQuestion)) // 将知识点集合重赋值
      let finds = arr.find((item, i) => {
        return item.knowledgePointId === obj.knowledgePointId && item.courseCatalogLevel === obj.courseCatalogLevel
      })
      arr.forEach((item, i) => {
        if (item.knowledgePointId === obj.knowledgePointId &&
            item.courseCatalogLevel === obj.courseCatalogLevel &&
            !obj.trueOrFalse
        ) { // 如果集合中存在知识点id，但是又没有被选择，则从集合中删除该数据
          this.knowledgePointWithQuestion.splice(i, 1)
        }
      })
      if (!finds && obj.trueOrFalse) { // 如果集合中不存在该知识点id，且被选中，则push
        this.knowledgePointWithQuestion.push(obj)
      }
    },
    close () {
      this.$emit('update:visible', false)
    },
    addOption () { // 新增选项列
      if (this.questionSubjectOptions.length === 0) {
        this.AcsiiA = 65
      } else {
        this.AcsiiA = this.questionSubjectOptions[this.questionSubjectOptions.length - 1].optionNumber.charCodeAt()
        this.AcsiiA++ // A-65,a-97
      }
      let character = String.fromCharCode(this.AcsiiA) // 将ACSII码转为字符
      let obj = {
        optionNumber: character,
        flagAnswer: false,
        optionContent: null
      }
      this.questionSubjectOptions.push(obj)
    },
    deleteRow (index, rows) { // 删除选项列
      rows.splice(index, 1)
      rows.forEach((item, i) => {
        if (i >= index) {
          item.optionNumber = String.fromCharCode(item.optionNumber.charCodeAt() - 1)
        }
      })
    },
    save (type) {
      if (!this.form.keyWord) {
        this.$alert('请输入关键字')
        return
      }
      if (!this.form.difficultyLevel) {
        this.$alert('请选择试题难易度！')
        return
      }
      if (!this.form.title) {
        this.$alert('请输入题目')
        return
      }
      this.$set(this.form, 'knowledgePointWithQuestion', this.knowledgePointWithQuestion)
      this.$refs.form.validate((valid) => {
        if (!valid) return
        // 遍历选项，如果选项内容为空或者未设置正确答案，不允保存
        let isHaveAnwser = false
        let isAnwserEmpty = false
        this.questionSubjectOptions.forEach(item => {
          if (item.flagAnswer) {
            isHaveAnwser = true
          }
          if (!item.optionContent) {
            isAnwserEmpty = true
          }
        })
        if (!isHaveAnwser || isAnwserEmpty) {
          this.$alert('请设置正确答案 或 选项内容不能为空！')
          return
        }
        // 选项个数少于两个时给出提示
        if (this.questionSubjectOptions.length < 2) {
          this.$confirm(`试题选项个数太少了， 是否继续保存？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }).then(() => {
            this.saveFun(type)
          }).catch(() => { })
        } else {
          this.saveFun(type)
        }
      })
    },
    saveFun (type) {
      if (!this.form.answerAnalysis || this.form.answerAnalysis === 'undefined') {
        this.$set(this.form, 'answerAnalysis', '')
      }
      // 选项富文本框内容转码
      let questionSubjectOptions = JSON.parse(JSON.stringify(this.questionSubjectOptions))
      questionSubjectOptions.forEach(item => {
        item.optionContent = encodeURI(item.optionContent)
      })
      let questionFrom = JSON.parse(JSON.stringify(this.form))
      // this.$set(questionFrom, 'knowledgePointWithQuestion', this.knowledgePointWithQuestion)
      this.$set(questionFrom, 'questionSubjectOptions', questionSubjectOptions)
      this.$set(questionFrom, 'answerAnalysis', encodeURI(questionFrom.answerAnalysis)) // 富文本框需转码
      this.$set(questionFrom, 'title', encodeURI(questionFrom.title)) // 富文本框需转码
      // return ;
      // 保存或更新数据
      if (this.form.id) {
        updateQuestionById(questionFrom).then(() => {
          this.$message.success('保存成功！')
          this.$emit('updateList')
          if (type === 'save') {
            this.close()
          } else {
            this.$set(this.form, 'answerAnalysis', '')
            this.$set(this.form, 'title', '')
            if (this.questionType === 'TrueFalse') { // 判断题固定选项
              this.questionSubjectOptions = [
                {optionNumber: 'A', flagAnswer: true, optionContent: '正确'},
                {optionNumber: 'B', flagAnswer: false, optionContent: '错误'}
              ]
            } else if (this.questionType === 'SingleChoice' || this.questionType === 'MultipleChoice') {
              // this.AcsiiA = 64
              this.questionSubjectOptions = [
                {optionNumber: 'A', flagAnswer: false, optionContent: ''},
                {optionNumber: 'B', flagAnswer: false, optionContent: ''},
                {optionNumber: 'C', flagAnswer: false, optionContent: ''},
                {optionNumber: 'D', flagAnswer: false, optionContent: ''}
              ]
            } else {
              this.AcsiiA = 64
              this.questionSubjectOptions = []
            }
          }
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      } else {
        createQuestion(questionFrom).then(() => {
          this.$message.success('保存成功！')
          this.$emit('updateList')
          if (type === 'save') {
            this.close()
          } else {
            this.$set(this.form, 'answerAnalysis', '')
            this.$set(this.form, 'title', '')
            if (this.questionType === 'TrueFalse') { // 判断题固定选项
              this.questionSubjectOptions = [
                {optionNumber: 'A', flagAnswer: true, optionContent: '正确'},
                {optionNumber: 'B', flagAnswer: false, optionContent: '错误'}
              ]
            } else if (this.questionType === 'SingleChoice' || this.questionType === 'MultipleChoice') {
              // this.AcsiiA = 64
              this.questionSubjectOptions = [
                {optionNumber: 'A', flagAnswer: false, optionContent: ''},
                {optionNumber: 'B', flagAnswer: false, optionContent: ''},
                {optionNumber: 'C', flagAnswer: false, optionContent: ''},
                {optionNumber: 'D', flagAnswer: false, optionContent: ''}
              ]
            } else {
              this.AcsiiA = 64
              this.questionSubjectOptions = []
            }
          }
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }
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
.t-dialog{
  /deep/.el-dialog.customClass{
    min-width:1000px;
  }
}
</style>
