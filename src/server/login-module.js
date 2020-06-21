import http from './http'
/* ----------------------------验证码登录------------------------------ */
// 获取验证码
export const getVerificationPicture = () => http('/Api/Account/VerificationPicture', {})
// 登录
export const loginSystem = (data) => http('/Api/Account/AccountLogin', data, 'POST')

/* ----------------------------短信登录------------------------------ */
// 发送短信验证码
export const getVerificationCode = (phoneNumber) => http(`/Api/Account/SendVerificationCode?phoneNumber=${phoneNumber}`, {})
// 短信验证码登录
export const loginSystemByTel = (data) => http('/Api/Account/SmsLogin', data, 'POST')
/* ----------------------------获取租户列表------------------------------ */
export const getTenancyDropdown = (data) => http('/Api/customize-tenancy/tenants-combobox', data)
