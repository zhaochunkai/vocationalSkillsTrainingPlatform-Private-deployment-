<template>
  <el-dialog class="t-dialog" title="文件预览" v-if="visible" append-to-body :visible="visible" :close-on-click-modal="false" width="75%" @close="close">
    <el-row :gutter="30">
      <el-col :span="16">
        <h4>{{form.file?form.file.webPath: ''}}</h4>
        <!-- <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player> -->
        <file-preview ref="previewFiles" :fileKey="this.dataForm.fileKey"></file-preview>
      </el-col>
      <el-col :span="8">
        <el-form class="t-form-block" ref="form" :model="form" label-width="80px" size="small">
          <el-form-item label="文件名" prop="trustedFileName">
            <div class="t-info-div">{{form.file?form.file.webPath: ''}}</div>
          </el-form-item>
          <el-form-item label="关键词" prop="keyWord">
            <div class="t-info-div">{{form.keyWord}}</div>
          </el-form-item>
          <el-form-item label="发布人" prop="creatorName">
            <div class="t-info-div">{{form.creatorName}}</div>
          </el-form-item>
          <el-form-item label="发布时间" prop="creationTime">
            <div class="t-info-div" v-if="form.creationTime">{{new Date(form.creationTime.creationTime) | formatAllDate}}</div>
          </el-form-item>
          <el-form-item label="资源类型" prop="resourceWarehouseId">
            <el-select v-model="form.type" disabled>
              <el-option v-for="(item,i) of dictionary.ZYLX" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源大小" prop="file">
            <div class="t-info-div">{{form.file?form.file.fileSize: ''}}</div>
          </el-form-item>
          <el-form-item label="浏览次数" prop="browseCount">
            <div class="t-info-div">{{form.browseCount}}</div>
          </el-form-item>
          <el-form-item label="下载次数" prop="downloadCount">
            <div class="t-info-div">{{form.downloadCount}}</div>
          </el-form-item>
        </el-form>
        <div style="margin:20px 0;display:block;">
          <el-button size="small" @click="close">返 回</el-button>
          <el-button type="primary" size="small" @click="download">点击下载</el-button>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import filter from '@/utils/filter.js'
import { getDictionaryItems } from '@/server/basic-module'
import { DownloadExternalFiles } from '@/server/blob-module'
import {
  getResourcePlanInfo
} from '@/server/online-module'
import filePreview from '@/components/filePreview.vue'
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      form: {},
      standard: '',
      activeName: 'upload',
      trustedFileName: '',
      /*  ------------------[-----------数据字典- 字典码-------------- */
      dicJudgeName: {
        ZYLX: 'ZYLX' // 资源类型
      },
      dictionary: {}
    }
  },
  components: {filePreview},
  watch: {
    visible (newVal) {
      if (newVal) {
        if (this.dataForm.id) {
          this._getDictionaryItems()
        }
      }
    }
  },
  methods: {
    /* ----------------------------- 查询 ----------------------------- */
    // 获取数据字典下拉数据
    _getDictionaryItems () {
      for (let item in this.dicJudgeName) {
        getDictionaryItems(this.dicJudgeName[item]).then(result => {
          this.$set(this.dictionary, item, result)
        })
      }
      this._getResourcePlanInfo()
    },
    // 获取文件播放信息
    _getResourcePlanInfo () {
      getResourcePlanInfo(this.dataForm.id).then(result => {
        this.form = Object.assign({}, result)
        this.trustedFileName = this.form.file ? this.form.file.webPath : ''
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    /* ----------------------------- 操作 ----------------------------- */
    close () {
      this.$emit('update:visible', false)
    },
    choose () { // 在父组件中调用子组件的方法
      setTimeout(() => { // 延迟，以避免方法获取不到
        if (this.dataForm.fileKey) {
          this.trustedFileName = this.form.file ? this.form.file.webPath : ''
          this.$refs.previewFiles._getPreviewFile() // 获取文件预览地址
        }
      }, 1)
    },
    // 下载
    download () {
      DownloadExternalFiles(this.dataForm.fileKey).then(res => {
        // 下载二进制流文件
        filter.downloadBlobFile(res, this.trustedFileName)
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
</script>
<style lang="less" scoped>
.txt{
  background: #eee;
  line-height:1.8;
}
/deep/.el-form .el-form-item{
  max-width:80%;
}
/deep/.el-select{
  width:100%;
}
</style>
