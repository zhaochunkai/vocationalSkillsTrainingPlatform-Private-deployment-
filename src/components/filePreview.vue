<template>
<div class="content" v-loading="loading"
  element-loading-text="资源加载中..."
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(255, 255, 255, 0.8)">
  <!-- 文件：.doc,.docx,.xls,.xlsx -->
  <div v-if="showDoc == true">
    <iframe :src="'https://view.officeapps.live.com/op/view.aspx?src='+url" width='100%'  :height="height" frameborder='0'></iframe>
  </div>
  <!-- 文件：.pdf -->
  <div v-else-if="showPdf == true" class="audioOrVideo">
    <iframe frameborder="0" :height="height" width='100%' :src="'../../static/pdfjs/web/viewer.html?file='+url"></iframe>
  </div>
  <!-- 文件：.avi,.mp4,.webm.,m4v,.rmvb,.mpg,.3gp,swf,.mkv -->
  <div v-else-if="showVideo == true" class="audioOrVideo" @mouseenter.stop="enter" @mouseleave.stop="leave">
    <!-- html5视频播放 -->
    <video ref="videoPlayer" controls id="fileVideo" :src="url" width="100%" preload="None">
      ...您的浏览器版本太低，请升级
    </video>
    <img @click="player" class="playBtn" v-show="showPlayBtn" :src="playImg">
  </div>
  <!-- 音频 -->
  <div v-else-if="showAudio == true" class="audioOrVideo">
    <audio id="fileAudio" :src="url" controls autoplay preload="None">...您的浏览器不支持 audio 标签</audio>
  </div>
  <!-- 文件：.jpg,.png,.jpeg. -->
  <div v-else-if="showImage == true" class="images">
    <img width="100%" :src="url" />
  </div>
  <!-- flash视频：embed可以用来插入各种多媒体，格式可以是 swf、Midi、Wav、AIFF、AU、MP3等等 -->
  <div v-else-if="showEmbed == true">
    <embed :src="url" :type="fileType" width="100%" :height="height" wmode="opaque" controls autostart />
  </div>
  <!-- 文件：压缩文件 -->
  <div class="other" v-else-if="showOther == true && fileKey" >
    <el-button type="primary" size="small" @click="download">文件格式不支持预览，请点击下载</el-button>
  </div>
</div>
</template>
<script>
import { baseURL } from '@/config.js'
import { getPreviewFile } from '@/server/files-module'
import { DownloadExternalFiles } from '@/server/blob-module'
import filter from '@/utils/filter'
// import PDFJS from 'pdfjs-dist' // pdfjs
export default {
  props: ['fileKey'],
  data () {
    return {
      url: '',
      height: 500,
      resourceFiles: {},
      loading: true,
      /* ------------------- 文件预览 ------------------- */
      showDoc: false,
      showPdf: false,
      showVideo: false,
      showAudio: false,
      showImage: false,
      showEmbed: false,
      showOther: false,
      fileType: '',
      /* -------------------文件pdf------------------- */
      pdfData: '', // PDF的base64
      scale: 1, // 缩放值
      // --视频
      videoDom: '',
      vcIsPlay: false, // 视频暂停
      playImg: '',
      showPlayBtn: true,
      fileKeyName: null // 文件名称
    }
  },
  watch: {
    fileKey (newVal) {
      if (newVal) {
        this.loading = true
        this.showDoc = false
        this.showPdf = false
        this.showVideo = false
        this.showAudio = false
        this.showImage = false
        this.showEmbed = false
        this.showOther = false
        this.vcIsPlay = false
        this.showPlayBtn = true
        this.playImg = require('../assets/images/play.png')
        this.url = ''
        this._getPreviewFile() // 获取文件预览地址
        this.height = document.body.clientHeight - 270 < 500 ? 500 : document.body.clientHeight - 270        
      }
    }
  },
  methods: {
    enter () {
      this.showPlayBtn = true
      if (this.$refs.videoPlayer.paused) {
        this.playImg = require('../assets/images/play.png')
      } else {
        this.playImg = require('../assets/images/pause.png')
      }
    },
    leave () {
      this.showPlayBtn = false
    },
    player () {
      if (this.$refs.videoPlayer.paused) {
        this.$refs.videoPlayer.play()
        this.playImg = require('../assets/images/pause.png')
      } else {
        this.$refs.videoPlayer.pause()
        this.playImg = require('../assets/images/play.png')
      }
    },
    // previewPDF () {
    //   // 引入pdf.js的字体
    //   // let CMAP_URL = 'https://unpkg.com/pdfjs-dist@2.0.943/cmaps/'
    //   // 读取base64的pdf流文件
    //   // let loadingTask = pdfJS.getDocument({
    //   //   data: this.pdfData, // PDF base64编码
    //   //   cMapUrl: CMAP_URL,
    //   //   cMapPacked: true
    //   // })
    //   let loadingTask = PDFJS.getDocument(this.url)
    //   loadingTask.promise.then((pdf) => {
    //     this.loadFinished = true
    //     let numPages = pdf.numPages
    //     let pageNumber = 1
    //     this.getPage(pdf, pageNumber, numPages)
    //   })
    // },
    getPage (pdf, pageNumber, numPages) {
      let _this = this
      pdf.getPage(pageNumber)
        .then((page) => {
          // 获取DOM中为预览PDF准备好的canvasDOM对象
          let canvas = this.$refs.myCanvas
          let viewport = page.getViewport(_this.scale)
          canvas.height = viewport.height
          canvas.width = viewport.width
          let ctx = canvas.getContext('2d')
          let renderContext = {
            canvasContext: ctx,
            viewport: viewport
          }
          page.render(renderContext).then(() => {
            pageNumber += 1
            if (pageNumber <= numPages) {
              _this.getPage(pdf, pageNumber, numPages)
            }
          })
        })
    },
    // 获取文件预览地址
    _getPreviewFile () {
      if (this.fileKey) {
        // 获取本地资源并预览
        getPreviewFile(this.fileKey).then(res => {
          // 文件名
          this.fileKeyName = res.filePath
          let type = this.iconByType(this.fileKeyName).toLowerCase() // 根据文件后缀名判断文件类型
          let fileTypeLists = ['doc', 'docx', 'rtf', 'fodt', 'odt', 'ods', 'odp', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']
          let filePath = res.filePath
          if (fileTypeLists.indexOf(type) !== -1) {
            filePath = res.pdfPath
          }
          this.url = res.domainName ? res.domainName + filePath : baseURL + '/' + filePath
        }).then(() => {
          this.loading = false
          this.previewFile()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }
    },
    // 获取文件后缀名
    iconByType (data) {
      return data.substr(data.lastIndexOf('.') + 1)
    },
    // 文件预览
    previewFile () {
      if (this.fileKeyName) {
        let type = this.iconByType(this.fileKeyName).toLowerCase() // 根据文件后缀名判断文件类型
        if (type.indexOf('doc') !== -1 || type.indexOf('docx') !== -1 || type.indexOf('rtf') !== -1 || type.indexOf('fodt') !== -1 || type.indexOf('odt') !== -1 || type.indexOf('ods') !== -1 || type.indexOf('odp') !== -1 || type.indexOf('xls') !== -1 || type.indexOf('xlsx') !== -1 || type.indexOf('ppt') !== -1 || type.indexOf('pptx') !== -1) {
          this.showPdf = true
        } else if (type.indexOf('txt') !== -1 || type.indexOf('pdf') !== -1) {
          this.showPdf = true
        } else if (type.indexOf('svg') !== -1 || type.indexOf('png') !== -1 || type.indexOf('jpg') !== -1 || type.indexOf('jpeg') !== -1 || type.indexOf('gif') !== -1 || type.indexOf('bmp') !== -1) {
          this.showImage = true
        } else if (type.indexOf('ogg') !== -1 || type.indexOf('wav') !== -1) {
          this.showAudio = true
        } else if (type.indexOf('avi') !== -1 || type.indexOf('mp4') !== -1 || type.indexOf('webm') !== -1 || type.indexOf('m4v') !== -1 || type.indexOf('rmvb') !== -1 || type.indexOf('mpg') !== -1 || type.indexOf('3gp') !== -1 || type.indexOf('mkv') !== -1) {
          this.showVideo = true
        } else if (type.indexOf('swf') !== -1) { // flash动画
          this.showEmbed = true
          this.fileType = 'application/x-shockwave-flash'
        // } else if (type.indexOf("wma") !== -1) { // wma音频
        //   this.showEmbed = true
        //   this.fileType='application/octet-stream';
        } else if (type.indexOf('mp3') !== -1) { // mp3音频
          this.showEmbed = true
          this.fileType = 'audio/mpeg'
        } else {
          this.showOther = true
          this.$message('当前文件不支持预览，请下载到本地查看')
        }
      }
    },
    // 文件下载
    download () {
      DownloadExternalFiles(this.fileKey).then(res => {
        let title = this.fileKeyName
        // 下载二进制流文件
        filter.downloadBlobFile(res, title)
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
.title{
  text-align:center;
  font-size:24px;
}
.pdf-container {
  width: 750px;
}
.canvas-container {
  border: 1px dashed black;
  position: relative;
}
.audioOrVideo{
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  .playBtn{
    position: absolute;
    left:50%;
    top:50%;
    margin-left:-60px;
    margin-top:-60px;
    cursor:pointer;
  }
}
</style>
