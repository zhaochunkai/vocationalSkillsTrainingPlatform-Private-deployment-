<template>
  <el-dialog
    v-if="visible"
    title="证书发放"
    :visible="visible"
    :close-on-click-modal="true"
    @close="close"
    width="1180px"
  >
    <div class="certificate_1" v-if="flag">
      <div class="content">
        <el-col :span="14">
          <p
            style="width:100%;height:50px;line-height:50px;border:1px solid #D6D608;font-size:18px;text-align:center;background-color:#FBFB8C"
          >
            已选择学生：
            <span style="font-size:24px">{{studentIds.length}}</span> 人
          </p>
          <el-table
            class="f-table-list"
            ref="multipleTable"
            stripe
            size="small"
            :data="SelectedList"
            tooltip-effect="dark"
            style="width: 100%;margin-top:10px;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column
              prop="studentName"
              sortable
              label="姓名"
              show-overflow-tooltip
              width="100"
            ></el-table-column>
            <el-table-column prop="idCard" label="身份证号" width="160"></el-table-column>
            <el-table-column prop="semesterName" label="学期" width="80"></el-table-column>
            <el-table-column prop="className" label="班级" width="100"></el-table-column>
            <el-table-column prop="projectName" label="所属培训项目" width="100"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="10">
          <p
            style="width:100%;height:50px;line-height:50px;border:1px solid #D6D608;font-size:18px;text-align:center;background-color:#FBFB8C"
          >备注：可进行批量连号发放证书</p>
          <el-form class="t-form-block" ref="form" block>
            <el-form-item label="证书类型">
              <el-select
                v-model="certificateForm.certificateType"
                filterable
                placeholder="请选择"
                style="width: 30%;"
              >
                <el-option
                  v-for="(item,i) of certificateTypeList"
                  :key="i"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                v-model="certificateForm.certificates"
                filterable
                placeholder="请选择"
                style="width: 70%;"
              >
                <el-option
                  v-for="(item,i) of certificatesList"
                  :key="i"
                  :label="item.certificateName"
                  :value="item.id"
                ></el-option>
              </el-select>
              <span style="color:red;margin: 0 10px">*</span>
            </el-form-item>
            <el-form-item label="证书编号前缀">
              <el-input v-model="certificateForm.prefix"></el-input>
              <span style="color:red;margin: 0 10px">*</span>
            </el-form-item>
            <el-form-item label="流水编号起始号" width>
              <el-input v-model="certificateForm.startNum" disabled></el-input>
              <span style="color:red;margin: 0 10px">*</span>
            </el-form-item>
            <el-form-item label="流水编号位数" width>
              <el-input v-model="certificateForm.digits" disabled></el-input>
              <span style="color:red;margin: 0 10px">*</span>
            </el-form-item>
            <el-form-item label="发证日期" width>
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="certificateForm.date"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              ></el-date-picker>
              <span style="color:red;margin: 0 10px">*</span>
            </el-form-item>
            <el-form-item label="备注" width>
              <el-input v-model="certificateForm.remarks"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </div>
      <div class="btn">
        <el-button type="primary" size="small" @click="NextSteb">下一步</el-button>
        <el-button type="primary" size="small" @click="close">返回</el-button>
      </div>
    </div>
    <div class="certificate_2" v-else>
      <div class="content">
        <el-table
          v-loading="loading"
          class="t-table-list"
          stripe
          size="small"
          :data="tableData_2"
          tooltip-effect="dark"
        >
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="studentName" sortable label="姓名" show-overflow-tooltip width="100"></el-table-column>
          <el-table-column prop="idCard" label="身份证号" width="160"></el-table-column>
          <el-table-column prop="semesterName" label="学期" width="100"></el-table-column>
          <el-table-column prop="className" label="班级" width="100"></el-table-column>
          <el-table-column prop="projectName" label="所属培训项目" width="120"></el-table-column>
          <el-table-column prop="certificateType" label="证书类型" width="100">
            <template slot-scope="scope">{{scope.row.certificateType=="Graduation"?'毕业证书': '技能证书'}}</template>
          </el-table-column>
          <el-table-column prop="certificateName" label="证书名称" width="100"></el-table-column>
          <el-table-column prop="certificateCode" label="证书编号" width="120">
            <template slot-scope="scope">{{scope.row.certificateCode}}</template>
          </el-table-column>
          <el-table-column prop="trainingProgram" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="certificatePrint(scope.row.certificateType,scope.row.certificateName,scope.row.certificatesGrantId)"
              >打印证书</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="btn">
          <el-button type="primary" size="small" @click="close">关闭</el-button>
        </div>
      </div>
    </div>
    <el-dialog width="1040px" title="技能证书打印" :visible.sync="skillVisible" append-to-body>
      <!-- 技能证书页 -->
      <skill-certificate :data="skillForm"></skill-certificate>
    </el-dialog>
    <el-dialog width="1040px" title="学士学位证书打印" :visible.sync="degreeVisible" append-to-body>
      <!-- 学士学位证书 -->
      <degree-certificate :data="degreeForm"></degree-certificate>
    </el-dialog>
    <el-dialog width="1040px" title=" 结业证书打印" :visible.sync="completionVisible" append-to-body>
      <!-- 结业证书 -->
      <completion-certificate :data="completionForm"></completion-certificate>
    </el-dialog>
    <el-dialog width="1040px" title="毕业证书打印" :visible.sync="diplomaVisible" append-to-body>
      <!-- 毕业证书 -->
      <diploma-certificate :data="diplomaForm"></diploma-certificate>
    </el-dialog>
  </el-dialog>
</template>
<script>
import skillCertificate from "./certificate-printing/skill-certificate.vue";
import completionCertificate from "./certificate-printing/completion-certificate.vue";
import degreeCertificate from "./certificate-printing/degree-certificate.vue";
import diplomaCertificate from "./certificate-printing/diploma-certificate.vue";
import {
  CreateCertificatesGrant,
  GetCertificateList,
  GetCertificateInfo,
  GetCertificateCoreLatest
} from "@/server/basic-module";
export default {
  props: ["visible", "SelectedList", "bascinforData"],
  components: {
    skillCertificate,
    completionCertificate,
    degreeCertificate,
    diplomaCertificate
  },
  data() {
    return {
      //加载
      loading: true,
      // --------------上下一步切换------------
      flag: true,
      // --------------表单------------
      certificateForm: {
        certificateType: "", //证书类型：0毕业证书，1技能证书
        certificates: "", //具体的证书
        prefix: 20200701, //证件编号前缀
        startNum: 2005698, //流水编起始号
        digits: 7, //流水编号位数
        date: "", //发证日期
        remarks: "" //备注
      },
      studentIds: [],
      certificateTypeList: [
        {
          name: "毕业证书",
          id: 0
        },
        {
          name: "技能证书",
          id: 1
        }
      ], //证书类型列表
      certificatesList: [], //证书列表
      certificateItemList: [], //培训项目列表
      // -------------------表格-----------------------
      tableData_2: [],
      // -----------------------------证书打印--------------
      degreeVisible: false,
      completionVisible: false,
      diplomaVisible: false,
      skillVisible: false,
      degreeForm: [], //学士学位证书传递数据
      completionForm: [], //结业证书传递数据
      diplomaForm: [], //毕业证书传递数据
      skillForm: [] //技能证书传递数据
    };
  },
  watch: {
    "certificateForm.certificateType"() {
      this.certificateForm.certificates = "";
      this.certificatesList = [];
      this._GetCertificateList(this.certificateForm.certificateType);
    }
  },
  activated() {},
  methods: {
    // -------------------培训项目下拉-------------------
    _GetCertificateList(type) {
      GetCertificateList(type).then(res => {
        this.certificatesList = res;
      });
    },
    // ---------------创建证书发放记录信息----------------
    _CreateCertificatesGrant() {
      let data = {
        studentIds: this.studentIds,
        classId: this.bascinforData.ClassId,
        TrainingProgramId: this.bascinforData.TrainingProgramId,
        certificateId: this.certificateForm.certificates,
        certificatesType: this.certificateForm.certificateType,
        codePrefix: this.certificateForm.prefix,
        codeStart: this.certificateForm.startNum,
        codeDigit: this.certificateForm.digits,
        grantStatus: "", //证书是否发放
        grantTime: this.certificateForm.date,
        remarks: this.certificateForm.remarks
      };
      CreateCertificatesGrant(data)
        .then(res => {
          this.flag = false;
          this._GetCertificateCoreLatest();
        })
        .catch(err => {
          this.flag = false;
          this.$message.error(err);
        });
    },
    // ---------------获取证书发放记录信息----------------
    _GetCertificateCoreLatest() {
      let data = {
        type: this.certificateForm.certificateType,
        studentIds: this.studentIds.join(","),
        classId: this.bascinforData.ClassId,
        certificateId: this.certificateForm.certificates
      };
      GetCertificateCoreLatest(data).then(res => {
        setTimeout(() => {
          this.loading = false;
        }, 300);
        this.tableData_2 = res;
        this.studentIds.length = 0;
      });
    },
    _GetCertificateInfo(type, name, id) {
      let data = {
        id: id,
        classId: this.bascinforData.ClassId,
        tpId: this.bascinforData.TrainingProgramId
      };
      GetCertificateInfo(data).then(res => {
        if (type == "Graduation") {
          if (name == "毕业证书") {
            this.diplomaForm = res;
            this.diplomaVisible = true;
          } else if (name == "结业证书") {
            this.completionForm = res;
            this.completionVisible = true;
          } else {
            // this.degreeForm = res;
            // this.degreeVisible = true;
          }
        } else {
          this.skillForm = res;
          this.skillVisible = true;
        }
      });
    },
    // -----------打印证书--------------
    certificatePrint(type, name, id) {
      this._GetCertificateInfo(type, name, id);
    },
    close() {
      this.flag = true;
      this.$emit("update:visible", false);
    },
    // --------------操作------------
    NextSteb() {
      if (!this.certificateForm.certificates) {
        this.$message.error("请选择证书类型");
        return;
      }
      if (!this.certificateForm.prefix) {
        this.$message.error("请输入证书编号前缀");
        return;
      }
      if (!this.certificateForm.date) {
        this.$message.error("请输入发证日期");
        return;
      }
      if (this.studentIds.length == 0) {
        this.$message.error("请选择要发放的对象");
        return;
      }
      this._CreateCertificatesGrant();
    },
    // ----------------------------全选-----------------------
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
      val.forEach(item => {
        arr.push(item.studentId);
      });
      this.studentIds = [...new Set(arr)]; //批量获取学生的id
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.el-dialog__body {
  .certificate_1 {
    .content {
      display: flex;
      justify-content: space-between;
    }
    .btn {
      width: 100%;
      text-align: center;
      .el-button {
        margin: 10px;
      }
    }
  }
  .certificate_2 {
    .btn {
      width: 100%;
      text-align: center;
      .el-button {
        margin: 10px;
      }
    }
  }
}
.f-table-list {
  height: 400px;
  overflow: scroll;
}
.t-table-list {
  height: 400px;
  overflow: scroll;
}
/deep/.el-form {
  .el-form-item {
    .el-form-item__content {
      display: flex;
    }
  }
}
</style>