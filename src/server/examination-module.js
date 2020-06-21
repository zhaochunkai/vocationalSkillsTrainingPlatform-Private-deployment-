import http from './http'
/* ----------------------------- 题库目录--专业绑定课程 -------------------------- */
// 获得已绑定的课程列表
export const getMajorBindCourseList = (id) => http('/Api/Major/CourseList?id=' + id, {})
// 为专业绑定课程
export const MajorBindCourses = (id, ids) => http('/Api/Major/BindCourses?id=' + id, ids, 'PUT')
// 为专业解绑课程
export const MajorUnBindCourses = (id, ids) => http('/Api/Major/UnBindCourses?id=' + id, ids, 'PUT')

/* ----------------------------- 试题管理 -------------------------- */
// 获取试题信息详情
export const getQuestionById = (id) => http('/Api/Question/' + id, {})
// 更新试题信息
export const updateQuestionById = (data) => http('/Api/Question/' + data.id, data, 'PUT')
// 删除试题信息
export const deleteQuestionById = (data) => http('/Api/Question/' + data.id, {}, 'DELETE')
// 获取试题信息列表
export const getQuestionList = (data) => http('/Api/Question', data)
// 创建新的试题
export const createQuestion = (data) => http('/Api/Question', data, 'POST')
// 试题审核
export const examineQuestionById = (id, passed) => http('/Api/Question/AuditQuestion?id=' + id + '&passed=' + passed, {}, 'PUT')
// 试题导入
export const importQuestion = (fileKey, courseId) => http(`/Api/Question/ImportQuestion?fileKey=${fileKey}&courseId=${courseId}`, {}, 'POST')

/* ----------------------------- 试卷管理 —— 组卷策略-------------------------- */
// 根据[课程Id和项目状态码]查询所有绑定该课程的项目 courseId state
export const getProjectByCourseIdAndState = (data) => http('/Api/ExaminationPaper/ProjectByCourseId', data)
// 根据课程[Id、项目状态码]查询所有绑定该课程的策略 courseId state
export const getStrategyByCourseId = (data) => http('/Api/ExaminationPaper/StrategyByCourseId', data)

// 策略详情
export const getAssembleStrategyById = (id) => http('/Api/AssembleStrategy/' + id, {})
// 创建组卷策略
export const createAssembleStrategy = (data) => http('/Api/AssembleStrategy', data, 'POST')
// 删除组卷策略
export const deleteAssembleStrategy = (id) => http('/Api/AssembleStrategy?id=' + id, {}, 'DELETE')
// 组卷策略列表
export const getAssembleStrategyList = (data) => http('/Api/AssembleStrategy', data)
// 更新组卷策略 - 基本信息
export const UpdateQuestionAssembleStrategy = (data) => http('/Api/AssembleStrategy/Update?id=' + data.id, data, 'PUT')
// 更新试题类型
export const UpdateQuestionType = (data) => http('/Api/AssembleStrategy/UpdateQuestionType?id=' + data.id, data, 'PUT')

/* ----------------------------- 试卷管理 —— 在线组卷-------------------------- */
// 组卷-获取试卷详情
export const getExaminationPaperById = (id) => http('/Api/ExaminationPaper?id=' + id, {})
// 组卷-更新试卷
export const updateExaminationPaper = (data) => http('/Api/ExaminationPaper?id=' + data.id, data, 'PUT')
// 组卷-获取试卷列表
export const getExaminationPaperList = (data) => http('/Api/ExaminationPaper/GetExaminationPaper', data)
// 组卷-手动组卷
export const createExaminationPaperManual = (data) => http('/Api/ExaminationPaper/Manual', data, 'POST')
// 组卷-自动组卷
export const createExaminationPaperAuto = (data) => http('/Api/ExaminationPaper/Auto', data, 'POST')
// 组卷-删除试卷
export const deleteExaminationPaperyById = (id) => http('/Api/ExaminationPaper/' + id, {}, 'DELETE')

/* ----------------------------- 考试管控 —— 考试安排-------------------------- */
// 考试安排详情
export const getExaminationArrangeById = (id) => http('/Api/ExaminationArrange/' + id, {})
// 获取考试安排列表
export const getExaminationArrange = (data) => http('/Api/ExaminationArrange', data)
// 保存考试安排基本信息
export const createExaminationArrange = (data) => http('/Api/ExaminationArrange', data, 'POST')
// 更新基本信息
export const updateExaminationArrange = (data) => http('/Api/ExaminationArrange?id=' + data.id, data, 'PUT')
// 删除考试安排
export const deleteExaminationArrangeById = (id) => http('/Api/ExaminationArrange?id=' + id, {}, 'DELETE')
// 保存考试安排
export const SaveAssignSubject = (examinationArrangeId, data) => http('/Api/ExaminationArrange/SaveAssignSubject?examinationArrangeId=' + examinationArrangeId, data, 'PUT')
// 更新考试安排
export const UpdateArrange = (assignSubjectId, data) => http('/Api/ExaminationArrange/UpdateArrange?assignSubjectId=' + assignSubjectId, data, 'PUT')
// 设置考试安排状态
export const updateExamArrangeStatus = (id, flagEnable) => http('/Api/ExaminationArrange/ExamArrangeStatus?id=' + id + '&flagEnable=' + flagEnable, {}, 'PUT')
// 获取有考试未合格人员的考试安排下拉框
export const getNeedMakeupExaminationArrangeSpinner = (data) => http('/Api/ExaminationArrange/ExaminationArrangeSpinner', data)
// 获取有考试未合格人员的考试安排的课程列表
export const getMakeupExaminationArrangeCourseSpinner = (examinationArrangeId) => http(`/Api/ExaminationArrange/ExamArrangeByCourse?examinationArrangeId=${examinationArrangeId}`, {})
// 生成考务信息
export const generateExaminationArrangeInformation = (data) => http('/Api/ExaminationInformation/Create', data, 'POST')
// 获取考务信息
export const getExaminationArrangeInformation = (data) => http('/Api/ExaminationInformation/examinationInformation', data)
// 查询指定课程下课表中是否已经排课，并且有授课老师
export const getFlagLecturerBycourse = (data) => http('/Api/ExaminationArrange/GetFlagLecturer', data)
// 已经生成了考务信息的正式考试安排列表
export const getExaminationArrangeListsHasArrangeInfo = (data) => http('/Api/ExaminationArrange/ExamArrangeInformation', data)
// 考务信息补录生成 - 后分班的学生，补充生成考务信息
export const generateMakeUpExamArrangeInformation = (data) => http('/Api/ExaminationInformation/AddExaminationInformation', data, 'POST')

/* ----------------------------- 考试管控 —— 补考安排-------------------------- */
// 获取补考安排详情
export const getSupplementaryArrangeById = (id) => http('/Api/SupplementaryArrange/' + id, {})
// 删除补考安排
export const deleteSupplementaryArrangeById = (id) => http('/Api/SupplementaryArrange/' + id, {}, 'DELETE')
// 补考安排列表
export const getSupplementaryArrange = (data) => http('/Api/SupplementaryArrange', data)
// 创建补考安排
export const createSupplementaryArrange = (data) => http('/Api/SupplementaryArrange', data, 'POST')
// 更新补考安排
export const updateSupplementaryArrange = (data) => http('/Api/SupplementaryArrange?id=' + data.id, data, 'PUT')
// 设置补考安排状态
export const updateSupplementaryArrangeStatus = (id, flagEnable) => http('/Api/SupplementaryArrange/ExamArrangeStatus?id=' + id + '&flagEnable=' + flagEnable, {}, 'PUT')
// 生成考务信息
export const generateExamSupplementaryInformation = (data) => http('/Api/ExaminationInformation/ExamSupplementaryInformation', data, 'POST')

/* ----------------------------- 成绩管理 -------------------------- */
// 根据考试安排获取考试科目 examinationArrangeId
export const getCourseWithExaminationArrangeById = (data) => http('/Api/ScoreManage/CourseWithExaminationArrangeId', data)
// 根据班级|科目|考试安排Id查询所有学生 参数: classId courseId examinationArrangeId
export const getStudentPerformanceWithRecord = (data) => http('/Api/ScoreManage/GetStudentWithRecord', data)
// 录入成绩
export const entryStudentScore = (data) => http('/Api/ExamResultInput/Create', data, 'POST')
// 修改录入成绩
export const updateStudentScore = (data) => http('/Api/ExamResultInput/Modify', data, 'PUT')
// 提交成绩
export const submitStudentScore = (examResultsId) => http('/Api/ExamResultInput/Submit?examResultsId=' + examResultsId, {}, 'PUT')
// 根据考试安排Id查询出所有的班级
export const getClassWithExamArrangeId = (id) => http('/Api/ScoreManage/GetClassWithExamArrangeId?ExaminationArrangeId=' + id, {})
// 根据考试安排和班级查询出所有的课程
export const getCourseWithExamArrangeId = (data) => http('/Api/ScoreManage/GetCourseWithExamArrangeId', data)
//考试成绩查询
export const CourseScoreByTp = (data) => http('/Api/ExamPaperRecord/CourseScoreByTp', data)

/* ----------------------------- 毕业管理-毕业判定 -------------------------- */
// 创建毕业判定条件
export const createGraduationJudgement = (data) => http('/Api/GraduationJudgement', data, 'POST')
// 获得毕业判定条件分页列表
export const getGraduationJudgement = (data) => http('/Api/GraduationJudgement', data)
// 更新毕业判定条件
export const updateGraduationJudgement = (data) => http('/Api/GraduationJudgement?id=' + data.id, data, 'PUT')
// 获取毕业判定条件详情
export const getGraduationJudgementById = (id) => http('/Api/GraduationJudgement/' + id, {})
// 删除毕业判定条件
export const deleteGraduationJudgementById = (id) => http('/Api/GraduationJudgement?id=' + id, {}, 'DELETE')

/* ----------------------------- 毕业管理-毕业记录 -------------------------- */
// 获取毕业记录详情
export const getGraduationRecordById = (id) => http('/Api/GraduationRecord/' + id, {})
// 获取班级毕业记录分页列表
export const getGraduationRecord = (data) => http(`/Api/GraduationJudgement/GetGraduationAuditPageList`, data)
// 审批毕业记录
// export const updateGraduationRecordApprove = (data) => http('/Api/GraduationRecord/Approve', data, 'PUT')
// 修改毕业记录达标状态
export const updateGraduationRecordPassState = (id, data) => http('/Api/GraduationRecord/PassState?id=' + id, data, 'PUT')
// 毕业自动判定
export const createGraduationRecordAutoJudge = (data) => http(`/Api/GraduationJudgement/GetGraduationAuditJudgePageList`, data)
// 获取毕业管理左边那棵树
export const getGraduationTree = () => http('/Api/CertificateGrant/GetClassTree', {})
// 毕业审核查看个人详情
export const CheckThePersonalDetail = (data) => http('/Api/GraduationJudgement/ViewStudentGraduation', data)
// 毕业管理导出
export const exportExecl = (data) => http(`/Api/GraduationJudgement/ExportExecl`, data)
// 获取审批个人信息
export const getUserInfo = (data) => http('/Api/GraduationJudgement/GetStudentGraduationInfo', data)
// 审核单个学生
export const updateGraduationRecordApprove = (data) => http(`/Api/GraduationJudgement/AuditStudentGraduation`, data, 'POST')
// 查看个人学生考试信息
export const getIndividualTestInfo = (data) => http(`/Api/GraduationJudgement/GetAchievementsInfo`, data)

/* ----------------------------- 阅卷 -------------------------- */

// 获取老师所教授班级
export const GetTeacherWithClass = (examinationArrangeId) => http('/Api/ExamPaperRecord/GetTeacherWithClass?examinationArrangeId=' + examinationArrangeId, {})
// 获取班级下学生
export const GetStudentInfoByClassId = (data) => http('/Api/ExamPaperRecord/GetStudentInfoByClassId', data)
// 获取试卷
export const GetExamPaperRecord = (data) => http('/Api/ExamPaperRecord/GetExamPaperRecord', data)
