import http from "./http"

/* ------------------------------ 统一身份验证-用户管理------------------------------------- */
// 创建用户
export const createIdentityUser=(data) => http("/Api/Identity/Users",data,'POST')
// 分页查询用户列表
export const getIdentityUserList = (data) => http('/Api/Identity/Users', data)
// 删除用户
export const deleteIdentityUser =(data) => http('/Api/Identity/Users/'+data.id, data,'DELETE')
// 根据Id获取用户信息
export const getIdentityUserById = (id) => http('/Api/Identity/Users/'+id, {})
// 更新用户信息
export const updateIdentityUser=(data)=>http("/Api/Identity/Users/"+data.id,data,'PUT')
// 修改用户状态
// export const updateIdentityUserStatus=(data)=>http("/Api/Identity/Users/Status?id="+data.id+'&Status='+data.status,data,'PUT')
// 根据机构/企业 Id 查询用户列表
export const getUserListByAttach = (data) => http('/Api/Identity/Users/ByAttachedId', data)
// 锁定账户
export const updateIdentityUserLockout=(data)=>http("/Api/Identity/Users/Lockout?id="+data.id,{},'PUT')
// 账户解除锁定
export const updateIdentityUserUnLock=(data)=>http("/Api/Identity/Users/UnLock?id="+data.id,{},'PUT')
// 根据角色id获取用户列表
export const getIdentityUsersToRole = (roleId) => http('/Api/Identity/users/UsersInRole?roleId='+roleId, {})
// 获取用户角色列表
export const getIdentityUsersRolesList = (roleId) => http('/Api/Identity/users/'+roleId+'/roles', {})
/* ------------------------------ 统一身份验证-用户管理-角色------------------------------------- */
// 获取用户的所有角色
export const getIdentityUserRoles = (data) => http('/Api/Identity/Users/'+data.id+'/roles', data)
// 修改用户角色
export const updateIdentityUserRoles=(data)=>http("/Api/Identity/Users/"+data.id,data+'/roles','PUT')
// 根据用户名查询用户
export const getIdentityUserByUsername = (username) => http('/Api/Identity/Users/by-username/'+username, {})
// 根据邮箱查询用户
export const getIdentityUserByEmail = (email) => http('/Api/Identity/Users/by-email/'+email,{})

/* ------------------------------ 统一身份验证-角色管理------------------------------------- */
// 查看角色列表
export const getIdentityRoles = (data) => http('/Api/Identity/roles', data)
// 创建角色
export const createIdentityRoles=(data) => http("/Api/Identity/roles",data,'POST')
// 根据id查询角色
export const getIdentityRolesById = (id) => http('/Api/Identity/Roles/'+id, {})
// 修改角色信息
export const updateIdentityRoles=(data)=>http("/Api/Identity/Roles/"+data.id,data,'PUT')
// 删除角色
export const deleteIdentityRoles =(data) => http('/Api/Identity/Roles/'+data.id, data,'DELETE')
// 为角色批量添加用户
export const updateIdentityUsersToRole=(roleId,data)=>http("/Api/Identity/Roles/AddUsersToRole?roleId="+roleId,data,'POST')

/* ------------------------------ 统一身份验证-获取/更新/修改用户-------------------------------------- */
// 获得当前用户Profile
export const getIdentityProfile = (data) => http('/Api/Identity/my-profile', data)
// 更新当前用户Profile
export const updateIdentityProfile=(data)=>http("/Api/Identity/my-profile",data,'PUT')
// 修改当前用户密码
export const updateIdentityProfilePsd=(data) => http("/Api/Identity/my-profile/change-password",data,'POST')

/* ------------------------------ 统一身份验证- 角色->权限控制-------------------------------------- */
// GET 获取所有权限 providerName=R
export const getProfilePermission = (key) => http('/Api/abp/Permissions?providerName=R&providerKey='+key, {})
// PUT 更新角色的权限
export const updateProfilePermission=(key,data)=>http('/Api/abp/Permissions?providerName=R&providerKey='+key,data,'PUT')


/* ------------------------------ 统一身份验证- 修改用户密码-------------------------------------- */
// 重置用户密码-超级管理员
export const resetUserPwd =(data) => http('/Api/identity/users/change-user-password', data,'PUT')
// 修改用户密码-普通用户
export const updatePersonalPwd =(data) => http('/Api/identity/my-profile/change-password', data,'POST')