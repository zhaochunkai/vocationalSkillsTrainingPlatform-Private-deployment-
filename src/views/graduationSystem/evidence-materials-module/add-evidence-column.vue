<template>
  <el-dialog
    class="t-dialog"
    v-if="visible"
    title="新增栏目"
    :visible="visible"
    :close-on-click-modal="true"
    @close="close"
    width="400px"
  >
    <div class="content">
      <el-form class="t-form-block" ref="form">
        <el-form-item label="佐证材料名称">
          <el-input v-model="materialForm.name"></el-input>
        </el-form-item>
        <el-form-item label="佐证材料类型">
          <el-select v-model="materialForm.type" filterable placeholder="请选择">
            <el-option
              v-for="(item,i) of materialTypeList"
              :key="i"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="佐证材料备注">
          <el-input v-model="materialForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="sendMsg">保存</el-button>
        <el-button type="primary" size="small" @click="close">返回</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { CreateSupportingMaterials } from "@/server/basic-module";
export default {
  props: ["visible"],
  data() {
    return {
      // ---------------添加的内容----------------
      materialForm: [],
      materialTypeList: [
        // { name: "内置", id: 0 },
        { name: "自定义", id: 1 }
      ]
    };
  },
  watch: {},
  activated() {},
  methods: {
    // -----------------创建佐证栏目------------------
    _CreateSupportingMaterials() {
      let data = {
        Name: this.materialForm.name,
        Remarks: this.materialForm.remarks
      };
      CreateSupportingMaterials(data).then(res => {
        this.materialForm = [];
        this.$message("创建成功");
        this.$emit("update:visible", false);
      });
    },
    sendMsg() {
      if (this.materialForm.name == undefined) {
        this.$message.error("新增栏目名不能为空");
        return;
      }
      this._CreateSupportingMaterials();
    },
    close () {
      this.$emit("update:visible", false);
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.el-dialog__body {
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .t-form-block {
      .el-form-item {
        display: flex;
        align-items: center;
        width: 100%;
      }
    }
    .btn {
      margin-top: 20px;
      .el-button {
        margin: 10px;
      }
    }
  }
}
</style>