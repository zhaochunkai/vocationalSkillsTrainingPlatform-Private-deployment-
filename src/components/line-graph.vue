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
    legend: {
      type: Array,
      default: () => []
    },
    sourceData: {
      type: Array,
      default: () => []
    },
    colors: {
      type: Array,
      default: () => ['#5793f3', '#d14a61', '#E6B600']
    },
    yName: ''
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    if (this.xData && this.xData.length) {
      // this.initChart();
      setInterval(() => {
        this.initChart()
      }, 1)
    }
  },
  watch: {
    xData: {
      deep: true,
      handler (val) {
        this.initChart(val);
      }
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
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
        color: this.colors,
        tooltip : {
          trigger: 'axis',
          axisPointer : {          // 坐标轴指示器，坐标轴触发有效
            type : 'cross'        // 默认为直线，可选为：'line' | 'shadow' | 'cross'
          }
        },
        grid: {
          left: '3%',
          right: '1%',
          bottom: '1%',
          containLabel: true
        },
        legend: {
          data: this.legend
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: this.xData  // x轴数据
        },
        yAxis: [
          {
            type: 'value',
            name: '访问次数/观众数量',
            min: 0,
            max: 50,
            // interval: 50,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: this.colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} 人（次）'
            }
          },
          {
            type: 'value',
            name: '观众数量',
            min: 0,
            max: 50,
            // interval: 50,
            position: 'left',
            offset: 100,
            axisLine: {
              lineStyle: {
                color: this.colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} 人（次）'
            }
          },
          {
            type: 'value',
            name: '观看分钟数',
            min: 0,
            max: 50,
            // interval: 50,
            position: 'right',
            axisLine: {
              lineStyle: {
                color: this.colors[2]
              }
            },
            axisLabel: {
              formatter: '{value} 分钟'
            }
          }
        ],
        // series: [
        //   {
        //     name: '访问次数',
        //     type: 'line',
        //     data: [56, 4.9, 7.0, 232, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        //   },
        //   {
        //     name: '观众数量',
        //     type: 'line',
        //     yAxisIndex: 1,
        //     data: [2.6, 59, 90, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        //   },
        //   {
        //     name: '观看分钟数',
        //     type: 'line',
        //     yAxisIndex: 2,
        //     data: [2.0, 2.2, 3.3, 4.5, 63, 10.2, 20.3, 234, 23.0, 16.5, 12.0, 6.2]
        //   }
        // ],
        series: this.sourceData
      }, true);
    },
    initChart() {      
      this.chart = this.$echarts.init(this.$el);
      this.setOptions();
      window.addEventListener('resize', () => {
        if (!this.chart) return
        this.chart.resize()
      })
    }
  }
};
</script>
