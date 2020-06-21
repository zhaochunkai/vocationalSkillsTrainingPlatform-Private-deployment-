<template>
<el-dialog class="t-dialog" v-if="visible" :title="form.id?'编辑考试安排': '新增考试安排'" :visible="visible" :close-on-click-modal="false" width="80%" @close="close" >
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="考试基本信息" name="BasicInfo">  
      <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="100px" size="small">   
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="考试名称" prop="examName">
              <el-input v-model="form.examName"></el-input>
            </el-form-item>
            <el-form-item label="考试类别" prop="examinationType">
              <el-radio-group v-model="form.examinationType">
                <el-radio v-for="(item,i) of examinationTypeList" :key="i" :label="item.type">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="主管单位" prop="sponsorUnit">
              <el-input v-model="filterlabel" @focus="showTreeVisible">
                <el-button slot="append" size="small" @click="clear">清空已选单位</el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认学年学期">
              <el-input v-model="defaultSemester.semesterName" disabled ></el-input>
            </el-form-item>
            <el-form-item label="考试方式" prop="methodOfExamination">
              <el-radio-group v-model="form.methodOfExamination">
                <el-radio v-for="(item,i) of methodOfExamination" :key="i" :label="item.type">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="6"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <el-button size="small" @click="close">返 回</el-button>
        <el-button type="primary" size="small" @click="saveBasic">保存基本信息</el-button>
        <el-button v-if="form.id" type="primary" size="small" @click="next('Arrange')">下一页</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="安排考试" name="Arrange" v-if="form.id">
      <!-- 考试安排设置 -->
      <course-setting v-if="assignSubject" :resourceTree="resourceTree" :id="form.id" :assignSubject="assignSubject" @close="close" @next="next"></course-setting>
    </el-tab-pane>
  </el-tabs>
  <!-- 选择机构 -->
  <el-dialog title="请选择机构" :visible.sync="treeVisible" width="30%" append-to-body :before-close="handleClose">
    <tree-checkbox ref="CheckboxTree" treeType="school" :isMultiple="false" :checkBoxLevel="checkBoxLevel" :currentNodeKeysAll="currentNodeKeysAll" @transmitCheckedList="getTransmitCheckedList"></tree-checkbox>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="treeVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="TreeSubmit">确 定</el-button>
    </span>
  </el-dialog>
</el-dialog>
</template>
<script>
import { getDefaultSemester, getGradeTree } from '@/server/basic-module'
import { createExaminationArrange, updateExaminationArrange, getExaminationArrangeById } from '@/server/examination-module'
import orgTree from '@/components/orgTree.vue'
import treeCheckbox from '@/components/tree-checkbox.vue'
import courseSetting from './examination-course-setting'
export default {
  props: ['visible', 'dataForm'],
  components: {orgTree, courseSetting, treeCheckbox},
  data () {
    return {
      tabList: ['BasicInfo', 'Arrange'],
      activeName: 'BasicInfo',
      form: {},
      rules: {
        examName: [{ required: true, message: '请输入考试名称', trigger: 'blur' }],
        examinationType: [{ required: true, message: '请选择考试类别', trigger: 'blur' }],
        methodOfExamination: [{ required: true, message: '请选择考试方式', trigger: 'blur' }],
        sponsorUnit: [{ required: true, message: '请选择主管单位', trigger: 'blur' }],
      },
      methodOfExamination: [
        {name: '在线考试', type: 'Online'},
        {name: '离线考试', type: 'Offline '}
      ],
      examinationTypeList: [
        {name: '模拟考试', type: 'Simulation'},
        {name: '正式考试', type: 'Official'}
      ],
      defaultSemester: {}, // 默认学期
      // --------选取机构---
      // 选择机构
      treeVisible: false,
      checkBoxLevel: '机构',
      currentNodeAll: [],
      currentNodeKeysAll: [],
      filterlabel: '', // 机构过滤
      // 考场安排
      resourceTree: [],
      transferData: [],
      assignSubject: ''
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.activeName = 'BasicInfo'
        this.assignSubject = {}
        this.currentNodeKeysAll = []
        this.form = Object.assign({}, this.dataForm)
        this.filterlabel = this.dataForm.sponsorUnitName
        if (this.dataForm.id) {
          this._getExaminationArrangeById()
        }
      }
    }
  },
  activated () {
    this.filterlabel = ''
    this._getDefaultSemester() // 获取默认学期
    this._getGradeTree() // 获取项目班级树
  },
  methods: {
    // -----------------------------------------查询-----------------------------------
    _getDefaultSemester () {
      getDefaultSemester().then(result => {
        this.defaultSemester = Object.assign({}, result)
      })
    },
    _getGradeTree () { // 获取班级树
      this.resourceTree = []
      getGradeTree({state: '0,1,2,3'}).then(result => { // 查询所有非结束状态的班级
        for (let i = result.children.length - 1; i >= 0; i--) {
          let item = result.children[i]
          if (item.children.length === 0) {
            result.children.splice(i, 1)
          }
        }
        this.resourceTree.push(result)
      })
    },
    _getExaminationArrangeById () { // 获取考试安排详细信息
      getExaminationArrangeById(this.dataForm.id).then(result => {
        this.assignSubject = result.assignSubject
        this.currentNodeKeysAll.push(result.sponsorUnit)
      })
    },
    // -----------------------------------------操作-----------------------------------
    // 显示机构树选择
    showTreeVisible () {
      setTimeout(() => {
        this.$refs.CheckboxTree.checkNode()
      }, 500)
      this.treeVisible = true
    },
    // 关闭机构树选择
    handleClose () {
      this.treeVisible = false
    },
    // 拿到可勾选的数组件中的数据
    getTransmitCheckedList (data) {
      this.currentNodeAll = data
    },
    // 点击确定的时候验证，并拿到id，lable，和选中的id集合
    TreeSubmit () {
      this.currentNodeKeysAll = []
      if (this.currentNodeAll === 0) {
        this.$alert('还未选择任何机构哦！')
        return
      } else {
        this.currentNodeKeysAll.push(this.currentNodeAll[0].id)
        this.$set(this.form, 'sponsorUnit', this.currentNodeAll[0].id) // 机构id
        this.filterlabel = this.currentNodeAll[0].label
        this.item = this.currentNodeAll[0]
      }
      this.treeVisible = false
    },
    // 保存|更新基本信息
    saveBasic () {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (this.form.id) {
          updateExaminationArrange(this.form).then(result => {
            this.$message.success('基本信息保存成功')
            this.close()
            this.$emit('save')
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        } else {
          createExaminationArrange(this.form).then(result => {
            this.$set(this.form, 'id', result.id)
            this.$message.success('基本信息保存成功')
            this.$emit('save')
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        }
      })
    },
    clear () { // 清空已选机构
      this.form.sponsorUnit = ''
      this.filterlabel = ''
    },
    next (str) { // 上|下一页
      if (!this.form.id) return
      this.activeName = str
    },
    handleClick (tab, event) { },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
