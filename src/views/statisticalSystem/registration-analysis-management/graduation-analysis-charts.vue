
<template>
  <!-- 毕业分析 -->
  <div>
    <el-row :gutter="10">
      <el-col :span="5">
        <el-card :style="style">
          <!-- 证书树 -->
          <org-tree
            :dataList="resourceTree"
            @selectNode="haddleOrganizationNode"
            ref="tree"
            show-checkbox="true"
          ></org-tree>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card :style="style" v-show="flage">
          <div ref="container" style="width: 1000px;height: 700px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  GetGraduationAnalysisTree,
  getDictionaryItems
} from "@/server/basic-module";
import { GetGraduationAnalysis } from "@/server/statistical-module";
import orgTree from "@/components/orgTree";
export default {
  components: { orgTree },
  data() {
    return {
      flage: false,
      style: "",
      ClassId: null,
      // ----------------------------树------------------------
      resourceTree: [],
      //----------------------------图形------------------------
      graphicData: [],
      /* ------------------[-----------数据字典- 字典码-------------- */
      dicJudgeName: {
        Education: "Education" // 学历
      },
      dictionary: {}
    };
  },
  watch: {},
  mounted() {},
  activated() {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`;
    this._GetGraduationAnalysisTree();
    /* ------------------[-----------数据字典- 获取数据字典下拉数据-------------- */

    for (let item in this.dicJudgeName) {
      getDictionaryItems(this.dicJudgeName[item]).then(result => {
        this.$set(this.dictionary, item, result);
      });
    }
  },
  methods: {
    _GetGraduationAnalysis(type, id, certificateId) {
      let data = { type, id, certificateId };
      GetGraduationAnalysis(data).then(res => {
        this.graphicData = [];
        res.forEach(item => {
          this.graphicData.push({ value: item.number, name: item.title });
        });
        this.getTableGraphics();
        this.flage = true;
      });
    },
    //--------------------------树------------------------
    _GetGraduationAnalysisTree() {
      GetGraduationAnalysisTree().then(res => {
        this.resourceTree = res;
      });
    },
    /* 选择的树节点 */
    haddleOrganizationNode(node) {
      let certificateId = "";
      let type = "";
      if (node.level == 0) {
        //证书
        certificateId = node.id;
        type = "certificateId";
      } else if (node.level == 1) {
        //项目
        certificateId = node.certificateId;
        type = "tpId";
      } else if (node.level == 2) {
        //班级
        certificateId = node.certificateId;
        type = "classId";
      }
      this._GetGraduationAnalysis(type, node.id, certificateId);
    },
    //---------------------echarts图形------------------------
    getTableGraphics() {
      let dom = this.$refs.container;
      let myChart = this.$echarts.init(dom);
      let app = {};
      let option = null;
      option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: 10
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "80%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: this.graphicData
          }
        ]
      };
      if (option && typeof option === "object") {
        myChart.setOption(option, true);
      }
    }
    //----------------------------------------------------
  }
};
</script>
<style lang="less" scoped>
.t-header-title span {
  font-size: 14px;
  width: 300px;
  text-align: left;
  padding-left: 10px;
}
</style>