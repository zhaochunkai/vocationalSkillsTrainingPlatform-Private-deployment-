<template>
<!-- <el-dialog  v-dialogDrag ref="dialog__wrapper" class="t-dialog" :title="form.id?'编辑教室信息': '新增教室信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="50%" @close="close"> -->
<el-dialog class="t-dialog" :title="form.id?'编辑教室信息': '新增教室信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="50%" @close="close">
  <el-card>
    <div slot="header" class="t-box-card-header">
      <strong>选择楼栋</strong>
    </div>
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
      <el-form-item label="楼栋名称" prop="buildingId">
        <el-select
          v-model="form.buildingId"
          filterable
          remote
          reserve-keyword
          placeholder="可输入楼栋名称过滤"
          :remote-method="_getBuildingsPullDown"
          :loading="loading">
          <el-option v-for="item in buildingList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="楼层号" prop="storey">
        <el-select v-model="form.storey" filterable placeholder="请选择楼层">
          <el-option v-for="index of Number(floors)" :label="index+'层'" :value="index" :key="index"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card>
    <div slot="header" class="t-box-card-header">
      <strong>教室信息</strong>
    </div>
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
      <el-col :span="12">
        <el-form-item label="教室名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="面积" prop="area">
          <el-input v-model.number="form.area" type="number" min=0>
            <el-button slot="append" size="small">平方米</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="容量" prop="capacity">
          <el-input v-model.number="form.capacity" type="number" min=0>
            <el-button slot="append" size="small">人</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="教室用途" prop="purpose">
          <el-select v-model="form.purpose">
            <el-option v-for="(item,i) of dictionary.JSYT" :key="i" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-form>
  </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
      <el-button type="primary" size="small" @click="save('saveGoon')">保存并继续新增</el-button>
    </span>
</el-dialog>
</template>
<script>
import {
  getBuildingById,
  createSite,
  updateSite,
  getDictionaryItems,
  getSiteById,
  getBuildingsPullDown
} from '@/server/basic-module'
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      filterlabel: '',
      item: {},
      form: {},
      rules: {
        buildingId: [
          { required: true, message: '请选择楼栋', trigger: 'blur' }
        ],
        storey: [
          { required: true, message: '请选择楼层', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入教室名称', trigger: 'blur' },
          { max: 100, message: '字符长度必须小于100', trigger: 'blur' }
        ],
        purpose: [
          { required: true, message: '请选择教室用途', trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: '请输入容量', trigger: 'blur' }
        ]
      },
      floors: '',
      id: '',
      dicJudgeName: {
        JSYT: 'JSYT' // 教室用途/类型
      },
      dictionary: {},
      // ------------楼栋下来
      Filter: '',
      loading: false,
      list: [],
      buildingList: []
    }
  },
  activated () {
    /* *------------------[-----------数据字典- 获取数据字典下拉数据-------------- */
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
        this.id = this.dataForm.id
        this._getBuildingsPullDown()
        if (this.id) {
          this._getSiteById()
        }
      }
    },
    'form.buildingId' (newVal) {
      if (newVal) {
        this._getBuildingById()
      }
    },
    'form.area' (newVal) {
      if (newVal < 0) {
        this.$set(this.form, 'area', '')
      }
    },
    'form.capacity' (newVal) {
      if (newVal < 0) {
        this.$set(this.form, 'capacity', '')
      }
    }
  },
  methods: {
    // 根据id查询楼栋信息
    _getBuildingById () {
      getBuildingById(this.form.buildingId).then(result => {
        this.floors = result.floors
      })
    },
    // 根据id查询教室信息
    _getSiteById () {
      getSiteById(this.id).then(result => {
        this.form = Object.assign({}, result)
      })
    },
    _getBuildingsPullDown (query) {
      let filter = query ? query : ''
      getBuildingsPullDown(filter).then(res => {
        this.buildingList = res
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
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
          updateSite(this.form).then(result => {
            this.$message.success('保存成功')
            this.$emit('queryList')
            if (type === 'saveGoon') {
              this.form = {}
              this.filterlabel = ''
            } else {
              this.close()
            }
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        } else {
          createSite(this.form).then(result => {
            this.$message.success('保存成功')
            this.$emit('queryList')
            if (type === 'saveGoon') {
              this.form = {}
              this.filterlabel = ''
            } else {
              this.close()
            }
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
