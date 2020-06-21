// var hostname = 'emqx.gd', //'192.168.1.2',
// port = 80,
// clientId = 'mqttx_9ebbfa4e',
// timeout = 60,
// keepAlive = 100,
// cleanSession = false,
// ssl = false,
// userName = 'wangsisi',  
// // password = '123',  
// topic = 'Notify/WeChatPayCompleted';
// const clientMqtt = new Paho.MQTT.Client(hostname, port, clientId)
// //建立客户端实例  
// var options = {
// invocationContext: {
// host: hostname,
// port: port,
// path: clientMqtt.path,
// clientId: clientId
// },
// timeout: timeout,
// keepAliveInterval: keepAlive,
// cleanSession: cleanSession,
// useSSL: ssl,
// // userName: userName,  
// // password: password,  
// onSuccess: onConnect,
// onFailure: function (e) {
// console.log(e)
// let s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onFailure()}";
// console.log(s)
// }
// };
// clientMqtt.connect(options)
// //连接服务器并注册连接成功处理事件  
// function onConnect() {
// console.log("onConnected")
// let s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onConnected()}";
// console.log(s)
// clientMqtt.subscribe(topic)
// }

// clientMqtt.onConnectionLost = onConnectionLost;
// //注册连接断开处理事件  
// clientMqtt.onMessageArrived = onMessageArrived;
// //注册消息接收处理事件  
// function onConnectionLost(responseObject) {
// console.log(responseObject,'===========')
// let s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onConnectionLost()}";
// console.log(s)
// if (responseObject.errorCode !== 0) {
// console.log("连接已断开,onConnectionLost:" + responseObject.errorMessage)
// }
// }

// function onMessageArrived(message) {
// let s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onMessageArrived()}";

// console.log("收到消息:" + message.payloadString)
// }

// function send() {
// var s = document.getElementById("msg").value;
// if (s) {
// s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", content:" + (s) + ", from: web console}";
// message = new Paho.MQTT.Message(s)
// message.destinationName = topic;
// clientMqtt.send(message)
// document.getElementById("msg").value = "";
// }
// }

// var count = 0;  
// function start() {
// window.tester = window.setInterval(function () {
// if (clientMqtt.isConnected) {
//   var s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", content:" + (count++) + ", from: web console}";
//   message = new Paho.MQTT.Message(s)
//   message.destinationName = topic;
//   clientMqtt.send(message)
// }
// }, 1000)
// }      
// function stop() {
// window.clearInterval(window.tester)
// }

// Date.prototype.Format = function (fmt) { 
// var o = {
// "M+": this.getMonth() + 1, //月份 
// "d+": this.getDate(), //日 
// "h+": this.getHours(), //小时 
// "m+": this.getMinutes(), //分 
// "s+": this.getSeconds(), //秒 
// "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
// "S": this.getMilliseconds() //毫秒 
// };
// if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
// for (var k in o)
// if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
// return fmt;
// }
// export default {
// // Vue.js的插件应当有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
// install: function (Vue) {
// Vue.prototype.clientMqtt = () => clientMqtt
// }
// }
