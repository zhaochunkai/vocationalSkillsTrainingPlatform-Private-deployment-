<template>
  <el-dialog class="t-dialog" :title="form.id?'编辑专业信息': '新增专业信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="50%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
      <el-col :span="12">
        <el-form-item label="专业代码" prop="code">
          <el-input v-model="form.code" :disabled="form.id?true:false"></el-input>
        </el-form-item>
        <el-form-item label="专业名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="开设机构" prop="agencyId">
          <el-input v-model="filterlabel" @focus="showTreeVisible">
            <el-button slot="append" size="small" @click="clear">清空已选机构</el-button>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="建立日期" prop="establishTime">
          <!-- <el-date-picker v-model="form.establishTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker> -->
          <el-date-picker v-model="form.establishTime" type="date" placeholder="选择日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item label="专业简称" prop="simpleName">
          <el-input v-model="form.simpleName"></el-input>
        </el-form-item>
        <el-form-item label="专业描述" prop="description" type="textarea">
          <el-input v-model="form.description" type="textarea"></el-input>
        </el-form-item>
      </el-col>
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
import treeCheckbox from '@/components/tree-checkbox.vue'
export default {
  props: ['dataForm', 'visible'],
  components: {treeCheckbox},
  data () {
    return {
      pickerOptions: { // 大于当前的禁止
        disabledDate (time) {
          let _now = Date.now()
          return time.getTime() > _now
        }
      },
      item: {},
      form: {},
      rules: {
        name: [
          { required: true, message: '请输入专业名称', trigger: 'blur' },
          { max: 50, message: '字符长度必须小于50', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入专业代码', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z-_]{0,20}$/, message: '只能由20字以内的数字、字母、下划线或横线组成', trigger: 'blur' }
        ],
        establishTime: [
          { required: true, message: '请输入选择日期', trigger: 'blur' }
        ],
        simpleName: [
          { required: true, message: '请输入专业简称', trigger: 'blur' },
          { max: 50, message: '字符长度必须小于50', trigger: 'blur' }
        ],
        description: [
          { max: 300, message: '字符长度必须小于300', trigger: 'blur' }
        ],
        agencyId: { required: true, message: '请选择机构', trigger: 'blur' }
      },
      // 选择机构
      treeVisible: false,
      checkBoxLevel: '机构',
      currentNodeAll: [],
      currentNodeKeysAll: [],
      filterlabel: ''
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.form = Object.assign({}, this.dataForm)
        this.filterlabel = this.form.agencyName
        this.currentNodeKeysAll = [this.dataForm.agencyId]
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
        this.$set(this.form, 'agencyId', this.currentNodeAll[0].id) // 机构id
        this.filterlabel = this.currentNodeAll[0].label
        this.item = this.currentNodeAll[0]
      }
      this.treeVisible = false
    },
    close () {
      this.$emit('update:visible', false)
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
    clear () {
      this.filterlabel = ''
      this.$set(this.form, 'agencyId', '') // 机构id
    }
  }
}
</script>
