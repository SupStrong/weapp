import Taro from "@tarojs/taro";
import { API_LIFE_OPREATE, API_LIFE_TIME } from "@/http/api/LIFE";
import { API_ACTIVE_INFO } from "@/http/api/ACTIVE";
import { API_SUBSCRIBE } from "@/http/api/COMMON";
import * as Time from "@/actions/time";
import { INIT } from "../constants/time";
import envConfig from '../http/env'

let timerID = '';
let refrsArr = ["pages/qalist/index"]

//消息弹窗
export function showPopup(msg, isicon = "none", duration = 2000) {
  Taro.showToast({
    title: msg,
    icon: isicon,
    duration: duration
  });
}

//显示loading
export function showLoading(msg = "加载中", mask = false) {
  Taro.showLoading({
    title: msg,
    mask: mask
  });
}

export function previewImage(url, imgs) {
  Taro.previewImage({
      current: url,
      urls: imgs
  });
}


//格式化时间
export function getTime(time) {
  let useTime = time;
  let hour = parseInt(useTime / 3600);
  let minute = parseInt((useTime - hour * 3600) / 60);
  let s = parseInt(useTime % 60);
  hour < 10 ? (hour = "0" + hour) : "";
  minute < 10 ? (minute = "0" + minute) : "";
  s < 10 ? (s = "0" + s) : "";
  return { hour, minute, s };
}

//跳转到授权页面
export function goLogin() {
  Taro.navigateTo({
    url: `/pages/auth/index`
  });
}

//微信分享
export function shareWx() {
  let { userInfo } = Taro.$store.getState().userInfo.toJS();
  API_LIFE_OPREATE({ type: 3, opreate_type: "incr", unionid: userInfo.unionid });
}

//获取生命周期
export async function getLife() {
  const res = await API_LIFE_TIME();
  Taro.$store.dispatch({ type: INIT, time: res.data.time });
  // if(timerID !== ''){
  //   return
  // }
  startInterval()
}


//获取活动信息
export async function getActiveInfo() {
  try {
    const { status, message, data } = await API_ACTIVE_INFO();
    
    if(!status){
      showPopup(message)
      return
    }  
    return data
  } catch (error) {
    showPopup("载入远程数据错误");
  }
}



/**
 * 检测当前的小程序
 * 是否是最新版本，是否需要下载、更新
 */
export function checkUpdateVersion() {
  //判断微信版本是否 兼容小程序更新机制API的使用
  if (Taro.canIUse("getUpdateManager")) {
    //创建 UpdateManager 实例
    const updateManager = Taro.getUpdateManager();
    if(!updateManager){
      return 
    }
    //检测版本更新
    updateManager.onCheckForUpdate(function() {
      // 请求完新版本信息的回调
    });
    //监听小程序有版本更新事件
    updateManager.onUpdateReady(function() {
      //TODO 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
      
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });
    updateManager.onUpdateFailed(function() {
      // 新版本下载失败
      Taro.showModal({
        title: "已经有新版本喽~",
        content: "请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~"
      });
    });
  } else {
    //TODO 此时微信版本太低（一般而言版本都是支持的）
    Taro.showModal({
      title: "溫馨提示",
      content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
    });
  }
}

//开始定时器
export function startInterval() {
  // return 
  timerID = setInterval(() => {
   
    if (Taro.$store.getState().time.toJS().time == 1) {
      stopInterval();
    }
    Taro.$store.dispatch(Time.minus());
  }, 1000);
}

export function stopInterval() {
  clearInterval(timerID);
}




export async function uploadImg({num=1,maxSize=5}){

  let {tempFiles} = await chooseImage(num,maxSize)
  if(tempFiles.length == 0){
    return false
  }
  let pathArr = []
  showLoading('图片上传中', true);
  for (const iterator of tempFiles) {
    if (iterator.size > maxSize*1024*2014) {
      showPopup(`单个图片大小不可超过${maxSize}M`)
      return false
    }
    let {path,status} = await uploadImgFile(iterator.path)
    if(!status){
      showPopup('上传失败')
      return 
    }
    pathArr.push(path) 
  }
  Taro.hideLoading();
  showPopup('上传成功！');
  return pathArr
}

function chooseImage(num){
  return new Promise(resolve =>{
    Taro.chooseImage({
      count: num,
      sizeType: ["compressed", "original"],
      sourceType: ["album", "camera"],
      success(res) {
        resolve(res)
      },
      fail() {
      },
      complete() {
      }
    });
  })
}

function uploadImgFile(tempFile){
  let { userInfo } = Taro.$store.getState().userInfo.toJS();
  return new Promise(resolve=>{
    Taro.uploadFile({
      url: envConfig.baseUrl + 'upload',
      filePath: tempFile,
      name: "files",
      header: {
        token: userInfo.token
      },
      formData: {
        filePath: tempFile,
        name: "files",
        media:'images'
      },
      success(res) {
            let pathS = JSON.parse(res.data);
            if(pathS.status){
            resolve({path:pathS.data.path,status:1})
            }else{
              resolve({path:'',status:0})
            }
      },
    });
  })
}

export function sendFormId(obj) {
  return new Promise(resolve => {
      Taro.requestSubscribeMessage({
          tmplIds: obj.modelIdArr,
          success(res) {
              if (res.errMsg == 'requestSubscribeMessage:ok') {
                  resolve()
                  var list = Object.keys(res).filter(e => res[e] === 'accept');
                  delete res.errMsg;
                  if (list.length > 0) {
                      var authorizedTemplateIds = res;
                      API_SUBSCRIBE({
                          openid: Taro.$store.getState().userInfo.toJS().userInfo.openid,
                          template_id: authorizedTemplateIds,
                          question_id: obj.question_id
                      })
                  }
              }
          },
          fail(res) {
              var outCode = res.errCode;
              if (res.errCode == 20004) {
                  var content = '建议开启订阅消息，接收智慧门店小程序发送的消息通知';
              }
              if (res.errCode == 10002) {
                  var content = '网络问题，请求消息失败,建议退出本页面重新进入';
              }
              Taro.showModal({
                  title: '提示',
                  content: content,
                  cancelText: '取消',
                  confirmText: '去开启',
                  showCancel: true,
                  success: function(modalres) {
                      if (modalres.confirm) {
                        Taro.openSetting({})
                      } else if (modalres.cancel) {
                          if (outCode == 20004) {
                              resolve();
                          }
                      }
                  },
              })
          }
      })
  })
}

let freshTimer= null;
export function checkRefrs(path=''){
  clearTimeout(freshTimer)
  if(refrsArr.includes(path)){
    freshTimer=setTimeout(()=>{
      setRefrs([path],'decrease')
    },1000)
    return true
  }
  return false
}

export function setRefrs(pathArr,type='add'){
  if(type == 'add'){
    let newSet = new Set([...refrsArr,...pathArr])
    refrsArr = Array.from(newSet)
    return
  }
  let index = refrsArr.indexOf(pathArr[0])
  refrsArr.splice(index,1)
}