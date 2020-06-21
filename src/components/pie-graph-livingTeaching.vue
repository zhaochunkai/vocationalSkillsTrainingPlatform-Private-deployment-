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
        return "400px"
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
      default: () => ['#a169f1','#ffae88','#00f','#32b2ef','#ff7da1','#f60','#0fa','#0a9']
    },
    dataList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    if (this.legendData && this.legendData.length) {
       setInterval(() => {
        this.initChart();
      }, 1);
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
        color: this.colorData, // 饼状图颜色
        tooltip : {
          trigger: 'item',
          formatter: this.tooltipFormatter,
        },
        legend: {  // 图块标注
          orient: this.orient,  // vertical | horizontal
          x: '80px',
          y: '24px',
          data: this.legendData
        },
        series: [{  
          name: '',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          roseType: 'radius',
          label: {
            normal: {
              // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              formatter: this.labelFormatter,
              backgroundColor: '#fff',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#333',
                  lineHeight: 22,
                  align: 'center'
                },
                abg: {
                  backgroundColor: '#fefeae',
                  width: '100%',
                  align: 'right',
                  height: 22,
                  borderRadius: [4, 4, 0, 0]
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 14,
                  lineHeight: 26,
                  padding: [4, 4],
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#aaa',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            },
            color: 'rgba(255, 255, 255, 0.3)'
          },
          labelLine: {
            normal: {
              show: true,
            },
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          },
          data: this.dataList,
          itemStyle: {
              // color: '#c23531',
              // shadowBlur: 200,
              // shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }]
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
