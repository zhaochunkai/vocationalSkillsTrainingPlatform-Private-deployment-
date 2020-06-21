<template>
<el-card :style="style">
  <div slot="header" class="t-box-card-header">
    <span>资源信息</span>
  </div>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="资源文件" name="files">
      <resource-files :basicForm="fileInfo" :fileData="fileInfo.files" :options="options" :disciplineList="disciplineList"></resource-files>
    </el-tab-pane>
    <el-tab-pane label="资源属性" name="payment">
      <resource-attribute :basicForm="metaInfo" :options="options" :disciplineList="disciplineList"></resource-attribute>
    </el-tab-pane>
  </el-tabs>
  <div>
    <el-button @click="back" size="small">返 回</el-button>
  </div>
</el-card>
</template>
<script>
import {getResourceById, getResourceMetadata, getExternalDataFirst} from '@/server/online-module'
import resourceFiles from './resource-files.vue'
import resourceAttribute from './resource-attribute.vue'
export default {
  data () {
    return {
      style: '',
      activeName: 'files',
      id: '',
      metaInfo: {},
      fileInfo: {},
      fileData: [],
      options: [],
      disciplineList: []
    }
  },
  components: {resourceFiles, resourceAttribute},
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this.id = this.$route.query.id
    if (this.id) {
      this._getResourceMetadata()
      this._getResourceById()
    }
    // this._getExternalDataFirst()
  },
  methods: {
    _getResourceById () {
      getResourceById(this.id).then(result => {
        result.files = [result.file]
        this.fileInfo = Object.assign({}, result)
        this.disciplineList.push(Number(result.discipline))
      })
    },
    _getResourceMetadata () {
      getResourceMetadata(this.id).then(result => {
        this.metaInfo = Object.assign({}, result, {
          type: result.type + '',
          mediaType: result.mediaType + '',
          educationType: result.educationType + '',
        })
      })
    },
    // // 获取一级学科
    // _getExternalDataFirst () {
    //   getExternalDataFirst().then(result => {
    //     this.options = result
    //     // this.options.forEach(element => {
    //     //   element.child= []
    //     // })
    //   })
    // },
    handleClick (tab, event) {
      // console.log(tab, event);
    },
    back() {
      this.$router.go(-1)
    },
  }
}

</script>
