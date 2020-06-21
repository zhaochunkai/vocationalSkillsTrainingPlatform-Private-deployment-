<template>
  <div>
    <el-card>
      <div class="t-box-card-header">
        <span>短信签名</span>
        <el-tag type="warning" effect="dark" style="margin-left:50px;">数据更改后自动保存</el-tag>
      </div>
      <el-row>
        <el-col :span="14">
          <el-form
            class="t-form-block"
            ref="form"
            :model="form"
            :rules="rules"
            label-width="150px"
            size="small"
          >
            <el-form-item label="通知类短信签名" prop="name1">
              <el-input v-model="form.value1" @change="save1"></el-input>
              <el-tag>（审核失败,原因：请使用3-8字（中英文）的公司、网站、产品名、活动名称或身份证上的姓名。）</el-tag>
            </el-form-item>
            <el-form-item label="营销类短信签名" prop="name2">
              <el-input v-model="form.value2" @change="save2"></el-input>
              <el-tag>（审核中,审核时间3个工作日,审核通过后将自动生效）</el-tag>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="10">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>预览</span>
            </div>
            <div class="wechat">
              <p>【XXX学校】尊敬的学员，您的报名缴费已成功。支付方式：微信支付；查看详情 http://xxxxxx.com</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div slot="header" class="t-box-card-header">
        <span>常见问题</span>
      </div>
      <el-row class="questionList">
        <el-col v-for="(item,i) of questionList" :key="i">
          <div class="ask">{{++i}}. {{item.ask}}</div>
          <div class="answer" v-html="item.answer"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import {
  updateEtsGlobalSetting,
  getEtsGlobalSettingAll
} from "@/server/resource-module";
export default {
  data() {
    return {
      form: {
        name1: "",
        value1: "",
        name2: "",
        value2: ""
      },
      rules: {
        name1: [{ required: true, message: "请选择", trigger: "blur" }],
        name2: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      questionList: [
        {
          ask: "签名设置规则",
          answer:
            "自定义签名字数限制为3-8个字，必须含中文，可以包含数字、英文；<br >建议使用你的『学校名』或『品牌名』，使用其他签名可能短信审核不会通过！<br >若签名内容侵犯到第三方权益必须获得第三方真实授权；"
        },
        {
          ask: "签名会出现在哪些短信中？",
          answer:
            '设置签名后，"消息推送"中列出的短信都会带上你的自定义签名，即：<br >通知提醒：考试结果、成绩查询；'
        },
        {
          ask: "短信计价规则",
          answer:
            "单条70个字符，若超出70个字符需要分成多条时，将按照67个字符每条计算；<br >一个汉字、数字、字母、空格都算一个字符；<br >含有标签（如短信签名、商品名、链接）的短信以实际发送时字符数计算。"
        }
      ]
    };
  },
  activated() {
    this._getEtsGlobalSettingAll();
  },
  methods: {
    _getEtsGlobalSettingAll() {
      getEtsGlobalSettingAll().then(result => {
        for (let item of result) {
          if (item.name == "Ets.Global.DirectoryAuthorizationScope") {
            this.form.name1 = item.name;
            this.form.value1 = item.value;
          } else if (
            item.name == "Ets.Global.AutomaticallyEnableAfterApprovalSuccess"
          ) {
            this.form.name2 = item.name;
            this.form.value2 = item.value;
          } else if (item.name == "Ets.Global.AllowedFileTypes") {
            this.form.name3 = item.name;
            this.form.value3 = item.value;
          } else if (item.name == "Ets.Global.ModificationAndDeletionScope") {
            this.form.name4 = item.name;
            this.form.value4 = item.value;
          }
        }
      });
    },
    save1() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        updateEtsGlobalSetting({
          name: this.form.name1,
          value: this.form.value1
        })
          .then(result => {
            this._getEtsGlobalSettingAll();
            this.$message.success("修改成功！");
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
    save2() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        updateEtsGlobalSetting({
          name: this.form.name2,
          value: this.form.value2
        })
          .then(result => {
            this._getEtsGlobalSettingAll();
            this.$message.success("修改成功！");
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: "error"
            });
          });
      });
    }
  }
};
</script>
<style lang="less" scoped>
.box-card {
  font-size: 0.9rem;
  max-width: 100%;
  background: #eee;
  border: 1px solid #ddd;
  // margin-bottom:30px;
  .clearfix {
    padding: 5px;
  }
  /deep/.el-card__body {
    background: #fff;
  }
  .wechat {
    font-size: 14px;
    padding: 5px 10px;
  }
}
.titleTag {
  line-height: 60px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  span {
    // display:block;
    // padding:9px 20px;
    border: 1px solid #ddd;
  }
}
.questionList {
  max-width: 50%;
  font-size: 14px;
  line-height: 26px;
  .ask {
    background: #ffe8c4;
    padding: 10px;
    font-weight: 600;
  }
  .answer {
    margin: 10px 15px;
  }
}
</style>
