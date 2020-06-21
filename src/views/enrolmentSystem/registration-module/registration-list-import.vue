<template>
  <el-dialog class="t-dialog" title="文件导入" v-if="visible" :visible="visible" :close-on-click-modal="false" width="40%" @close="close">
    <el-row>
      <el-col>
        <div class="t-header-title" style="margin-bottom:1rem;">
          <span><i class="el-icon-upload"></i>上传文件</span>
        </div>
        <el-upload class="upload-demo" :action="httpUrl"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-exceed="handleExceed"
          :file-list="fileList"
          accept=".xls,.xlsx"
          :before-upload="beforeFileUpload"
          :auto-upload="true"
          :on-success="handleSuccess"
          :limit="1"
          list-type="picture">
          <!-- multiple -->
          <el-button size="small" type="primary">选择文件并上传</el-button>
          <el-tag type="danger">请选择格式为.xls,.xlsx的文件，大小不得超过4MB</el-tag>
        </el-upload>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <!-- <el-button type="primary" size="small" @click="save">提 交</el-button> -->
    </div>
  </el-dialog>
</template>
<script>
import {baseURL} from '@/config.js'
import { getDictionaryItems } from '@/server/basic-module';
import { getStudentBasicInfoById } from '@/server/training-module';
import { UploadExternalFiles,} from '@/server/files-module';
export default {
  props: ['programId', 'visible'],
  data () {
    return {
      httpUrl:baseURL+'/Api/StudentInfoImportingExport/Importing?id=',
      photo: null,  
      rules: {
        // name: [{ required: true, message: '请输入姓名', trigger: 'blur' },
      },
      /* ---------图片上传-------- */
      fileList: [],     
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.httpUrl+=this.programId;
      }
    }
  },
  activated() {
  },
  methods: {
    /* ----------------------------------------------图片上传------------------------ */
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    handleExceed(files, fileList) {
      this.$alert(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`)
    },
    beforeFileUpload(file) { // 上传前格式与大小校验
      // const isType = file.type == 'image/png' || file.type == 'image/jpeg';  
      const isLimitSize = file.size / 1024 / 1024 < 100;
      // if (!isType) {
      //   this.$message.error("上传头像图片只能是 PNG、JPG、JPEG 格式!");
      // }
      if (!isLimitSize) {
        this.$message.error("上传文件大小不能超过 4MB!");
      }
      return isLimitSize;      　　  
    },
    handleSuccess(filresponse, file, fileListe) {   // 文件上传
      let reg = /[&\\=?\/\=]/ig;  
      if (reg.test(file.name)) { // 如果包含特殊字符返回false
        this.$alert('文件名中包含特殊符号：& \\ = ? \/ =，请修改文件名称后再重新上传')
        file=new Object();
        return ;
      }
      if (file.status=='success') {
        // this.photo=filresponse[0];
        this.$message.success('文件上传成功！');
      }
      // console.log(file)
      // console.log('filresponse',filresponse);
    },
    /* ---------------------------------------------------------操作按钮------------------------------------------------ */
    close () {
      this.$emit('update:visible', false)
    },
    download() {   // 文件下载

    },
    save () {
      // this.$refs.form.validate((valid) => {
      //   if (!valid) return
      //   this.$emit('save', this.form)
      //   this.close()
      // })
    },
  }
}
</script>
<style lang="less" scoped>
/deep/.el-upload {
    text-align: left;
}
</style>
