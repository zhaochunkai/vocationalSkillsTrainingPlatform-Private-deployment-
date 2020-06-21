<template>
<!-- 柱状图 -->
  <div :style="{height:height}"></div>
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
    xData: {
      type: Array,
      default: () => []
    },
    yData: {
      type: Array,
      default: () => []
    },
    yName: '',
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    if (this.xData && this.xData.length) {
       this.initChart()
    }
  },
  watch: {
    xData: {
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
        color: ['#3398DB'],
        tooltip : {
          trigger: 'axis',
          axisPointer : {          // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '1%',
            containLabel: true
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: this.xData  // x轴数据
        },
        yAxis: {
          type: 'value'
        },
        series: [{  
          name: this.yName,
          data: this.yData,  // y轴数据
          color: 'rgb(83,163,255)',
          type: 'bar',
          barWidth: '30%',
        }]
      }, true)
    },
    initChart() {
      this.chart = this.$echarts.init(this.$el)
      this.setOptions()      
      window.addEventListener('resize', () => {
        if (!this.chart) return
        this.chart.resize()
      })
    }
  }
};
</script>
