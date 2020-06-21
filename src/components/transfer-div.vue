<template>
<div>
  <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入名称检索" v-model="value" :data="dataList" :props="alias" :titles="['未分配', '已分配']" @change="changeMethod"></el-transfer>
</div>
</template>

<script>
export default {
  props: ['dataList', 'alias', 'chooseValue', 'isMultiple'],
  data () {
    return {
      // /* data: [
      //   {key:1,label: 'sss1'},
      //   {key:2,label: 'sss1'},
      // ],*/
      value: [],
      data: [],
      filterMethod (query, item) {
        return item.name.indexOf(query) > -1;
      }
    };
  },
  watch: {
    chooseValue () { // 将父组件的数据当做默认值赋值给已分配列表
      this.value = this.chooseValue;
    },
  },
  methods: {
    changeMethod (item) {
      if (!this.isMultiple) {
        if (item.length !== 1) {
          this.$alert('能且只能选择一项数据！数据已清空，请重新选择！')
          this.value = []
          return
        }
      }
      this.$emit('saveTransfer',item)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-dialog__header {
  border-bottom: 1px solid #ddd;
}
/deep/.el-dialog .el-dialog__body{
  padding:20px;
}
/deep/.el-transfer {
  max-width: 90%;
  // margin: 0 auto 60px;
}
/deep/.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label{
  font-size:14px;
}
/deep/.el-checkbox__label span{
  font-size:13px;
}
/deep/.el-transfer-panel{
  width:40%;
}
/deep/.el-transfer__buttons{
  padding:0 10px;
}
.saveBtn{
  position:absolute;
  right:30px;
  bottom:30px;
}
.backBtn{
  position:absolute;
  right:120px;
  bottom:30px;
}
</style>
