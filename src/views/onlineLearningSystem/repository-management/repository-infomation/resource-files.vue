<template>
<div>
  <div slot="header" class="t-box-card-header">
    <span>基本信息</span>
  </div>
  <el-form class="t-operate-filter" :model="basicForm" size="small">
    <el-form-item label="资源标准" label-width="120px">
      <el-select v-model="basicForm.standard" :disabled="true" >
        <el-option v-for="(item,i) of dictionary.ZYBZ" :key="i" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="资源标题" label-width="120px">
      <el-input class="input-append"  v-model="basicForm.title" :readonly="true"></el-input>
    </el-form-item>
    <el-form-item label="所属资源库" label-width="120px">
      <el-input class="input-append"  v-model="basicForm.resourceWarehouse" :readonly="true"></el-input>
    </el-form-item>
    <!-- <el-form-item label="学科" label-width="120px">
      <el-input class="input-append"  v-model="basicForm.discipline" :readonly="true"></el-input>
      <el-cascader v-model="disciplineList" separator=">" :options="options" :props="props" disabled></el-cascader>
    </el-form-item> -->
    <el-form-item label="发布者" label-width="120px">
      <el-input class="input-append"  v-model="basicForm.creatorName" :readonly="true"></el-input>
    </el-form-item>
  </el-form>
  <div slot="header" class="t-box-card-header">
    <span>文件列表</span>
  </div>
  <!-- 表格 -->
  <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="fileData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="trustedFileName" label="文件名称">
      <template slot-scope="scope">
        <el-button type="text" style="color:#00f" @click="fileInfo(scope.row)">{{scope.row.webPath}}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="fileSize" label="大小" >
      <template slot-scope="scope">
        {{scope.row.fileSize}}
      </template>
    </el-table-column>
    <el-table-column  fixed="right" label="操作" width="250" align="center">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="download(basicForm.fileKey ,basicForm.title)">点击下载</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 资源文件内容 -->
  <files-info ref="fileInformation" :dataForm="addEditForm" :visible.sync="addEditVisible"></files-info>
</div>
</template>
<script>
import filter from '@/utils/filter.js'
import { getDictionaryItems } from '@/server/basic-module'
import { DownloadExternalFiles } from '@/server/blob-module'
import filesInfo from './resource-files-info'
export default {
  props: ['basicForm', 'fileData', 'options', 'disciplineList'],
  components: {filesInfo},
  data () {
    return {
      id: '',
      form: {},
      addEditForm: {},
      addEditVisible: false,
      props: {
        value: 'id',
        label: 'name',
        children: 'child',
        checkStrictly: 'true'
      },
      /* -------------- 数据字典- 字典码 -------------- */
      discrible: {},
      dicJudgeName: {
        ZYBZ: 'ZYBZ', // 资源标准
        ZYLX: 'ZYLX', // 资源类型
        // JYLX: 'JYLX', // 教育类型
        MTGS: 'MTGS' // 媒体格式
      },
      dictionary: {}
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
  methods: {
    /* ----------------------------- 操作 ----------------------------- */
    fileInfo (data) {
      this.addEditForm = Object.assign({}, data, {
        fileKey: this.basicForm.fileKey,
        id: this.basicForm.id
      })
      this.addEditVisible = true
      this.$refs.fileInformation.choose() // 在父组件中调用子组件的方法
    },
    // 下载
    download (fileKey, fileName) {
      DownloadExternalFiles(fileKey).then(res => {
        // 下载二进制流文件
        filter.downloadBlobFile(res, fileName)
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
  max-width:60%;
}
/deep/.el-input__inner,
/deep/.el-textarea__inner,
/deep/.el-input.is-disabled .el-input__inner{
  border:none;
  background: #eee;
  color:#333;
}
/deep/.el-cascader--small,
/deep/.el-select{
  width:100%;
}
/deep/.el-cascader.is-disabled .el-cascader__label{
  color:#333;
}
</style>
