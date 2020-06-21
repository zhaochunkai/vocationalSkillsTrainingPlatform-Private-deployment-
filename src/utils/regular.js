const regular = {
  decimal_2: /^(0|[1-9]\d*)(\.[0-9]{2})$/,   //两位小数
  number: /^(0|[1-9]\d*)$/,         // 非负整数
  email: /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,  // 邮箱
  phone: /^1[0-9]{10}$/     // 手机号
}

export default regular
