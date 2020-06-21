import http from './http'
/* ------------------------------- 数据字典 ------------------------------- */
// 分页查询，可根据字典名称或code查询
export const getDictionary = (data) => http('/Api/Dictionary', data)
// 创建字典
export const createDictionary = (data) => http('/Api/Dictionary', data, 'POST')
// 修改字典
export const updateDictionary = (data) => http('/Api/Dictionary?id=' + data.id, data, 'PUT')
// 删除字典
export const deleteDictionary = (data) => http('/Api/Dictionary', data, 'DELETE')
// 字典详情查询,通过字典id查询字典项列表
export const getDictionaryById = (id) => http('/Api/Dictionary/' + id, {})
// 创建字典项
export const createDictionaryById = (data) => http('/Api/Dictionary/' + data.id, data, 'POST')
// 修改字典项
export const updateDictionaryById = (id, data) => http('/Api/Dictionary/' + id, data, 'PUT')
// 删除字典
export const deleteDictionaryById = (id, entryId) => http('/Api/Dictionary/' + id + '?entryId=' + entryId, {}, 'DELETE')
// 设置数据字典项目状态
export const updateDictionaryItemStatus = (id, entryId, status) => http('/Api/Dictionary/Status?id=' + id + '&entryId=' + entryId + '&status=' + status, {}, 'PUT')
// 根据字典代码查询字典项下拉
export const getDictionaryItems = (code) => http('/Api/Dictionary/PullDown?code=' + code, {})
// 根据字典代码和字典项代码查询 字典项详细信息
export const getDictionaryItemsInfo = (dictionaryCode, entryCode) => http('/Api/Dictionary/Entry?dictionaryCode=' + dictionaryCode + '&entryCode=' + entryCode, {})

/* ------------------------------- 基础数据---树结构 ------------------------------- */
// 获取学校信息树形数据
export const getSchoolTree = (data) => http('/Api/TreeData/School', data)
// 获取企业信息树形数据
export const getEnterpriseTree = (data) => http('/Api/TreeData/Enterprise', data)
// 获取资源库树形数据
export const getWarehouseTree = (data) => http('/Api/TreeData/Warehouse', data)
// 获取学习项目树形数据
export const getTrainingProgramsTree = (data) => http('/Api/TreeData/TrainingPrograms', data)
// 获取培训项目树形，报名审核
export const getTrainingProgramsByAuditTree = () => http('/Api/TreeData/TrainingProgramsByAudit', {})
// 获取培训班级树形数据---学生档案模块   {status: '1,4'}查询状态码为1和4的数据，不传参表示查询所有
export const getGradeTree = (data) => http('/Api/TreeData/Grade', data)
// 获取毕业树形数据---毕业分析模块
export const GetGraduationAnalysisTree = () => http('Api/GraduationJudgement/GetGraduationAnalysisTree', {})
// 获取楼栋树形数据
export const getBuildingTree = (data) => http('/Api/TreeData/Building', data)
// 获取专业课程树形数据
export const getMajorCourseTree = (data) => http('/Api/TreeData/MajorCourse', data)
// 获取专业树形数据
export const getMajorTree = (data) => http('/Api/TreeData/Major', data)

// ------------------------------- 懒加载--课程知识点树 -------------------------------
// 获取课程列表树形数据
export const getCourseTree = (data) => http('/Api/TreeData/Course', data)
// 获取章列表树形数据
export const getChapterTree = (data) => http('/Api/TreeData/Chapter', data)
// 获取节列表树形数据
export const getSectionTree = (data) => http('/Api/TreeData/Section', data)
// 获取知识点列表树形数据
export const getKnowledgeTree = (data) => http('/Api/TreeData/KnowledgePoint', data)

/* ------------------------------- 基础数据-企业 ------------------------------- */
// 根据id获取企业信息详情
export const getEnterpriseById = (id) => http('/Api/Enterprise/' + id, {})
// 获取企业信息列表
export const getEnterpriseList = (data) => http('/Api/Enterprise', data)
// 创建新的企业
export const createEnterprise = (data) => http('/Api/Enterprise', data, 'POST')
// 更新企业信息
export const updateEnterprise = (data) => http('/Api/Enterprise/?id=' + data.id, data, 'PUT')
// 设置企业启用状态
export const updateEnterpriseEnable = (data) => http('/Api/Enterprise/Enable/?id=' + data.id + '&enable=' + data.enable, data, 'PUT')

/* ------------------------------- 基础数据-学校 ------------------------------- */
// 获取学校信息
export const getSchoolById = (id) => http('/Api/School/' + id, {})
// 获取学校信息列表
export const getSchoolList = (data) => http('/Api/School', data)
// 创建新的学校
export const createSchool = (data) => http('/Api/School', data, 'POST')
// 更新学校信息
export const updateSchool = (data) => http('/Api/School/' + data.id, data, 'PUT')

/* ------------------------------- 基础数据-校区 ------------------------------- */
// 获取校区信息详情
export const getCampusById = (id) => http('/Api/Campus/' + id, {})
// 获取校区信息列表
export const getCampusList = (data) => http('/Api/Campus', data)
// 创建新的校区
export const createCampus = (data) => http('/Api/Campus', data, 'POST')
// 更新校区信息
export const updateCampus = (data) => http('/Api/Campus/?id=' + data.id, data, 'PUT')
// 删除校区信息
export const deleteCampusById = (data) => http('/Api/Campus?id=' + data.id, data, 'DELETE')
// 启用/停用 校区
export const updateCampusStatus = (data) => http('/Api/Campus/SetUsageStatus?id=' + data.id + '&enable=' + data.enable, data, 'PUT')

/* ------------------------------- 基础数据-机构 ------------------------------- */
// 根据上级机构id查机构列表
export const getInstitutionList = (data) => http('/Api/Institution', data)
// 根据校区id查机构列表
export const getInstitutionListByCampusId = (data) => http('/Api/Institution/ByCampusId', data)
// 创建机构
export const createInstitution = (data) => http('/Api/Institution', data, 'POST')
// 修改场地
export const updateInstitution = (data) => http('/Api/Institution/?id=' + data.id, data, 'PUT')
// 删除场地
export const deleteInstitutionById = (data) => http('/Api/Institution?id=' + data.id, data, 'DELETE')
// 机构详情查询
export const getInstitutionById = (id) => http('/Api/Institution/' + id, {})
// 设置机构状态
export const updateInstitutionStatus = (data) => http('/Api/Institution/Status?id=' + data.id + '&status=' + data.status, data, 'PUT')

/* ------------------------------- 基础数据-专业信息 ------------------------------- */
// 获取专业信息详情
export const getMajorById = (id) => http('/Api/Major/' + id, {})
// 更新专业信息
export const updateMajor = (data) => http('/Api/Major/' + data.id, data, 'PUT')
// 删除专业信息
export const deleteMajor = (data) => http('/Api/Major/' + data.id, data, 'DELETE')
// 获取专业信息列表
export const getMajorList = (data) => http('/Api/Major', data)
// 创建新的专业
export const createMajor = (data) => http('/Api/Major', data, 'POST')
// 启用/停用 专业
export const updateMajorStatus = (data) => http('/Api/Major/Enable?id=' + data.id + '&enable=' + data.enable, data, 'PUT')
// 获得已绑定的资源库列表
export const getMajorWarehouseList = (id) => http('/Api/Major/WarehouseList?id=' + id, {})
// 为专业绑定资源库
export const MajorBindWarehouse = (data) => http('/Api/Major/BindWarehouse?id=' + data.id + '&warehouseId=' + data.warehouseId, data, 'PUT')
// 为专业解绑资源库
export const MajorUnBindWarehouse = (data) => http('/Api/Major/UnBindWarehouse?id=' + data.id + '&warehouseId=' + data.warehouseId, data, 'PUT')

/* ------------------------------- 基础数据-课程信息 ------------------------------- */
// 获取课程信息详情
export const getCourseById = (id) => http('/Api/Course/' + id, {})
// 更新课程信息
export const updateCourse = (data) => http('/Api/Course/' + data.id, data, 'PUT')
// 删除课程信息
export const deleteCourse = (data) => http('/Api/Course/' + data.id, data, 'DELETE')
// 获取课程信息列表
export const getCourseList = (data) => http('/Api/Course', data)
// 获取可用的课程列表，分页，查询条件 name
export const getCourseComBox = (data) => http('/Api/Course/CourseComBox', data)
// 创建新的课程
export const createCourse = (data) => http('/Api/Course', data, 'POST')
// 将课程添加至专业
export const updateCourseToMajor = (data) => http('/Api/Course/AttachToMajor?id=' + data.id + '&majorId=' + data.majorId, data, 'PUT')
// 启用/停用 课程
export const updateCourseStatus = (data) => http('/Api/Course/Enable?id=' + data.id + '&enable=' + data.enable, data, 'PUT')

/* ------------------------------- 基础数据-教室场所 ------------------------------- */
// 创建场地
export const createSite = (data) => http('/Api/Room', data, 'POST')
// 分页获取场地列表，可以根据教室名称，可用状态进行查询
export const getSiteList = (data) => http('/Api/Room', data)
// 删除场地
export const deleteSite = (data) => http('/Api/Room/' + data.id, data, 'DELETE')
// 根据Id获取场地信息
export const getSiteById = (id) => http('/Api/Room/' + id, {})
// 更新场地信息
export const updateSite = (data) => http('/Api/Room/' + data.id, data, 'PUT')
// 修改场地状态
export const updateSiteStatus = (data) => http('/Api/Room/set-status?id=' + data.id + '&status=' + data.status, {}, 'PUT')
// 根据楼栋查询场地，不分页
export const getSiteListByBuilding = (buildingId) => http('/Api/Room/get-room-list-by-building-id?buildingId=' + buildingId, {})
// 获取场地下拉框数据
export const getSiteDropdown = () => http('/Api/Room/get-combobox', {})
/* ------------------------------- 基础数据-楼栋信息 ------------------------------- */
// 创建楼栋
export const createBuilding = (data) => http('/Api/Building', data, 'POST')
// 分页查询楼栋列表,可按照名称和状态查询
export const getBuildingList = (data) => http('/Api/Building', data)
// 删除楼栋
export const deleteBuilding = (data) => http('/Api/Building?id=' + data.id, data, 'DELETE')
// 根据Id获取楼栋信息
export const getBuildingById = (id) => http('/Api/Building/' + id, {})
// 更新楼栋信息
export const updateBuilding = (data) => http('/Api/Building?id=' + data.id, data, 'PUT')
// 修改楼栋状态
export const updateBuildingStatus = (data) => http('/Api/Building/Status?id=' + data.id + '&Status=' + data.status, data, 'PUT')

/* ------------------------------- 基础数据-学期 ------------------------------- */
// 分页查询学期,可按照名称和状态查询
export const getSemesterList = (data) => http('/Api/Semester', data)
// 创建学期
export const createSemester = (data) => http('/Api/Semester', data, 'POST')
// 修改学期
export const updateSemester = (data) => http('/Api/Semester?id=' + data.id, data, 'PUT')
// 删除学期
export const deleteSemester = (data) => http('/Api/Semester?id=' + data.id, data, 'DELETE')
// 修改学期状态
export const updateSemesterStatus = (data) => http('/Api/Semester/Status?id=' + data.id + '&Status=' + data.status, data, 'PUT')
// 设置学期默认状态
export const updateDefaultSemesterStatus = (data) => http('/Api/Semester/defaultSemester?id=' + data.id + '&defaultSemester=' + data.defaultSemester, data, 'PUT')
/* ------------------------------- 基础数据-学年 ------------------------------- */
// 分页查询学年,可按照名称和状态查询
export const getAcademicYearList = (data) => http('/Api/AcademicYear', data)
// 创建学年
export const createAcademicYear = (data) => http('/Api/AcademicYear', data, 'POST')
// 修改学年
export const updateAcademicYear = (data) => http('/Api/AcademicYear?id=' + data.id, data, 'PUT')
// 删除学年
export const deleteAcademicYear = (data) => http('/Api/AcademicYear?id=' + data.id, data, 'DELETE')
// 修改学年状态
export const updateAcademicYearStatus = (data) => http('/Api/AcademicYear/Status?id=' + data.id + '&Status=' + data.status, data, 'PUT')
/* ------------------------------- 基础数据-教学日程 ------------------------------- */
// 获取教学日程
export const getTeachCalendar = (id) => http('/Api/TeachCalendar?semesterId=' + id, {})
// 创建教学日程
export const createTeachCalendar = (data) => http('/Api/TeachCalendar', data, 'POST')
// 更新教学日程
export const updateTeachCalendar = (data) => http('/Api/TeachCalendar?id=' + data.id, data, 'PUT')

// 获取已经设置的默认学期数据
export const getDefaultSemester = (data) => http('/Api/Semester/getDefaultSemester', data)

/* ------------------------------- 基础数据-作息时间 ------------------------------- */
// 保存作息时间
export const createDailySchedule = (data) => http('/Api/DailySchedule', data, 'POST')
// 编辑作息时间
export const updateDailySchedule = (data) => http('/Api/DailySchedule', data, 'PUT')
// 获取作息时间
export const getDailySchedule = (data) => http('/Api/DailySchedule', data)
// 清空作息时间
export const ClearTimeTable = () => http('/Api/DailySchedule/ClearTimeTable', {}, 'PUT')

/* ------------------------------- 基础数据-下拉选项 ------------------------------- */
// 获取学年下拉框数据
export const getAcademicYearSpinnerData = (data) => http('/Api/AcademicYear/GetSpinnerData', {})
// 根据学年获取下属学期
export const getSemesterSpinnerData = (academicYearId) => http('/Api/Semester/GetSpinnerData?academicYearId=' + academicYearId, {})
// 楼栋下拉
export const getBuildingsPullDown = (name) => http('/Api/Building/BuildingsPullDown?name=' + name, {})

/* ------------------------------- 毕业证书-机构基本信息 ------------------------------- */
// 获取机构基本信息
export const GetInstitutionsBasicInfo = () => http('/Api/InstitutionsBasicInfo/GetInstitutionsBasicInfo', {})
// 上传机构logo
export const CreateUpInstitutionsBasicInfo = (data) => http('/Api/InstitutionsBasicInfo/CreateUpInstitutionsBasicInfo', data, 'POST')
// 获取证书列表
export const GetCertificatePageList = (data) => http('/Api/Certificate/GetCertificatePageList', data)
// 创建证书列表
export const CreateCertificate = (data) => http('/Api/Certificate/CreateCertificate', data, 'POST')
// 获取详情
export const GetCertificate = (id) => http('/Api/Certificate/GetCertificate?id=' + id, {})
// 选择证书背景
export const SetBackgroundImg = (data) => http('/Api/Certificate/SetBackgroundImg?id=' + data.id + '&backgroundImg=' + data.backgroundImg, {}, 'put')
// 证书列表删除（批量）
export const DeleteCertificate = (list) => http('/Api/Certificate/DeleteCertificate?id=' + list, {}, 'DELETE')
// 获取毕业要求审批列表
export const GraduationRequirementsList = (data) => http('/Api/StudentInfo/GraduationRequirementsList', data)
// 获取学生证书列表
export const StudentCertificate = (data) => http('/Api/StudentInfo/StudentCertificate', data)
// 审批证书
export const ApproveCertificate = (data) => http('/Api/StudentInfo/ApproveCertificate', data, 'PUT')
// 获取证书学生列表
export const GetGraduationStudentInfo = (data) => http(`/Api/CertificateGrant/GetGraduationStudentInfo`, data)
// 创建证书发放记录信息
export const CreateCertificatesGrant = (data) => http(`/Api/CertificateGrant/CreateCertificatesGrant`, data, 'POST')
// 获取证书名称
export const GetCertificateList = (type) => http('/Api/Certificate/GetCertificateList?type=' + type, {})
// 获取证书发放详情
export const GetCertificateCoreLatest = (data) => http(`/Api/CertificateGrant/GetCertificateCoreLatest`, data)
// 证书启用或禁用
export const UpCertificateStatus = (data) => http(`/Api/Certificate/UpCertificateStatus?id=${data.id}&status=${data.status}`, {}, 'PUT')
// 点击打印
export const GetCertificateInfo = (data) => http(`/Api/CertificateGrant/GetCertificateInfo?id=${data.id}&classId=${data.classId}&tpId=${data.tpId}`, {})
// 打印状态
export const UpdateCertificatesGrantStatus = (id) => http(`/Api/CertificateGrant/UpdateCertificatesGrantStatus?id=${id}`, {}, 'PUT')
// 删除
export const DeleteCertificatesGrant = (id) => http('/Api/CertificateGrant/DeleteCertificatesGrant?id=' + id, {}, 'DELETE')

// ------------------------------- 佐证材料 -------------------------------
// 获取佐证栏目列表
export const GetSupportingMaterialsPageList = (data) => http('/Api/StudentInfoImportingExport/GetSupportingMaterialsPageList', data)
// 创建佐证栏目
export const CreateSupportingMaterials = (data) => http('/Api/StudentInfoImportingExport/CreateSupportingMaterials', data, 'POST')
// 修改佐证栏目
export const UpdateCertificate = (data) => http('/Api/Certificate/UpdateCertificate', data, 'PUT')
// 删除佐证栏目
export const DeleteSupportingMaterials = (list) => http('/Api/StudentInfoImportingExport/DeleteSupportingMaterials?id=' + list, {}, 'DELETE')
// 获取佐证材料列表
export const GetSupportingMaterialsAuditInfo = (id) => http('/Api/StudentInfoImportingExport/GetSupportingMaterialsAuditInfo?classId=' + id, {})
// 提交审核
export const SubmitReview = (data) => http('/Api/StudentInfoImportingExport/SubmitReview', data, 'POST')
// 佐证材料启用或禁用
export const UpdateStatus = (data) => http(`/Api/StudentInfoImportingExport/UpdateStatus?id=${data.id}&status=${data.status}`, {}, 'PUT')
// 佐证材料排序
export const UpdateSort = (data) => http(`/Api/StudentInfoImportingExport/UpdateSort?id=${data.id}&sort=${data.sort}`, {}, 'PUT')
// 获取政府端列表
// export const GetGovernmentInformation = (id) => http(`/Api/StudentInfoImportingExport/GetGovernmentInformation?classId=${id}`, {})
// 修改佐证栏目
export const UpdateSupportingMaterials = (data) => http(`/Api/StudentInfoImportingExport/UpdateSupportingMaterials`, data, 'PUT')
// 在线学习跟踪记录
export const GetOnlineLearningTrackingRecords = (data) => http(`Api/StudentInfoImportingExport/GetOnlineLearningTrackingRecords?classId=${data.classId}&skipCount=${data.skipCount}&maxResultCount=${data.maxResultCount}`, {})
// 人才培养方案
export const GetTalentTrainingProgramInfo = (id) => http(`/Api/StudentInfoImportingExport/GetTalentTrainingProgramInfo?ClassId=${id}`, {})
// 学员花名册
export const GetClassInfoList = (data) => http(`/Api/StudentInfoImportingExport/GetClassInfoList`, data)
// 直播学习统计
export const GetLiveLearningStatistics = (data) => http(`/Api/StudentInfoImportingExport/GetLiveLearningStatistics`, data)
// 直播学习记录
export const GetLiveLearningRecord = (data) => http(`/Api/StudentInfoImportingExport/GetLiveLearningRecord`, data)
// 课程下拉列表
export const GetCourseList = (id) => http(`/Api/StudentInfoImportingExport/GetCourseList?classId=${id}`, {})
// 考勤记录
export const GetAttendanceRecordStatistics = (data) => http(`/Api/StudentInfoImportingExport/GetAttendanceRecordStatistics`, data)
// 在线学习考勤记录统计
export const GetAttendanceRecord = (data) => http(`/Api/StudentInfoImportingExport/GetAttendanceRecord`, data)
// 直播考勤
export const GetLiveAttendance = (data) => http(`/Api/StudentInfoImportingExport/GetLiveAttendance`, data)
// 成绩信息
export const GetRecord = (data) => http(`/Api/StudentInfoImportingExport/GetRecord`, data)
// 成绩信息 成绩查询树
export const GetExaminationArrangeTree = (data) => http(`/Api/StudentInfoImportingExport/GetExaminationArrangeTree`, data)
// 成绩信息 成绩查询详情
export const GetTheTestInformation = (data) => http(`/Api/StudentInfoImportingExport/GetTheTestInformation`, data)
