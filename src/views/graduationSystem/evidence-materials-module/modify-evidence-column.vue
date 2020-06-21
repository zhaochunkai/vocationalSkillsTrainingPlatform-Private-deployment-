<template>
  <el-dialog
    class="t-dialog"
    v-if="visible"
    title="佐证栏目"
    :visible="visible"
    :close-on-click-modal="true"
    @close="close"
    width="400px"
  >
    <div class="content">
      <el-form class="t-form-block" ref="form">
        <el-form-item label="名称" :rules=" {required: true}">
          <el-input v-model="materialForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="materialForm.remarks" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="sendMsg">确认修改</el-button>
        <el-button type="primary" size="small" @click="close">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { UpdateSupportingMaterials } from "@/server/basic-module";
export default {
  props: ["visible", "modifyIds", "modifyName", "modifyRemarks"],
  data() {
    return {
      // ---------------修改的内容----------------
      materialForm: []
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.materialForm.name = this.modifyName[0];
        this.materialForm.remarks = this.modifyRemarks[0];
      }
    }
  },
  activated() {},
  methods: {
    // -----------------修改佐证栏目------------------
    _UpdateSupportingMaterials() {
      let data = {
        Id: this.modifyIds[0],
        Name: this.materialForm.name,
        Remarks: this.materialForm.remarks
      };
      UpdateSupportingMaterials(data).then(res => {
        this.materialForm = [];
        this.$message("修改成功");
      });
    },
    sendMsg() {
      if (this.materialForm.name == undefined) {
        this.$message.error("修改内容不能为空");
        return;
      }
      this._UpdateSupportingMaterials();
      setTimeout(() => {
        this.$emit("update:visible", false);
      }, 100);
    },
    close() {
      this.$emit("update:visible", false);
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.el-dialog__body {
  .dialog-footer {
    width: 100%;
    text-align: center;
  }
}
</style>