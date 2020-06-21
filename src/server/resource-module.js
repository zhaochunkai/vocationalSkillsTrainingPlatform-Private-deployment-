import http from './http'
/* ------------------------------------- 资源库设置-全局设置 ------------------------------------- */
// 批量更改配置项值
export const updateEtsGlobalSetting = (data) => http('/Api/EtsGlobalSetting/BatchSet', data, 'PUT')
// 获取所有配置项和配置项值  ---用于：显示最新的配置信息
export const getEtsGlobalSettingAll = (data) => http('/Api/EtsGlobalSetting/All', data)
// 获取所有配置项定义----用于：只有中文名称、默认值和描述信息
// export const getEtsGlobalSettingAllAllDefinition = (data) => http('/Api/EtsGlobalSetting/AllDefinition', data)

/* ------------------------------------- 资源库设置-资源库 ------------------------------------- */
// 获得资源库信息
export const getWarehouseById = (id) => http(`/Api/Warehouse/${id}`, {})
// 获得资源库列表
export const getWarehouseList = (data) => http('/Api/Warehouse', data)
// 创建资源库
export const createWarehouse = (data) => http('/Api/Warehouse', data, 'POST')
// 更新资源库
export const updateWarehouse = (data) => http(`/Api/Warehouse/?id=${data.id}`, data, 'PUT')
// 删除资源库
export const deleteWarehouse  = (data) => http(`/Api/Warehouse/?id=${data.id}`, data, 'DELETE')
// 获得资源库列表 (带管理员信息)
export const getWarehouseAdmin = (id) => http(`/Api/Warehouse/WarehouseAdmins?id=${id}`, {})
// 资源库上移
export const updateWarehouseMoveUp = (data) => http(`/Api/Warehouse/MoveUp?id=${data.id}`, data, 'PUT')
// 资源库下移
export const updateWarehouseMoveDown = (data) => http(`/Api/Warehouse/MoveDown?id=${data.id}`, data, 'PUT')
// 为资源库添加管理员
export const updateWarehouseSetAdmin = (id, arr) => http(`/Api/Warehouse/SetAdmin?id=${id}`, arr, 'POST')
// 获得资源库下的所有资源(包含子资源库的)-----和树一起使用
export const getWarehouseResourceList = (data) => http('/Api/Warehouse/WarehouseResources', data)

/* ------------------------------------- 短信/流量 ------------------------------------- */
// 流量支付策略
export const getFluxPayStrategy = (data) => http('/Api/LiveVideo/pay-strategies', data)
// 根据流量支付策略Id获得微信支付二维码
export const getFluxPayStrategyCode = (id) => http(`/Api/LiveVideo/pay-qr-code?id=${id}`, {})
// 获取流量充值订单列表
export const getFluxOrder = () => http('/Api/LiveVideo/orders', {})
// 获取直播流量账单
export const getLiveRoomBilling = (data) => http('/Api/LiveVideo/billings', data)
// 获取剩余流量
export const getResidueFlux = () => http('/Api/LiveVideo/statistic', {})
// 获得租户的资源流量账单
export const getFileFluxBilling = (data) => http('/Api/ExternalFiles/get-file-flux-billing', data)

/* ------------------------------------- CDN ------------------------------------- */
// CDN 流量策略
export const getCdnAllPayStrategy = () => http('/Api/CdnFluxPayStrategy/GetAllPayStrategy',{})
// CDN 流量充值 
export const GenerateCDNPayQrCode = (strategyId) => http('/Api/CdnFluxPayStrategy/GeneratePayQrCode?strategyId='+strategyId, {}, 'POST')
// CDN 流量充值记录
export const getCDNOrderList = (data) => http('/Api/CdnFlux/GetOrderList', data)
// CDN 流量账单列表
export const getCDNBillingList = (data) => http('/Api/CdnFlux/GetBillingList', data)
// CDN 剩余流量
export const GetCdnFluxResidue = () => http('/Api/CdnFlux/GetCdnFluxResidue', {})
// CDN 获取启用停用状态
export const GetCdnSettingForCurrentTenant = () => http('/Api/CdnFlux/GetCdnSettingForCurrentTenant', {})
// CDN 更改启用停用状态
export const SetCdnSettingForCurrentTenant = (enabled) => http('/Api/CdnFlux/SetCdnSettingForCurrentTenant?enabled='+enabled, {}, 'PUT')
