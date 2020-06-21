<template>
<div>
  <el-form class="t-operate-filter" :model="basicForm" size="small">
    <el-col :span="12">
      <el-form-item label="资源标题" label-width="120px">
          <el-input class="input-append" v-model="basicForm.title" :readonly="true" ></el-input>
      </el-form-item>
      <el-form-item label="关键词" label-width="120px">
          <el-input class="input-append"  v-model="basicForm.keyWord" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="资源类型" label-width="120px">
        <el-select v-model="basicForm.type" disabled>
          <el-option v-for="(item,i) of dictionary.ZYLX" :key="i" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="学科" label-width="120px">
          <el-cascader v-model="disciplineList" separator=">" :options="options" :props="props" disabled></el-cascader>
      </el-form-item> -->
      <el-form-item label="发布者" label-width="120px">
        <el-input class="input-append"  v-model="basicForm.creatorName" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="审批人" label-width="120px">
        <el-input class="input-append"  v-model="basicForm.approver" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="审批原因" label-width="120px">
        <el-input class="input-append" v-model="basicForm.rejectReason" :readonly="true" ></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <!-- <el-form-item label="所属资源库" label-width="120px">
          <el-input class="input-append" v-model="basicForm.resourceWarehouse" :readonly="true" ></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="教育类型" label-width="120px">
        <el-select v-model="basicForm.educationType" disabled >
          <el-option v-for="(item,i) of dictionary.JYLX" :key="i" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="媒体格式" label-width="120px">
        <el-select v-model="basicForm.mediaType" disabled>
          <el-option v-for="(item,i) of dictionary.MTGS" :key="i" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="建议学习时长" label-width="120px">
        <div class="t-info-div">
          <span v-if="basicForm.suggestedLearningTime > 0">{{basicForm.suggestedLearningTime | numToSFM}}</span>
        </div>
      </el-form-item>
      <el-form-item label="上传时间" label-width="120px">
        <el-date-picker v-model="basicForm.creationTime" type="date" placeholder="" readonly></el-date-picker>
      </el-form-item>
      <el-form-item label="审批时间" label-width="120px">
        <el-date-picker v-model="basicForm.approvalTime" type="date" placeholder="" readonly></el-date-picker>
      </el-form-item>
      <el-form-item label="资源描述" label-width="120px">
        <el-input class="input-append"  v-model="basicForm.description" type="textarea" :rows="6" :readonly="true"></el-input>
      </el-form-item>
    </el-col>
  </el-form>
</div>
</template>
<script>
import { getDictionaryItems } from '@/server/basic-module'
export default {
  props: ['basicForm', 'disciplineList', 'options'],
  data () {
    return {
      props: {
        value: 'id',
        label: 'name',
        children: 'child',
        checkStrictly: 'true'
      },
      /*  ------------------[-----------数据字典- 字典码-------------- */
      dicJudgeName: {
        ZYLX: 'ZYLX', // 资源类型
        // JYLX: 'JYLX', // 教育类型
        MTGS: 'MTGS' // 媒体格式
      },
      dictionary: {}
    }
  },
  watch: {},
  activated () {
    /*  ------------------[-----------数据字典- 获取数据字典下拉数据-------------- */
    for (let item in this.dicJudgeName) {
      getDictionaryItems(this.dicJudgeName[item]).then(result => {
        this.$set(this.dictionary, item, result)
      })
    }
  },
  methods: {
    /* 接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.initDataList(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.initDataList(SkipCount, pageSize)
    },
    // 获取资源列表，应该增加子库id绑定查询
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      // let data = {
      //   SkipCount: SkipCount,
      //   MaxResultCount: pageSize
      // }
      // getResourceList(data).then(result => {
      // this.tableData = result.items
      //   this.total = result.totalCount;
      // })
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
/deep/.el-cascader.is-disabled .el-cascader__label{
  color:#333;
}
/deep/.el-form .el-form-item{
  max-width:100%;
}
</style>
