<template>
  <div>
    <!-- 佐证栏目 -->
    <el-card :style="style" v-loading="loading">
      <div class="beforeShow">
        <!-- 查询 -->
        <el-form class="t-operate-filter" :inline="true" size="small">
          <el-form-item label="佐证材料名称" prop>
            <el-input v-model="material.name"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="material.type" filterable placeholder="请选择">
              <el-option v-for="(item,i) of typeData" :key="i" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="SearchFor">搜索</el-button>
          </el-form-item>
        </el-form>
        <!-- 操作 -->
        <el-form class="t-operate-filter" :inline="true" size="small">
          <el-form-item>
            <el-button type="primary" @click="addCert">增加</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="modifyCert">修改</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="DeleteCert">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="EnableCert">启用</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="DisableCert">禁用</el-button>
          </el-form-item>
        </el-form>
        <!-- 证书列表 -->
        <el-table
          v-loading="reflesh"
          class="t-table-list"
          ref="multipleTable"
          stripe
          size="small"
          :data="materialList"
          tooltip-effect="dark"
          style="width: 100%;margin-top:10px;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="name" sortable label="佐证材料名称" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="type" label="类型" show-overflow-tooltip align="center" width="80">
            <template slot-scope="scope">{{scope.row.type==0?"内置":"自定义"}}</template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" width="50" align="center">
            <template slot-scope="scope">{{scope.row.status=="Enable"?"启用":"禁用"}}</template>
          </el-table-column>
          <el-table-column fixed="right" label="排序" width="100" align="center">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.sort"
                filterable
                placeholder="请选择"
                @change="SortNumber(scope.row)"
              >
                <el-option
                  v-for="(item,i) of SerialNumber"
                  :key="i"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div class="t-operate-footer">
          <pagination
            ref="pagination"
            :total="total"
            @sizeChange="handleSize"
            @currentChange="handleCurrent"
          ></pagination>
        </div>
      </div>
      <!-- 增加 -->
      <add-evidence :visible.sync="infoVisible" @func="addList(arguments)"></add-evidence>
      <!-- 修改 -->
      <modify-evidence
        :modifyIds="modifyIds"
        :modifyName="modifyName"
        :modifyRemarks="modifyRemarks"
        :visible.sync="modifyVisible"
      ></modify-evidence>
    </el-card>
  </div>
</template>
<script>
import { pageSizes, pageSize } from "@/config.js";
import addEvidence from "./add-evidence-column";
import modifyEvidence from "./modify-evidence-column";
import pagination from "@/components/pagination";
import {
  GetSupportingMaterialsPageList,
  DeleteSupportingMaterials,
  UpdateStatus,
  UpdateSort
} from "@/server/basic-module";
export default {
  components: { addEvidence, modifyEvidence, pagination },
  data() {
    return {
      reflesh: false,
      SerialNumber: [
        {
          name: 1
        },
        {
          name: 2
        },
        {
          name: 3
        },
        {
          name: 4
        },
        {
          name: 5
        },
        {
          name: 6
        },
        {
          name: 7
        },
        {
          name: 8
        },
        {
          name: 9
        }
      ],
      // -------------------类型下拉列表-------------
      typeData: [
        {
          name: "全部",
          id: 2
        },
        {
          name: "内置",
          id: 0
        },
        {
          name: "自定义",
          id: 1
        }
      ],
      //类型数据绑定
      material: {
        type: 1
      },
      // ------------------佐证栏目列表---------------
      materialList: [
        {
          materiaName: "测试"
        }
      ],

      loading: false,
      approvalList: [
        {
          materiaName: "张三"
        }
      ],
      // ----------------------添加与修改-----------------
      infoVisible: false,
      modifyVisible: false,
      modifyIds: [], //修改页传入id
      modifyName: [],
      modifyRemarks: [],
      // ------------------------分页----------------
      total: 0,
      pageSizes,
      pageSize,
      style: "",
      //---------------启用-----------------
      numEnable: 0,
      //---------------禁用-----------------
      numDisable: 0
    };
  },
  watch: {
    infoVisible(val) {
      if (!val) {
        this._GetSupportingMaterialsPageList(0, this.pageSize);
      }
    },
    modifyVisible(val) {
      if (!val) {
        this._GetSupportingMaterialsPageList(0, this.pageSize);
      }
    }
  },
  mounted() {},
  activated() {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`;
    this._GetSupportingMaterialsPageList(0, this.pageSize);
  },
  methods: {
    SortNumber(row) {
      this._UpdateSort(row.id, row.sort);
    },
    _UpdateSort(id, sort) {
      let data = {
        id: id,
        sort: sort
      };
      UpdateSort(data).then(res => {
        this._GetSupportingMaterialsPageList(0, this.pageSize);
      });
    },
    // ---------------------------------------操作---------------------------------------
    //启用
    EnableCert() {
      if (this.modifyIds.length == 0) {
        this.$message("请选择要启用的佐证材料");
        return;
      }
      if (this.numEnable == 0 || this.numDisable == 0) {
        this._UpdateStatus(0);
      } else {
        this.$confirm("所选材料状态不一致，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this._UpdateStatus(0);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消启用"
            });
          });
      }
    },
    //禁用
    DisableCert() {
      if (this.modifyIds.length == 0) {
        this.$message("请选择要禁用的佐证材料");
        return;
      }
      if (this.numEnable == 0 || this.numDisable == 0) {
        this._UpdateStatus(1);
      } else {
        this.$confirm("所选材料状态不一致，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this._UpdateStatus(1);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消禁用"
            });
          });
      }
    },
    _UpdateStatus(status) {
      let data = {
        id: this.modifyIds.join(","),
        status: status
      };
      UpdateStatus(data).then(res => {
        this._GetSupportingMaterialsPageList(0, this.pageSize);
        if (status == 0) {
          this.$message({
            type: "success",
            message: "已启用"
          });
        } else if (status == 1) {
          this.$message({
            type: "success",
            message: "已禁用"
          });
        }
      });
    },
    //增加
    addCert() {
      this.infoVisible = true;
    },
    //修改
    modifyCert() {
      if (this.modifyIds.length == 0) {
        this.$message("请选择要修改的佐证材料");
        return;
      } else if (this.modifyIds.length > 1) {
        this.$message("最多选择一条");
        return;
      } else {
        this.modifyVisible = true;
      }
    },
    // 渲染列表,数据来源于子组件传值
    addList(data) {
      this.approvalList = data[0];
      this.total = data[1];
    },
    //删除
    _DeleteSupportingMaterials(ids) {
      DeleteSupportingMaterials(ids).then(res => {
        this._GetSupportingMaterialsPageList(0, this.pageSize);
      });
    },
    DeleteCert() {
      if (this.modifyIds.length == 0) {
        this.$message("请选择要删除的佐证材料");
        return;
      }
      this.$confirm("是否继续删除该文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this._DeleteSupportingMaterials(this.modifyIds.join(","));
          this.$message({
            type: "success",
            message: "删除成功"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /* --------------------------------------------查询--------------------------------------- */
    // 获取佐证栏目列表
    _GetSupportingMaterialsPageList(SkipCount, pageSize, Type, Name) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        Type: Type,
        Name: Name
      };
      GetSupportingMaterialsPageList(data).then(res => {
        this.materialList = res.items;
        this.total = res.totalCount;
        this.reflesh = false;
        this.loading = false;
      });
    },
    /* 接收改变后每页多少条*/
    handleSize(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this._GetSupportingMaterialsPageList(
        SkipCount,
        pageSize,
        this.material.type,
        this.material.name
      ); // 获取审批列表
    },
    /*接收当前页数*/
    handleCurrent(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this._GetSupportingMaterialsPageList(
        SkipCount,
        pageSize,
        this.material.type,
        this.material.name
      );
    },
    // 搜索
    SearchFor() {
      this.reflesh = true;
      this._GetSupportingMaterialsPageList(
        this.SkipCount,
        this.pageSize,
        this.material.type,
        this.material.name
      );
    },
    /* ------------------------------------ 操作按钮 -------------------------- */
    // 全选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    selectAll() {
      this.$refs.multipleTable.toggleAllSelection();
    },
    handleSelectionChange(val) {
      let arr = [];
      let arr1 = [];
      let arr2 = [];
      this.numEnable = 0;
      this.numDisable = 0;
      val.forEach(item => {
        arr.push(item.id);
        arr1.push(item.name);
        arr2.push(item.remarks);
        //-------------判断状态是否一致------------------
        if (item.status == "Enable") {
          this.numEnable++;
        } else if (item.status == "Disable") {
          this.numDisable++;
        }
        //----------------------------------------------
      });
      this.modifyIds = [...new Set(arr)];
      this.modifyName = [...new Set(arr1)];
      this.modifyRemarks = [...new Set(arr2)];
    }
  }
};
</script>
<style lang="less" scoped>
</style>