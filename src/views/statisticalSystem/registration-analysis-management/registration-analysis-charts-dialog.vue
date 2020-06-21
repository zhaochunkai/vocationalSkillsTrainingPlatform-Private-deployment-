<template>
  <el-dialog class="t-dialog" :title="title" v-if="visible" :visible="visible" :close-on-click-modal="false" width="70%" @close="close">   
    <el-card v-loading="loading">      
      <el-row :gutter="20">
        <!-- 学历占比 -->
        <el-col :span="12">
          <circular-graph v-if="educationLegendData.length>0 && educationRatio.length>0" height="400px" yName="" title="学历占比" :dataList="educationRatio" :legendData="educationLegendData" :colorData="colorData" labelFormatter="{b|{b}}：{d}%" tooltipFormatter="{b}: <br/> 占比：{d}%" orient="horizontal"></circular-graph>
        </el-col>
        <!-- 学生来源占比 -->
        <el-col :span="12">
          <pie-graph v-if="sourceRatioLegendData.length>0 && sourceRatio.length>0" height="400px" yName="" title="学生来源占比" :dataList="sourceRatio" :legendData="sourceRatioLegendData" :colorData="colorData" labelFormatter="{b|{b}}：{d}%" tooltipFormatter="{b}: <br/> 占比：{d}%" orient="horizontal"></pie-graph>
        </el-col>
      </el-row>
    </el-card>
  </el-dialog>
</template>
<script>
import { getDictionaryItems } from '@/server/basic-module';
// import { getEvaluationIndicatorById } from '@/server/online-module';
import circularGraph from '@/components/circular-graph'
import pieGraph from '@/components/pie-graph'
export default {
  props: ['dataForm', 'visible','title'],
  components: {circularGraph,pieGraph},
  data () {
    return {
      loading:true,
      // --------------环形图-学历占比---------------------
      colorData: ['#a169f1','#ffae88','#00f','#32b2ef','#ff7da1','#f60','#0fa','#0a9'],
      // dataList: [{value:335, name: '直达'}]
      educationRatio: [],  // 学历数据
      educationLegendData: [], // 学历色块
      // --------------环形图-来源占比---------------------
      sourceRatio: [],  // 来源数据
      sourceRatioLegendData: [],

    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.loading=true;
        setTimeout(() => {
          this.transData()
        },1000)
      }
    },
  },
  methods: {
    transData() {
      this.sourceRatio= []  // 学生来源占比
      this.sourceRatioLegendData= []  // 学生来源占比色块
      this.educationRatio= []  // 学历占比
      this.educationLegendData= []  // 学历占比色块
      if (JSON.stringify(this.dataForm)!="{}") {          
        this.dataForm.educationRatio.forEach(item => {
          let obj={
            name:item.name,
            value:Number(item.proportion)
          }
          this.educationRatio.push(obj)
          this.educationLegendData.push(item.name)
        })
        this.dataForm.sourceRatio.forEach(item => {
          let obj={
            name:item.name,
            value:Number(item.proportion)
          }
          this.sourceRatio.push(obj)
          this.sourceRatioLegendData.push(item.name)
        })
        this.loading=false;
      }
    },
    close () {
      this.$emit('update:visible', false)
    },
  }
}
</script>
