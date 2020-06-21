<template>
  <div>
    <!-- 学校信息 -->
    <el-card :style="style">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="机构详情" name="first">
          <el-form
            class="t-form-block"
            ref="form"
            :model="institutionData"
            :rules="rules"
            label-width="80px"
            size="small"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="机构号" prop="institutionNumber">
                  <el-input v-model="institutionData.institutionNumber" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="机构名称" prop="institutionName">
                  <el-input v-model="institutionData.institutionName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="机构简称" prop="institutionAbbreviation">
                  <el-input v-model="institutionData.institutionAbbreviation"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="隶属校区" prop="campusName">
                  <el-input v-model="institutionData.campusName" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-button type="primary" size="small" @click="save">保 存</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="直属机构" name="second">
          <div slot="header" class="t-box-card-header">
            <span>学校信息</span>
          </div>
          <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
            <el-form-item label="机构名称">
              <el-input
                class="input-append"
                style="width:70%;"
                v-model="conditionForm.InstitutionName"
                placeholder="请输入机构名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="conditionForm.status">
                <el-option label="全部" value="ALL"></el-option>
                <el-option label="启用" value="Enable"></el-option>
                <el-option label="停用" value="Disable"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryList">查询</el-button>
            </el-form-item>
          </el-form>
          <!-- 操作按钮 -->
          <div class="t-operate-buttons">
            <!-- <el-button type="primary" size="mini">导入</el-button> -->
            <el-button type="primary" size="mini" @click="addEdit()">新增</el-button>
            <!-- <el-button type="primary" size="mini" @click="del()">删除</el-button>
					<el-button type="primary" size="mini">启用</el-button>
            <el-button type="primary" size="mini">停用</el-button>-->
          </div>
          <!-- 表格 -->
          <el-table
            class="t-table-list"
            ref="multipleTable"
            stripe
            size="small"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;margin-top:10px;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="institutionName" sortable label="机构名称">
              <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
            </el-table-column>
            <el-table-column prop="institutionNumber" label="机构号"></el-table-column>
            <el-table-column prop="parentName" label="隶属机构"></el-table-column>
            <el-table-column prop="campusName" label="隶属校区"></el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template slot-scope="scope">{{scope.row.status=='Enable'?'启用': '停用'}}</template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="addEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="isEneble(scope.row)"
                >{{scope.row.status=='Enable'?'停用': '启用'}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 全选 -->
          <div class="t-batch-operate">
            <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
          </div>
          <!-- 分页组件 -->
          <div class="t-operate-footer">
            <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 新增/修改页面 -->
    <add-edit
      :dataForm="addEditForm"
      moduleLevel="下级机构"
      :visible.sync="addEditVisible"
      @save="addEditSave"
    ></add-edit>
  </div>
</template>
<script>
import {
  getInstitutionList,
  createInstitution,
  updateInstitution,
  deleteInstitutionById,
  getInstitutionById,
  updateCampus,
  updateInstitutionStatus
} from "@/server/basic-module";
import pagination from "@/components/pagination";
import { pageSizes, pageSize } from "@/config.js";
import addEdit from "./office-list-add";
export default {
  name: "officeList",
  data() {
    return {
      pageSizes,
      SkipCount: 0,
      pageSize,
      style: "",
      currentPage: 0,
      total: 0,
      isSelectAll: false,
      addEditVisible: false,
      addEditForm: {},
      conditionForm: {},
      tableData: [],
      // tab切换
      activeName: "first",
      form: {},
      rules: {},
      ParentId: ""
    };
  },
  props: ["institutionData", "nodeId", "nodeLevel"],
  components: { addEdit, pagination },
  activated() {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`;
  },
  watch: {
    nodeId(newVal) {
      if (newVal) {
        this.parentId = newVal;
        if (this.nodeLevel == "机构") {
          this.initDataList();
        }
      }
    }
  },
  methods: {
    queryList() {
      this.initDataList(this.SkipCount, this.pageSize);
    },
    /* 接收改变后每页多少条*/
    handleSize(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this.initDataList(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrent(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this.initDataList(SkipCount, pageSize);
    },
    // 分页查询机构
    initDataList(SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        InstitutionName: this.conditionForm.InstitutionName,
        Status: this.conditionForm.status,
        ParentId: this.parentId
      };
      getInstitutionList(data).then(result => {
        this.tableData = result.items;
        this.total = result.totalCount;
      });
    },
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
      this.multipleSelection = val;
      // 判断是否是全选
      this.isSelectAll =
        this.tableData.length === this.multipleSelection.length;
    },
    // gotoEdit(row) {
    // console.log(row)
    // this.$router.push({name: "profession-edit", params: {id:row.id,row: row}})
    // },
    addEdit(row) {
      this.addEditForm = row || {};
      this.addEditVisible = true;
      this.addEditForm.campusId = this.institutionData.campusId;
      this.addEditForm.campusName = this.institutionData.campusName;
      this.addEditForm.parentId = this.institutionData.id;
      this.addEditForm.parentName = this.institutionData.institutionName;
    },
    addEditSave(data) {
      if (data.id) {
        updateInstitution(data)
          .then(result => {
            this.$message.success("保存成功");
            this.queryList();
            this.$emit("updateSchoolTree");
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: "error"
            });
          });
      } else {
        createInstitution(data)
          .then(result => {
            this.$message.success("保存成功");
            this.queryList();
            this.$emit("updateSchoolTree");
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: "error"
            });
          });
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        updateInstitution(this.institutionData)
          .then(result => {
            this.$message.success("保存成功");
            this.queryList();
            this.$emit("updateSchoolTree");
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: "error"
            });
          });
      });
    },
    del(row) {
      this.$confirm(
        `此操作将 删除机构 【${row.institutionName}】， 是否继续？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          row.status = row.status == "Enable" ? false : true;
          deleteInstitutionById(row)
            .then(() => {
              this.$message.success('删除成功！')
              this.queryList();
              this.$emit("updateSchoolTree");
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: err.message,
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    // 启用停用
    isEneble(row) {
      this.$confirm(
        `此操作将 ${row.status == "Enable" ? "停用" : "启用"} 【${
          row.institutionName
        }】数据， 是否继续？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          if (row.status == "Enable") {
            row.status = false;
          } else {
            row.status = true;
          }
          updateInstitutionStatus(row).then(() => {
            this.$message.success("状态修改成功！");
            this.queryList();
          });
        })
        .catch(() => {});
    },

    // tab切换
    handleClick(tab, event) {
      // console.log(tab.index);
      this.initDataList();
    }
  }
};
</script>
<style lang="less" scoped>
</style>