<template>
  <el-dialog class="t-dialog" :title="form.id?'编辑楼栋信息': '新增楼栋信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="50%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="楼栋号" prop="buildingNumber">
            <el-input v-model="form.buildingNumber" :disabled="form.id?true:false"></el-input>
          </el-form-item>
          <el-form-item label="楼栋名称" prop="buildingName">
            <el-input v-model="form.buildingName"></el-input>
          </el-form-item>
          <el-form-item label="楼层数" prop="floors">
            <el-input v-model.number="form.floors" type="number" min=0 max=100></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属校区" prop="campusId">
            <el-select v-model="form.campusId">
              <el-option v-for="(item,i) of campusList" :key="i" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼栋类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择">
              <el-option-group v-for="group in options" :key="group.code" :label="group.name">
                <el-option v-for="item in group.options" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
      <el-button type="primary" size="small" @click="save('saveGoon')">保存并继续新增</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  createBuilding,
  updateBuilding,
  getDictionaryItems,
  getBuildingById
} from '@/server/basic-module'
export default {
  props: ['dataForm', 'visible','campusList'],
  data () {
    return {
      form: {},
      rules: {
        buildingNumber: [
          { required: true, message: '请输入楼栋号', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z-_]{0,20}$/, message: '只能由20字以内的数字、字母、下划线或横线组成', trigger: 'blur' }
        ],
        buildingName: [
          { required: true, message: '请输入楼栋名称', trigger: 'blur' },
          { max: 100, message: '字符长度必须小于100', trigger: 'blur' }
        ],
        campusId: [
          { required: true, message: '请选择校区', trigger: 'blur' }
        ],
        floors: [
          { required: true, message: '请输入楼层数,必须是数字', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择楼栋类型', trigger: 'blur' }
        ]
      },
      id: '',
      /* -------------- 数据字典- 字典码 -------------- */
      dicJudgeName: {
        JZWYT: 'JZWYT' // 建筑物用途/类型
      },
      dictionary: {},
      options: []
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
    'form.floors' (newVal) {
      if (newVal < 0) {
        this.$set(this.form, 'floors', '')
      }
    },
    visible (newVal) {
      this.form = {}
      if (newVal) {
        this.id = this.dataForm.id
        if (this.id) {
          this._getBuildingById()
        }
      }
    },
    dictionary () {
      let newDics = []
      Object.assign(newDics, this.dictionary.JZWYT) // 复制数据
      // 将code以0结尾的数据放到options中，并从原数组newDics中删除
      for (let i = newDics.length - 1; i >= 0; i--) {
        if (new RegExp(/0$/g).test(newDics[i].code)) {
          this.options.push(newDics[i])
          newDics.splice(i, 1)
        }
      }
      // 比较this.options和newDics两个数组，将code第一个字符相同的数组push到元素对象属性中
      for (let n = 0; n < this.options.length; n++) {
        this.options[n].options = []
        for (let m = 0; m < newDics.length; m++) {
          if (newDics[m].code.charAt(0) === this.options[n].code.charAt(0)) {
            this.options[n].options.push(newDics[m])
          }
        }
      }
    }
  },
  methods: {
    // 根据id获取楼栋信息
    _getBuildingById () {
      getBuildingById(this.id).then(result => {
        this.form = Object.assign({}, result)
      })
    },
    close () {
      this.$emit('update:visible', false)
    },
    clear () {
      this.form.agencyCode = ''
      this.filterlabel = ''
    },
    save (type) {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (this.form.id) {
          updateBuilding(this.form).then(result => {
            this.$message.success('保存成功')
            this.$emit('save', this.form)
            if (type === 'saveGoon') {
              this.form = {}
              return
            }
            this.close()
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        } else {
          createBuilding(this.form).then(result => {
            this.$message.success('保存成功')
            this.$emit('save', this.form)
            if (type === 'saveGoon') {
              this.form = {}
              return
            }
            this.close()
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        }
      })
    }
  }
}
</script>
