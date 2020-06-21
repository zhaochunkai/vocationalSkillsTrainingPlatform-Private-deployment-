<template>
<el-dialog class="t-dialog" v-if="visible" title="抽取试卷" :visible="visible" :close-on-click-modal="false" width="60%" @close="close" >
</el-dialog>  
</template>
<script>
export default {
  props:['visible','dataForm'],
  data(){
    return {

    }
  },
}
</script>
<style lang="less" scoped>

</style>