<template>
<!-- 多条柱状图 -->
  <div :style="{height:height}" ref="dataEchart" id="charts"></div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: () => {
        return "400px"
      }
    },
    title: {
      type: String,
      default: ''
    },
    sourceData: {
      type: Array,
      default: () => []
    },
    // yData: {
    //   type: Array,
    //   default: () => []
    // },
    yName: '',
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    if (this.sourceData && this.sourceData.length) {
      this.initChart()
    }
  },
  watch: {
    sourceData: {
      deep: true,
      handler (val) {
        this.initChart(val)
      }
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose()
    this.chart = null;
  },
  methods: {
    setOptions() {
      this.chart.setOption({
        title: {
          text: this.title,
          x: 'center',
          y: 'top',
        },
        color: ['#3398DB','#f60','#0a0'],
        tooltip : {
          trigger: 'axis', // axis | item
          axisPointer : {          // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          // formatter(params) {  // item
          //   // console.log(params)
          //   return params.seriesName+'<br/>'+params.name+'：'+params.data[params.seriesIndex+1]+'人';
          // }
        },
        legend: {  // 图块标注
          orient: 'horizontal', // 'vertical'
          x: 'center',
          y: '30px',
        },
        // grid: {
        //     left: '3%',
        //     right: '4%',
        //     bottom: '1%',
        //     containLabel: true
        // },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true, //坐标值是否在刻度中间
          },
          // data: this.xData  // x轴数据
        }, 
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show:true,
              formatter: '{value} 人'
            },
            boundaryGap: ['0','20%']
          }
        ],
        dataset: {
          source: this.sourceData
        },
        series: [
          {
            barWidth: '4.5%',
            type: 'bar'
          },
          {
            barWidth: '4.5%',
            type: 'bar'
          },
          {
            barWidth: '4.5%',
            type: 'bar'
          },
        ]
      }, true)
      this.chart.off('click')
      this.chart.on('click', params=> {
        let index = params.dataIndex  // x轴数据下标
          // this.areaEnergyindex = a

        this.$emit('xClick',index)
      })
    },
    initChart() {
      this.chart = this.$echarts.init(this.$el)
      this.setOptions()      
      window.addEventListener('resize', () => {
        if (!this.chart) return
        this.chart.resize()
      })
    },
  }
};

</script>
