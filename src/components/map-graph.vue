<template>
  <div :style="{height:height}" style="width: '100%'"></div>
</template>

<script>
export default {
  name: "chartsBar",
  props: {
    color:Array,
    height: {
      type: String,
      default: () => {
        return "400px"
      }
    },
    geoCoordMap: {
      type: Object,
      default: () => {
        return {}
      }
    },
    data: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    if (this.data && this.data.length) {
       this.initChart();
    }
  },
  watch: {
    data: {
      deep: true,
      handler (val) {
        this.initChart(val)
      }
    },
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
      const planePath = 'path://M.6,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705';
      let convertData = (data) => {
          let res = [];
          for (let i = 0; i < data.length; i++) {        
              let dataItem = data[i];
              let fromCoord = this.geoCoordMap[dataItem[0].name];
              let toCoord = this.geoCoordMap[dataItem[1].name];
              let count = dataItem[1].count;
              let name=dataItem[1].name;
              if (fromCoord && toCoord) {
                res.push([{ coord: fromCoord }, { coord: toCoord }]);
              }
          }
          return res;
        };
        let color = ['#3ed4ff', '#ffa022', '#a6c84c'];
        let series = [];
        this.data.forEach((item, i) => {
          series.push({
              name: item[0],
              type: 'lines',
              zlevel: 1,
              effect: {
                  show: true,
                  period: 6,
                  trailLength: 0.7,
                  color: '#fff',
                  symbolSize: 3
              },
              lineStyle: {
                  normal: {
                      color: color[i],
                      width: 0,
                      curveness: 0.2
                  }
              },
              data: convertData(item[1])
          }, {
              name: item[0],
              type: 'lines',
              zlevel: 2,
              effect: {
                  show: true,
                  period: 6,
                  trailLength: 0,
                  symbol: planePath,
                  symbolSize: 15
              },
              lineStyle: {
                  normal: {
                      color: color[i],
                      width: 1,
                      opacity: 0.4,
                      curveness: 0.2
                  }
              },
              data: convertData(item[1])
          }, {
              name: item[0],
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 2,
              rippleEffect: {
                  brushType: 'stroke'
              },
              label: {
                  normal: {
                      show: true,
                      position: 'right',
                      formatter: '{b}'
                  }
              },
              symbolSize: (val) => {
                  return val[2] / 8;
              },
              itemStyle: {
                  normal: {
                      color: color[i]
                  }
              },
              data: item[1].map((dataItem) => {
                  return {
                      name: dataItem[1].name,
                      value: this.geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                  };
              })
          })
        })

        let option = {
            backgroundColor: '#080a20',
            title: {
                text: '全国地图分布总览',
                x: 'center',
                top: "20",
                textStyle: {
                    color: '#fff',
                    fontSize: 18
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {                
                    return params.data.name+'<br/>人数：'+params.data.value[2]
                }

                
            },
            visualMap: { //图例值控制
                min: 0,
                max: 1000,
                calculable: true,
                show: true,
                color: ['#f44336', '#fc9700', '#ffde00', '#ffde00', '#00eaff'],
                textStyle: {
                    color: '#fff'
                }
            },
            geo: {
                map: 'china',
                zoom: 1,
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#132937',
                        borderColor: '#0692a4'
                    },
                    emphasis: {
                        areaColor: '#0b1c2d'
                    }
                }
            },
            series: series
        };

    
      this.chart.setOption(option, true);
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