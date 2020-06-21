<template>
<div>
  <div class="t-header-title">
    <span>基本信息</span>
  </div>
  <el-form class="t-operate-filter"  :model="basicForm" size="small">
    <el-col :span="12">
      <el-form-item label="姓名" label-width="120px">
        <div class="t-info-div">{{basicForm.name}}</div>
      </el-form-item>
      <el-form-item label="性别" label-width="120px">
        <el-select v-model="basicForm.sex" :disabled="true">
          <el-option v-for="(item,i) of dictionary.SEX" :key="i" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期" label-width="120px">
        <div class="t-info-div">{{new Date(basicForm.birthday) | formatDate}}</div>
      </el-form-item>
      <el-form-item label="学历" label-width="120px">
          <el-select v-model="basicForm.education"  :disabled="true">
            <el-option v-for="(item,i) of dictionary.Education" :key="i" :label="item.name" :value="item.code"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="照片" label-width="120px">
        <!-- <el-image style="width: 100px; height: 100px" :src="basicForm.photo" :fit="contain"></el-image> -->
        <el-button size="mini" type="info" v-show="!basicForm.photo">未上传照片</el-button>
        <el-button size="mini" type="primary" v-show="basicForm.photo" @click="preview(basicForm.photo)">预览</el-button>
      </el-form-item>
      <el-form-item label="当前状态" label-width="120px">
        <div class="t-info-div">{{basicForm.presentStatus}}</div>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="所属班级" label-width="120px">
          <el-input class="input-append" v-model="basicForm.className" :readonly="true" ></el-input>
      </el-form-item>
      <el-form-item label="身份证号" label-width="120px">
        <div class="t-info-div">{{basicForm.idCard}}</div>
      </el-form-item>
      <el-form-item label="联系电话" label-width="120px">
        <div class="t-info-div">{{basicForm.tel}}</div>
      </el-form-item>
      <el-form-item label="住址" label-width="120px">
        <div class="t-info-div">{{basicForm.address}}</div>
      </el-form-item>
      <el-form-item label="来源" label-width="120px">
          <el-input class="input-append"  v-model="basicForm.source" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="备注" label-width="120px">
        <div class="t-info-div t-textarea">{{basicForm.remarks}}</div>
      </el-form-item>
    </el-col>
  </el-form>
  <div class="t-header-title">
    <span>报名信息</span>
  </div>
  <el-form class="t-operate-filter" :model="basicForm" size="small">
    <el-col :span="12">
      <el-form-item label="报名项目" label-width="120px">
        <div class="t-info-div">{{basicForm.trainingProgramsName}}</div>
      </el-form-item>
      <el-form-item label="报名时间" label-width="120px">
        <div class="t-info-div">{{new Date(basicForm.registrationTime) | formatDate}}</div>
      </el-form-item>
      <el-form-item label="审核状态" label-width="120px">
          <el-input class="input-append"  v-model="basicForm.auditType" :readonly="true"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="毕业学分" label-width="120px" :title="`满${basicForm.creditHour}分满足毕业条件`">
        <div class="t-info-div" >{{basicForm.creditHour}}</div>
      </el-form-item>
      <el-form-item label="审核人" label-width="120px">
          <el-input class="input-append"  v-model="basicForm.auditorName" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="报名审核时间" label-width="120px">
        <div class="t-info-div" v-if="basicForm.auditTime">{{new Date(basicForm.auditTime) | formatDate}}</div>
      </el-form-item>
    </el-col>
  </el-form>
  <el-dialog class="t-dialog" :title="`${basicForm.name}的照片`" v-if="visible" :visible="visible" :close-on-click-modal="false" width="60%" @close="close" append-to-body>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">关 闭</el-button>
    </div>
    <file-preview ref="previewFiles" :fileKey="trustedFileName"></file-preview>
  </el-dialog>
</div>
</template>
<script>
import filePreview from '@/components/filePreview.vue'
export default {
  props: ['basicForm', 'dictionary'],
  data () {
    return {
      id: '',
      form: {},
      visible: false,
      trustedFileName: ''
    }
  },
  components: {filePreview},
  methods: {
    close () {
      this.visible = false
    },
    preview (data) {
      this.visible = true
      this.trustedFileName = data
      setTimeout(() => { // 延迟，以避免方法获取不到
        this.$refs.previewFiles._getPreviewFile() // 获取文件预览地址
      }, 1)
    }
  }
}
</script>
<style lang="less" scoped>
.t-box-card-header{
  line-height:40px;
  border-bottom:1px solid #ddd;
  margin-bottom:20px;
  span{
    padding:11px 100px 12px;
    border:1px solid #ddd;
    background: #ddd;
    border-bottom:none;
    font-weight: 600;
  }
}
/deep/.el-form .el-form-item{
  max-width:80%;
}
/deep/.el-form-item__content{
  overflow: hidden;
}
/deep/.el-input__inner,
/deep/.el-textarea__inner{
  border:none;
  background: #eee;
}
/deep/.el-input__inner,
/deep/.el-textarea__inner,
/deep/.el-input.is-disabled .el-input__inner{
  border:none;
  background: #eee;
  color:#333;
}
/deep/.el-date-editor.el-input,
/deep/.el-date-editor.el-input__inner,
/deep/.el-cascader--small,
/deep/.el-select{
  width:100%;
}
</style>
