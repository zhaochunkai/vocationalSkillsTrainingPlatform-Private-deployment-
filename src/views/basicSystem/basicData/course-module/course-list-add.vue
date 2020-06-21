<template>
  <el-dialog class="t-dialog" :title="form.id?'编辑课程信息': '新增课程信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="50%" height="50%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="110px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="课程代码" prop="code">
            <el-input v-model="form.code"  :disabled="form.id?true:false"></el-input>
          </el-form-item>
          <el-form-item label="课程名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="开设机构" prop="institutionId">
            <el-input v-model="filterlabel" @focus="showTreeVisible">
              <el-button slot="append" size="small" @click="clear">清空已选机构</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授课方式" prop="teachingWay">
            <el-select v-model="form.teachingWay">
              <el-option v-for="(item,i) of dictionary.SKFS" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考核方式" prop="testingWay">
            <el-select v-model="form.testingWay">
              <el-option v-for="(item,i) of dictionary.KSXS" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程描述" prop="description" >
            <el-input v-model="form.description" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
      <el-button type="primary" size="small" @click="saveGoon">保存并继续新增</el-button>
    </span>
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
import {
  getDictionaryItems,
  getCourseById
} from '@/server/basic-module'
import treeCheckbox from '@/components/tree-checkbox.vue'
export default {
  props: ['dataForm', 'visible'],
  components: {treeCheckbox},
  data () {
    return {
      item: {},
      form: {},
      rules: {
        code: [
          { required: true, message: '请输入课程代码', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z-_]{0,20}$/, message: '只能由20字以内的数字、字母、下划线或横线组成', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { max: 100, message: '字符长度必须小于100', trigger: 'blur' },
        ],
        teachingWay: [
          { required: true, message: '请输入授课方式', trigger: 'blur' },
          { max: 200, message: '字符长度必须小于20', trigger: 'blur' }
        ],
        testingWay: [
          { required: true, message: '请输入考核方式', trigger: 'blur' },
          { max: 20, message: '字符长度必须小于20', trigger: 'blur' }
        ],
        institutionId: [
          { required: true, message: '请选择机构', trigger: 'blur' }
        ],
        description: [
          { max: 500, message: '字符长度必须小于500', trigger: 'blur' }
        ]
      },
      schoolListTree: [],
      enterpriseList: [],
      /* -----------------[------------数据字典-------------- */
      dicJudgeName: {
        SKFS: 'SKFS',
        KSXS: 'KSXS'
      },
      dictionary: {},
      // 选择机构
      treeVisible: false,
      checkBoxLevel: '机构',
      currentNodeAll: [],
      currentNodeKeysAll: [],
      filterlabel: ''
    }
  },
  activated () {
    /* -------------- 数据字典- 获取数据字典下拉数据 -------------- */
    for (let item in this.dicJudgeName) {
      getDictionaryItems(this.dicJudgeName[item]).then(result => {
        this.$set(this.dictionary, item, result)
      })
    }
  },
  watch: {
    visible (newVal) {
      this.form = {}
      if (newVal) {
        this.filterlabel = ''
        if (this.dataForm.id) {
          getCourseById(this.dataForm.id).then(result => {
            this.form = Object.assign({}, result)
            this.filterlabel = result.institutionName
            this.currentNodeKeysAll = [result.institutionId]
          })
        }
      }
    }
  },
  methods: {
    /* ------------------------- 操作 ------------------------- */
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
        this.$set(this.form, 'institutionId', this.currentNodeAll[0].id) // 机构id
        this.filterlabel = this.currentNodeAll[0].label
        this.item = this.currentNodeAll[0]
      }
      this.treeVisible = false
    },
    close () {
      this.$emit('update:visible', false)
    },
    clear () {
      this.form.institutionId = ''
      this.filterlabel = ''
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.$emit('save', this.form)
        this.close()
      })
    },
    saveGoon () {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.$emit('save', this.form)
      })
      this.form = {}
      this.filterlabel = ''
    },
  }
}
</script>
