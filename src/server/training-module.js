import http from './http'
/* ------------------------------ 报名录取-学习项目管理------------------------------------- */

// 创建学习项目
export const createTrainingPrograms = (data) => http(`/Api/TrainingPrograms`, data, 'POST')
// 分页获取学习项目数据，可以根据培训名称查询
export const getTrainingProgramsList = (data) => http('/Api/TrainingPrograms', data)
// 删除学习项目
export const deleteTrainingPrograms = (data) => http(`/Api/TrainingPrograms/${data.id}`, data, 'DELETE')
// 根据学习项目Id获取信息
export const getTrainingProgramsById = (id) => http(`/Api/TrainingPrograms/${id}`, {})
// 更新学习项目
export const updateTrainingPrograms = (data) => http(`/Api/TrainingPrograms/${data.id}`, data, 'PUT')
// 修改学习项目的状态
export const updateTrainingProgramsStatus = (data) => http(`/Api/TrainingPrograms/Status?id=${data.id}&Status=${data.state}`, data, 'PUT')
// 添加课程到学习项目
export const updateTrainingProgramsCourse = (id, data) => http(`/Api/TrainingPrograms/AddCourseToTrainingPrograms?id=${id}`, data, 'PUT')
// 获取学习项目绑定的课程
export const getTrainingProgramsBindCourse = (id) => http('/Api/TrainingPrograms/BindCourse/' + id, {})
// 设置学习项目课程培养方案
export const setTrainingProgramsCourseScheme = (trainingProgramsId, data) => http(`/Api/TrainingPrograms/SetCourseScheme?trainingProgramsId=${trainingProgramsId}`, data, 'PUT')
// 获取课程培养方案信息
export const getTrainingProgramsCourseSchemeInfo = (data) => http('/Api/TrainingPrograms/CourseSchemeInfo', data)
// 获取培训项目绑定的学生：【学习项目】-【项目管理】模块
export const getTrainingProgramsBindStudent = (data) => http('/Api/TrainingPrograms/BindStudent', data)
// 设置人脸间隔时间，单位秒
export const settingFaceAttendanceCycle = (data) => http(`/Api/TrainingPrograms/FaceAttendanceCycle?id=${data.id}&liveFaceAttendanceCycle=${data.liveFaceAttendanceCycle}&onlineFaceAttendanceCycle=${data.onlineFaceAttendanceCycle}`, {}, 'PUT')
// 获取培训项目下拉列表
export const getTrainingProgramsPullDown = (data) => http('/Api/TrainingPrograms/TrainingProgramsPullDown', data)

// 获取监管单位列表
export const getGovernmentAccountList = (data) => http('/Api/GovernmentAccount', data)
// 项目绑定政府单位接口
export const bindGovernmentWithProgram = (data) => http('/Api/GovernmentAccount/bound-government-with-program', data, 'POST')
// 添加证书类型到培训项目
export const addRequiredCertificateToTrainingPrograms = (id, data) => http(`/Api/TrainingPrograms/AddRequiredCertificateToTrainingPrograms?id=${id}`, data, 'PUT')
// 获取培训项目绑定的毕业要求证书类型
export const getProgramRequiredCertificateTypes = (trainingProgramsId) => http(`/Api/RequiredCertificateType/ByTrainingProgramsId?trainingProgramsId=${trainingProgramsId}`, {})
// 生成培训项目报名二维码
export const GenerateProgramQrCode = (id) => http(`/Api/TrainingPrograms/GenerateQrCode?id=${id}`, {})

/* ------------------------------ 报名录取-报名管理------------------------------------- */
// 获取学生信息列表：学生档案模块可按照身份证、手机号、姓名、状态、来源查询
export const getStudentArchives = (data) => http('/Api/StudentInfo/Archives', data)
// 获取学生信息列表：按照学生报名的项目id查询
export const getStudentInfoListByProgramId = (id, data) => http('/Api/StudentInfo/ByTrainingProgramId?trainingProgramId=' + id, data)
// 根据id获取学生信息
export const getStudentBasicInfoById = (data) => http('/Api/StudentInfo/BasicInfo?id=' + data.id + '&trainingProgramsId=' + data.trainingProgramsId, {})
// 修改学生信息
export const updateStudentInfo = (data) => http(`/Api/StudentInfo/${data.id}`, data, 'PUT')
// 根据微信绑定Id查询学生信息
export const getStudentInfoByWechatId = (id) => http('/Api/StudentInfo/ByWeChatId?weChatId=' + id, {})
// 审核学生信息,单个
export const CheckStudentInfo = (data) => http('/Api/StudentInfo/CheckStudent', data, 'PUT')
// 审核学生信息,批量
export const CheckStudentInfoBatch = (data) => http('/Api/StudentInfo/CheckStudentBatch', data, 'PUT')
// 解绑微信
export const unBindWechat = (studentId) => http(`/Api/StudentInfo/UntieWeChat?studentId=${studentId}`, {}, 'PUT')

// 新增学生，线下报名
export const createStudentEntry = (data) => http('/Api/StudentInfo', data, 'POST')
// 微信绑定
export const createStudentEntryWeChatBinding = (data) => http('/Api/StudentEntry/WeChatBinding', data, 'PUT')
// 获得某个学习项目下未分班的学生列表
export const getUnPlacementStudentList = (data) => http('/Api/StudentInfo/UnPlacementStudentList', data)
// 删除学生报名信息
export const deleteStudentInfo = (data) => http('/Api/StudentInfo', data, 'DELETE')
// 检查学生基本信息是否存在
export const CheckStudentInfoPresence = (tel) => http(`/Api/StudentInfo/CheckStudentInfoPresence?tel=${tel}`, {})
// 二次报名
export const createStudentEntryAgainEnroll = (studentId, trainingProgramsId) => http(`/Api/StudentInfo/AgainEnroll?studentId=${studentId}&trainingProgramsId=${trainingProgramsId}`, {}, 'POST')
// 导入学生数据
export const ImportStudentInfo = (fileKey, projectId) => http(`/Api/StudentInfo/ImportStudentInfo?fileKey=${fileKey}&projectId=${projectId}`, {}, 'POST')
// 上传学生该项目毕业所需的证书
export const UploadStudentProgramCertificate = (data) => http('/Api/StudentInfo/UploadStudentCertificate', data, 'POST')

/* ------------------------------ 缴费管理-------------------------------------- */
// 分页获取，缴费管理列表
export const getPayManageList = (data) => http('/Api/Pay/PayManageList?TrainingProgramsId=' + data.TrainingProgramsId, data)
// 获取缴费统计信息
export const getPayInfo = (data) => http('/Api/Pay/PayInfo?TrainingProgramsId=' + data.TrainingProgramsId + '&StudentId=' + data.StudentId, data)
// 分页获取，缴费详细信息
export const getPayItemList = (data) => http('/Api/Pay/PayItemList', data)
// 分页获取，缴费查询列表
export const getPayQueryList = (data) => http('/Api/Pay/PayQueryList', data)
// 线下缴费审批，管理员操作
export const updatePaymentApproval = (data) => http(`/Api/Pay/PaymentApproval?id=${data.id}&registrationProjectId=${data.registrationProjectId}&money=${data.money}`, data, 'PUT')
// 未交费，带原因
export const updateNotPaymentReason = (data) => http(`/Api/Pay/DidNotPayReason?id=${data.studentId}&registrationProjectId=${data.registrationProjectId}&reason=${data.reason}`, data, 'PUT')

/* ------------------------------ 班级管理-------------------------------------- */
// 获取班级基本信息
export const getClassInfoById = (id) => http('/Api/Class/' + id, {})
// 根据项目id获取班级列表 tpId,studentId
export const getClassList = (data) => http('/Api/Class/TrainingProgram', data)
// 根据教师Id获取班级列表
export const getClassListByTeacher = (data) => http('/Api/Class/TeacherClassUnderTp', data)
// 创建新的班级
export const createClass = (data) => http(`/Api/Class`, data, 'POST')
// 更新班级信息
export const updateClass = (data) => http(`/Api/Class?id=${data.id}`, data, 'PUT')
// 删除班级信息
export const deleteClass = (id) => http(`/Api/Class?id=${id}`, {}, 'DELETE')
// 根据班级 Id 获取该班级下的所有学生
export const getClassStudentList = (data) => http(`/Api/Class/${data.id}/ClassStudents`, data)
// 新增班级学生
export const SetAddClassStudent = (id, ids) => http(`/Api/Class/${id}/AddStudents`, ids, 'PUT')
// 移除班级中的学生
export const SetRemoveClassStudent = (id, ids) => http(`/Api/Class/${id}/RemoveStudents`, ids, 'PUT')
// 清空班级中的学生
export const SetClearClassStudent = (id) => http(`/Api/Class/${id}/ClearStudents`, {}, 'PUT')

/* ------------------------------ 毕业分析 -------------------------------------- */
export const getAnalysisOfGraduation = (data) => http(`/Api/GraduationJudgement/GetGraduationAnalysis`, data)
