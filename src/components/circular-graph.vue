<template>
<!-- 环状图 -->
  <div :style="{height:height}"></div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: () => {
        return '400px'
      }
    },
    yName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    labelFormatter: {
      type: String,
      default: '{b|{b}：}{c}  {per|{d}%}'
    },
    tooltipFormatter: {
      type: String,
      default: '{a} <br/>{b}: {c} ({d}%)'
    },
    orient: {
      type: String,
      default: 'vertical'
    },
    legendData: {
      type: Array,
      default: () => []
    },
    colorData: {
      type: Array,
      default: () => []
    },
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    if (this.legendData && this.legendData.length) {
      this.initChart()
    }
  },
  watch: {
    legendData: {
      deep: true,
      handler (val) {
        this.initChart(val)
      }
    }
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    setOptions () {
      this.chart.setOption({
        title: {
          text: this.title,
          x: 'center',
          y: 'top'
        },
        color: this.colorData, // 饼状图颜色
        tooltip: {
          trigger: 'item',
          formatter: this.tooltipFormatter
        },
        legend: { // 图块标注
          orient: this.orient, // vertical | horizontal
          x: '80px',
          y: '24px',
          data: this.legendData
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['42%', '50%'],
            avoidLabelOverlap: true,
            label: {
              show: false,
              position: 'center'
              // normal: {
              //   // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              //   formatter: this.labelFormatter,
              //   backgroundColor: '#fff',
              //   borderColor: '#aaa',
              //   borderWidth: 1,
              //   borderRadius: 4,
              //   rich: {
              //     a: {
              //       color: '#333',
              //       lineHeight: 22,
              //       align: 'center'
              //     },
              //     abg: {
              //       backgroundColor: '#fefeae',
              //       width: '100%',
              //       align: 'right',
              //       height: 22,
              //       borderRadius: [4, 4, 0, 0]
              //     },
              //     hr: {
              //       borderColor: '#aaa',
              //       width: '100%',
              //       borderWidth: 0.5,
              //       height: 0
              //     },
              //     b: {
              //       fontSize: 13,
              //       lineHeight: 26,
              //       padding: [4, 4],
              //     },
              //     per: {
              //       color: '#eee',
              //       backgroundColor: '#aaa',
              //       padding: [2, 4],
              //       borderRadius: 2
              //     }
              //   }
              // }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            data: this.dataList
          }
        ]
      }, true)
    },
    initChart () {
      this.chart = this.$echarts.init(this.$el)
      this.setOptions()
      window.addEventListener('resize', () => {
        if (!this.chart) return
        this.chart.resize()
      })
    }
  }
}
</script>
