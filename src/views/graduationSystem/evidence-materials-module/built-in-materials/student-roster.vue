<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-show="visible">
    <el-tab-pane label="学员花名册" name="first">
      <el-tooltip class="item" effect="dark" content="建议横向打印,若遇显示不全的现象请自定义缩放" placement="right">
        <el-button
          v-show="isShow"
          type="primary"
          v-print="'#printCompletion'"
          @click="printCompletion()"
        >打印</el-button>
      </el-tooltip>
      <el-table
        id="printCompletion"
        :data="tableData"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
        v-loading="loading"
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="studentName" label="名字" sortable align="center"></el-table-column>
        <el-table-column prop="age" label="年龄" align="center"></el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.sex==1">男</p>
            <p v-if="scope.row.sex==2">女</p>
            <p v-if="scope.row.sex==0">未知的性别</p>
            <p v-if="scope.row.sex==9">未说明的性别</p>
          </template>
        </el-table-column>
        <el-table-column label="学历" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.education=='0'">高中中专及以下</p>
            <p v-if="scope.row.education=='1'">大专</p>
            <p v-if="scope.row.education=='2'">本科</p>
            <p v-if="scope.row.education=='3'">双学士</p>
            <p v-if="scope.row.education=='4'">硕士</p>
            <p v-if="scope.row.education=='5'">博士</p>
          </template>
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" align="center"></el-table-column>
        <el-table-column prop="tel" label="联系电话" align="center"></el-table-column>
        <el-table-column prop="sourceStr" label="来源" align="center"></el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { GetClassInfoList } from "@/server/basic-module";
export default {
  props: ["visible", "data", "nodeId"],
  data() {
    return {
      loading: false,
      isShow: true,
      activeName: "first",
      tableData: []
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this.loading = true;
        this._GetClassInfoList();
      }
    }
  },
  methods: {
    //----------------------打印---------------------------
    printCompletion() {
      this.isShow = false;
      setTimeout(() => {
        this.isShow = true;
      }, 1000);
    },
    //------------------------查询列表信息--------------------
    _GetClassInfoList() {
      let data = {
        ClassId: this.nodeId
      };
      GetClassInfoList(data).then(res => {
        this.tableData = res;
        this.loading = false;
      });
    },

    handleClick(tab, event) {
      //   console.log(tab, event);
    }
  }
};
</script>

<style lang="less" scoped>
</style>