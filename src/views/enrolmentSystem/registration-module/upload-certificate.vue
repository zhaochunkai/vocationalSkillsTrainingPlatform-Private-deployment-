<template>
<el-dialog class="t-dialog" title="上传证书和附件" v-if="visible" :visible="visible" :close-on-click-modal="false" width="800px" @close="close">
  <div slot="title">
    <span>上传证书和附件</span>
    <el-tag type="danger" style="color:#f00;" class="t-margin-left">请选择一张格式为PNG、JPG、JPEG的图片，大小不得超过4MB</el-tag>
  </div>
  <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;">
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="certificateName" label="证书名称" width="200" align="center"></el-table-column>
    <el-table-column  fixed="right" label="操作" align="left">
      <template slot-scope="scope">
        <el-upload class="upload-demo"
          action="httpUrl"
          :http-request="handleUploadFile"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-exceed="handleExceed"
          :file-list="scope.row.fileList"
          accept=".png,.jpg,.jpeg"
          :before-upload="beforeFileUpload"
          :limit="1"
          multiple
        >
          <el-button size="small" type="primary" @click="upload(scope.row, scope.$index)">点击上传</el-button>
        </el-upload>
        <el-button class="t-margin-left" size="small" type="primary" v-if="scope.row.fileKey" @click="preview(scope.row.fileKey)">预览图片</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
  </div>
  <el-dialog class="t-dialog" title="文件预览" v-if="fileVisible" :visible="fileVisible" :close-on-click-modal="false" width="60%" @close="fileVisible = false" append-to-body>
    <file-preview ref="previewFiles" :fileKey="fileKey"></file-preview>
  </el-dialog>
</el-dialog>
</template>
<script>
import filePreview from '@/components/filePreview.vue'
import { StudentCertificate } from '@/server/basic-module'
import { UploadExternalFiles } from '@/server/files-module'
import { UploadStudentProgramCertificate } from '@/server/training-module'
export default {
  props: ['dataForm', 'visible', 'certificateList', 'programId'],
  components: {filePreview},
  data () {
    return {
      tableData: [],
      currentIndex: null, // 当前点击的行的下标
      fileKey: '', // 预览的文件
      fileVisible: false
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this._StudentCertificate()
      }
    }
  },
  methods: {
    /* *************************** 查询 *************************** */
    // 获取学生在该项目下的证书列表
    _StudentCertificate () {
      let data = {
        studentId: this.dataForm.id,
        trainingProgramsId: this.programId
      }
      StudentCertificate(data).then(res => {
        this.tableData = res
        this.tableData.forEach(item => {
          if (item.certificateUrl) {
            let name = item.certificateUrl.substring(item.certificateUrl.lastIndexOf('/') + 1)
            this.$set(item, 'fileList', [{name: name}])
          }
        })
      })
    },
    /* *************************** 操作 *************************** */
    upload (row, index) {
      this.currentIndex = index
      console.log('点击', row, index)
    },
    // 照片上传
    handleRemove (file, fileList) {},
    handleExceed (files, fileList) {
      this.$alert(`当前限制选择 1 个文件，本次选择了 ${files.length}个文件，共选择了 ${files.length + fileList.length}个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`).then(() => {})
    },
    beforeFileUpload (file) { // 上传前格式与大小校验
      const isType = file.type === 'image/png' || file.type === 'image/jpeg'
      const isLimitSize = file.size / 1024 / 1024 < 4
      if (!isType) {
        this.$message.error('上传文件只能是 PNG、JPG、JPEG 格式!')
      }
      if (!isLimitSize) {
        this.$message.error('上传文件大小不能超过 4MB!')
      }
      return isLimitSize && isType
    },
    // 文件上传
    handleUploadFile (params) {
      params.onProgress({percent: 0})
      let file = params.file
      let formData = new FormData()
      formData.append('upload', file)
      UploadExternalFiles(formData).then(res => {
        this.$set(this.tableData[this.currentIndex], 'fileKey', res)
        params.onProgress({percent: 100})
        // 文件上传后马上添加到学生报名的项目上
        this.save(this.tableData[this.currentIndex])
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 保存上传的文件
    save (row) {
      let data = {
        studentId: this.dataForm.id,
        trainingProgramsId: this.programId, // 项目id
        certificateTypeId: row.id,
        url: row.fileKey
      }
      UploadStudentProgramCertificate(data).then(() => {
        this.$message.success('文件保存成功')
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 预览上传的文件
    preview (fileKey) {
      this.fileVisible = true
      this.fileKey = fileKey
      // 延迟，以避免方法获取不到
      setTimeout(() => {
        this.$refs.previewFiles._getPreviewFile() // 获取文件预览地址
      }, 1)
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-upload-list {
  display: inline-block;
  float: right;
  width: 300px;
}
/deep/.el-form .el-form-item {
  max-width:80%;
}
.upload-demo{
  display: inline-block;
}
</style>
