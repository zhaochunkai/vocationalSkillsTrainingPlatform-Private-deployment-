<template>
  <el-dialog class="t-dialog" :title="form.id?'编辑报名': '新增报名'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="60%" @close="close">
    <div v-if="!this.dataForm.id">
      <div class="t-header-title">
        <span>检测学员</span>
      </div>
      <el-form class="t-form-block" :inline="true" label-width="120px" size="small" @keyup.enter.native="checkStudent">
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model.number="tel" type="number" placeholder="输入电话号码检索该学员是否存在"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="checkStudent">检索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showForm">直接新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="this.dataForm.id || !studentIsExist">
      <div class="t-header-title">
        <span>填写资料</span>
      </div>
      <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-col :span="12">
          <el-form-item label="学习项目">
            <el-input v-model="form.nodeName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="身份证号码" prop="idCard">
            <el-input v-model="idCard"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="form.tel"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="form.remarks" type="textarea" autosize></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-select v-model="form.sex">
              <el-option v-for="(item,i) of dictionary.sex" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学历" prop="education">
            <el-select v-model="form.education">
              <el-option v-for="(item,i) of dictionary.Education" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker v-model="form.birthday" type="date" placeholder="根据身份证号自动生成" :picker-options="pickerOptions" value-format="yyyy-MM-dd" disabled> </el-date-picker>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" type="email"></el-input>
          </el-form-item>
          <el-form-item label="住址" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item label="照片" prop="photo" align="left">
            <el-upload class="upload-demo"
              action="httpUrl"
              :http-request="handleUploadFile"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-exceed="handleExceed"
              :file-list="fileList"
              accept=".png,.jpg,.jpeg"
              :before-upload="beforeFileUpload"
              :limit="1"
              list-type="picture">
              <!-- multiple -->
              <el-button size="small" type="primary">点击上传</el-button>
              <el-tag type="danger">请选择一张格式为PNG、JPG、JPEG的图片，大小不得超过1MB</el-tag>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">返 回</el-button>
        <el-button type="primary" size="small" @click="save">保 存</el-button>
        <el-button type="primary" size="small" @click="saveGoon">保存并继续新增</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {baseURL} from '@/config.js'
import {getDictionaryItems} from '@/server/basic-module'
import {
  getStudentBasicInfoById,
  CheckStudentInfoPresence,
  createStudentEntryAgainEnroll
} from '@/server/training-module'
import {UploadExternalFiles} from '@/server/files-module'
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      httpUrl: baseURL + '/Api/ExternalFiles/Upload',
      form: {},
      isTel: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[189])\d{8}$/,
      idCard: null,
      idCardReg: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
      rules: {
        name: [{required: true, message: '请输入姓名', trigger: 'blur'},
          {max: 30, message: '字符长度必须小于30', trigger: 'blur'},
          {pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '姓名必须是2~6位中文字符', trigger: 'blur'}
        ],
        sex: [{required: true, message: '请选择性别', trigger: 'blur'}],
        idCard: [
          {required: true, message: '请输入身份证号', trigger: 'blur'},
          {pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/, message: '请输入正确的身份证号', trigger: 'blur'}
        ],
        birthday: [{required: true, message: '请选择出生日期', trigger: 'blur'}],
        tel: [
          {required: true, message: '请输入联系电话', trigger: 'blur'},
          {pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[189])\d{8}$/, message: '请输入正确的手机号', trigger: 'blur'}
        ],
        education: [{required: true, message: '请选择学历', trigger: 'blur'}],
        email: [{type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur'}]
      },
      pickerOptions: { // 大于当前的禁止
        disabledDate (time) {
          let _now = Date.now()
          return time.getTime() < _now
        }
      },
      //  图片上传
      btnShow: false,
      fileList: [],
      // 二次报名
      tel: null,
      studentIsExist: true, // 学生是否存在，true-存在，false-不存在
      /* -------------- 数据字典- 字典码 -------------- */
      dicJudgeName: {
        sex: 'SEX', // 性别
        Education: 'Education' // 学历
      },
      dictionary: {}
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.studentIsExist = true
        this.idCard = null
        this.tel = null
        this.form = Object.assign({}, this.dataForm)
        this.fileList = []
        if (this.dataForm.id) {
          this.studentIsExist = true
          this._getStudentBasicInfoById()
        }
      }
    },
    idCard (newVal) {
      if (newVal) {
        if (this.idCardReg.test(newVal)) {
          let birthday = newVal.substr(6, 4) + '-' + newVal.substr(10, 2) + '-' + newVal.substr(12, 2)
          this.$set(this.form, 'birthday', birthday)
        }
        this.$set(this.form, 'idCard', newVal)
      }
    },
    tel (newVal) {
      if (newVal < 0) {
        this.tel = ''
      }
    }
  },
  activated () {
    /* 获取数据字典下拉数据 */
    for (let item in this.dicJudgeName) {
      getDictionaryItems(this.dicJudgeName[item]).then(result => {
        this.$set(this.dictionary, item, result)
      })
    }
  },
  methods: {
    /* **************************** 查询 **************************** */
    _getStudentBasicInfoById () {
      let data = {
        trainingProgramsId: this.dataForm.nodeId,
        id: this.dataForm.id
      }
      getStudentBasicInfoById(data).then(result => {
        this.form.education = result.education
        this.form.photo = result.photo
        this.form.sex = result.sex
        this.idCard = result.idCard
        if (result.photo) {
          this.fileList = [{
            name: result.photo
          }]
        }
      })
    },
    // 照片上传
    handleRemove (file, fileList) {
      this.form.photo = null
    },
    handleExceed (files, fileList) {
      this.$alert(`当前限制选择 1 个文件，本次选择了 ${files.length}个文件，共选择了 ${files.length + fileList.length}个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`).then(() => {
        this.btnShow = false
      })
    },
    beforeFileUpload (file) { // 上传前格式与大小校验
      const isType = file.type === 'image/png' || file.type === 'image/jpeg'
      const isLimitSize = file.size / 1024 / 1024 < 1
      if (!isType) {
        this.$message.error('上传头像图片只能是 PNG、JPG、JPEG 格式!')
      }
      if (!isLimitSize) {
        this.$message.error('上传文件大小不能超过 1MB!')
      }
      let reg = /[&\\=?\/\=]/ig
      if (reg.test(file.name)) {
        this.$message.error('文件名中包含特殊符号：& \\ = ? \/ =，请修改文件名称后再重新上传')
      }
      return isLimitSize && isType && !reg.test(file.name)
    },
    // 文件上传
    handleUploadFile (params) {
      console.log(params)
      params.onProgress({percent: 0})
      let file = params.file
      let formData = new FormData()
      formData.append('upload', file)
      UploadExternalFiles(formData).then(res => {
        // 返回的res是一个key，直接存key即可
        this.btnShow = true
        this.$message.success('文件上传成功！')
        this.form.photo = res
        params.onProgress({percent: 100})
      }).catch(err => {
        this.btnShow = false
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    /* ---------------------------------------------------------查询------------------------------------------------ */
    checkStudent () {
      if (!this.tel || !this.isTel.test(this.tel)) {
        this.$alert('请输入正确的手机号')
        return
      }
      CheckStudentInfoPresence(this.tel).then((result) => {
        if (!result) { // 学员不存在
          this.studentIsExist = false
          this.$message.warning('未检测到学员信息，请填写学员资料')
          this.$set(this.form, 'tel', this.tel)
        } else {
          this.studentIsExist = true
          this.$confirm(`已检测到学员信息，是否报名项目【${this.dataForm.nodeName}】？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            createStudentEntryAgainEnroll(result.id, this.dataForm.nodeId).then(() => { // 进行二次报名
              this.$message.success('报名成功！')
              this.$emit('updateList'); // 刷新列表数据
              this.$emit('update:visible', false)
            }).catch(err => {
              this.$message({
                showClose: true,
                message: err.message,
                type: 'error'
              })
            })
          }).catch(() => {})
        }
      })
    },
    /* ---------------------------------------------------------操作------------------------------------------------ */
    showForm () {
      this.studentIsExist = false
      this.$set(this.form, 'tel', this.tel)
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
      let registrationProject = this.form.registrationProject
      let nodeName = this.form.nodeName
      this.form = Object.assign({
        registrationProject: registrationProject,
        nodeName: nodeName
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-upload {
    text-align: left;
}
</style>
