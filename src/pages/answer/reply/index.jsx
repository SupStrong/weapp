import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Time from "@/actions/time";
import { View, Text, Video } from "@tarojs/components";
import * as UserInfo from "@/actions/userInfo";
import { API_ANSWER_CREAT } from "@/http/api/ANSWER";
import { API_OSSINFO } from "@/http/api/COMMON";
import { API_USER_SHOW } from "@/http/api/USER";
import { API_LIFE_OPREATE } from "@/http/api/LIFE";
import { showPopup, showLoading, setRefrs, sendFormId } from "@/utils/index";
import "./index.scss";
import envConfig from "../../../http/env";

let voiceTimer = null;
let countTimer = null;
let playCountTimer = null;
let innerAudioContext = null;
function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS(),
    isIphone: state.isIphone.toJS(),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(UserInfo, dispatch),
    ...bindActionCreators(Time, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class List extends Component {
  constructor(props) {
    super(props);

    this.chooseVideo = this.chooseVideo.bind(this);
    this.alertShowFn = this.alertShowFn.bind(this);
    this.playVoice = this.playVoice.bind(this);

    this.state = {
      questionId: "",
      question: "",
      infoData: {},
      videoPath: "",
      videoTime: "",
      voicePath: "",
      voiceTime: "",
      whichOne: 2,
      startVoiceSave: false,
      voiceCount: 0,
      playCount: 0,
      alertShow: false,
      rmg: null,
      iac: null,
    };
    this.ossInfo = {}
  }
  componentDidMount() {
    let res = getCurrentInstance().router.params;
    this.setState({
      questionId: res.que_id,
      question: res.question,
    });

    this.getOssInfo();
    this.getMine();
  }

  componentDidShow() { }
  componentDidHide () {
    clearInterval(countTimer);
    clearTimeout(voiceTimer);
    clearInterval(playCountTimer);
    innerAudioContext.stop()
  }
  componentWillUnmount(){
    clearInterval(countTimer);
    clearTimeout(voiceTimer);
    clearInterval(playCountTimer);
    innerAudioContext.stop()
  }
  onReachBottom() { }

  changeType(t, e) {
    if (this.state.iac) {
      this.state.iac.stop();
    }

    this.setState({
      whichOne: t,
      videoPath: "",
      voicePath: "",
      voiceCount: 0,
    });
    //阻止事件穿透
    e.stopPropagation();
  }
  async saveAnswer() {
    sendFormId({
      modelIdArr: [
        JSON.parse(envConfig.formId).zan,
        JSON.parse(envConfig.formId).comment,
      ],
      question_id: 0,
    }).then(() => {
      try {
        showLoading();
        const { } = API_ANSWER_CREAT({
          data: {
            id: this.state.questionId,
            source_url:
              this.state.whichOne == 1
                ? this.state.voicePath
                : this.state.videoPath,
            source_time:
              this.state.whichOne == 1
                ? Math.ceil(this.state.voiceTime)
                : Math.ceil(this.state.videoTime),
            type: this.state.whichOne,
            unionid: this.props.userInfo.userInfo.unionid,
          },
        });
        Taro.hideLoading();

        setRefrs(["pages/qalist/index", "pages/question/details/index"]);
        if (this.state.infoData.is_verified == 0) {
          Taro.reLaunch({
            url: `/pages/master/verify/index/index?question_id=${this.state.questionId}`,
          });
        } else {
          Taro.navigateBack({
            delta: 1,
          });
        }
        this.lifeTime();
      } catch (error) {
        showPopup("提交失败");
      }
    });
  }
  // 贡献记录
  async lifeTime() {
    try {
      showLoading();
      const { status, message } = await API_LIFE_OPREATE({
        type: 6,
        opreate_type: "incr",
        unionid: this.props.userInfo.userInfo.unionid,
      });
      Taro.hideLoading();
      if (!status) {
        showPopup(message);
        return false;
      }
    } catch (error) { }
  }
  // 选择视频
  chooseVideo() {
    let that = this;
    Taro.chooseVideo({
      sourceType: ["album"],
      success: function (res) {
        if (res.duration > 180) {
          showPopup("视频大于3分钟");
        } else {
          that.ossUpload(res.tempFilePath, res.duration);
        }
      },
      fail: function () {
        showPopup("视频加载失败");
      },
    });
  }
  //录音

  startSaveVoice() {
    let that = this;
    const recorderManager = Taro.getRecorderManager();
    that.setState({
      rmg: recorderManager,
    });
    Taro.getSetting({
      success: function (res) {
        if(res.authSetting['scope.record']||res.authSetting['scope.record']==undefined){
          if (that.state.startVoiceSave) {
            that.alertShowFn();
          } else {
            that.setState({
              voiceCount: 0,
            });
            const options = {
              duration: 180000,
            };
            recorderManager.start(options);
      
            that.setState({
              startVoiceSave: true,
            });
            recorderManager.onStart(() => {
              countTimer = setInterval(function () {
                that.setState({
                  voiceCount: that.state.voiceCount + 1,
                });
              }, 1000);
              voiceTimer = setTimeout(function () {
                that.stopSaveVoice(recorderManager);
              }, 180000);
            });
          }
        }else{
          showPopup('请授权麦克风')
          Taro.openSetting({
            success: function () {
            }
          })
          that.alertShowFn();
          return false;
        }

      }
    })

  }
  stopSaveVoice(obj = this.state.rmg) {
    clearInterval(countTimer);
    clearTimeout(voiceTimer);
    this.setState({
      startVoiceSave: false,
      playCount: this.state.voiceCount,
    });
    obj.stop(); // 结束录音
    obj.onStop((res) => {
      const { tempFilePath, duration } = res;
      let time = duration / 1000;
      this.ossUpload(tempFilePath, time);
    });
  }

  playVoice() {
    clearInterval(playCountTimer);
    let that = this;
    that.setState({
      playCount: that.state.voiceCount,
    });
    innerAudioContext = Taro.createInnerAudioContext();
    Taro.setInnerAudioOption({
      obeyMuteSwitch:false
    })
    that.setState({
      iac: innerAudioContext,
    });
    innerAudioContext.src = this.state.voicePath;
    innerAudioContext.play();
    innerAudioContext.onPlay(() => {
      showPopup("开始播放");
      that.setState({
        playCount: that.state.voiceCount,
      });
      clearInterval(playCountTimer);
      playCountTimer = setInterval(function () {
        if (that.state.playCount > 0) {
          that.setState({
            playCount: that.state.playCount - 1,
          });
        }
      }, 1000);
    });
    innerAudioContext.onEnded(() => {
      clearInterval(playCountTimer);
      that.setState({
        playCount: that.state.voiceCount,
      });
    });
    innerAudioContext.onStop(() => {
      clearInterval(playCountTimer);
      that.setState({
        playCount: that.state.voiceCount,
      });
    });
    innerAudioContext.onError(() => { });
  }

  async getOssInfo() {
    let that = this;
    try {
      showLoading();
      let postData = {
        dir: that.props.userInfo.userInfo.unionid,
      };
      const { data } = await API_OSSINFO(postData);
      Taro.hideLoading();
      that.ossInfo = data
    } catch (error) {
      showPopup("载入远程数据错误");
    }
  }
  async getMine() {
    try {
      showLoading();
      const { data } = await API_USER_SHOW({
        id: this.props.userInfo.userInfo.unionid,
        unionid: this.props.userInfo.userInfo.unionid,
      });
      Taro.hideLoading();
      this.setState({
        infoData: data,
      });
    } catch (error) {
      showPopup("载入远程数据错误");
    }
  }
  ossUpload(tempFilePath, time) {
    let that = this;
    showLoading(that.state.whichOne == 2 ? "视频上传中" : "音频上传中", true);
    let dirPath = that.ossInfo.dir + that.random_string(10);
    Taro.uploadFile({
      url: that.ossInfo.host, //开发者服务器 url
      filePath: tempFilePath, //要上传文件资源的路径
      name: "file", //必须填file
      formData: {
        key: dirPath,
        policy: that.ossInfo.policy,
        OSSAccessKeyId: that.ossInfo.accessid,
        signature: that.ossInfo.signature,
        success_action_status: "200",
        callbackUrl: that.ossInfo.callbackurl,
      },
      success: function () {
        Taro.hideLoading();
        if (that.state.whichOne == 2) {
          that.setState({
            videoPath: that.ossInfo.host + "/" + dirPath,
            videoTime: time,
          });
        } else {
          that.setState({
            voicePath: that.ossInfo.host + "/" + dirPath,
            voiceTime: time,
          });
        }
      },
      fail: function () {
        Taro.hideLoading();
        showPopup("上传失败");
      },
    });
  }
  random_string(len) {
    len = len || 32;
    var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    var maxPos = chars.length;
    var pwd = "";
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

  alertShowFn() {
    let val = !this.state.alertShow;
    this.setState({
      alertShow: val,
    });
    if (this.state.startVoiceSave) {
      this.stopSaveVoice();
    }
  }

  render() {
    const {
      whichOne,
      videoPath,
      startVoiceSave,
      voiceCount,
      playCount,
      alertShow,
      voicePath,
    } = this.state;
    return (
      <View className='content'>
        <View className='question G-Fsize-16 G-bold G-color-222'>
          {this.state.question}
        </View>
        <View className='line'></View>
        {/* 视频 */}
        {whichOne == 2 && (
          <View className='contain'>
            <View className='box'>
              {/* 判断是否上传视频 */}
              {videoPath.length > 0 ? (
                <View className='video-box'>
                  <Video src={this.state.videoPath} className='video'></Video>
                  <View
                    className='close-con fl-row-center'
                    onClick={this.changeType.bind(this, 2)}
                  >
                    <Text className='iconfont iconguanbi G-color-white G-Fsize-15'></Text>
                  </View>
                </View>
              ) : (
                  <View className='type' onClick={this.chooseVideo}>
                    <Text className='iconfont iconshipin2 G-color-222'></Text>
                    <View className='word G-Fsize-14 G-color-222'>上传视频</View>
                    <View className='remarks G-Fsize-14'>
                      注：视频时间不可超过3分钟
                  </View>
                  </View>
                )}
            </View>
            <View
              className={`submit-btn btn G-Fsize-16 ${videoPath.length > 0 ? "saved" : ""
                }`}
              onClick={videoPath.length > 0 ? this.saveAnswer.bind(this) : ""}
            >
              提交
            </View>
            <View
              className='change-btn btn G-Fsize-16 G-color-222'
              onClick={this.changeType.bind(this, 1)}
            >
              我希望用语音进行回答
            </View>
          </View>
        )}

        {/* 语音 */}
        {whichOne == 1 && (
          <View className='contain'>
            <View className='box'>
              {/* 判断是否上传语音 */}
              {voicePath.length > 0 ? (
                <View className='voice-box'>
                  <View className='voice fl-row-justy' onClick={this.playVoice}>
                    <Text className='iconfont iconziyuan G-color-222 G-Fsize-16 G-bold'></Text>
                    <Text className='num  G-Fsize-16 G-bold'>{playCount}″</Text>
                  </View>
                  <View
                    className='close-con fl-row-center'
                    onClick={this.changeType.bind(this, 1)}
                  >
                    <Text className='iconfont iconguanbi G-color-white G-Fsize-15'></Text>
                  </View>
                </View>
              ) : (
                  <View className='type' onClick={this.alertShowFn}>
                    <Text className='iconfont iconziyuan G-color-222'></Text>
                    <View className='word G-Fsize-14 G-color-222'>开始录音</View>
                    <View className='remarks G-Fsize-14'>
                      注：语音时间不可超过3分钟
                  </View>
                  </View>
                )}
            </View>
            <View
              className={`submit-btn btn G-Fsize-16 ${voicePath.length > 0 ? "saved" : ""
                }`}
              onClick={voicePath.length > 0 ? this.saveAnswer.bind(this) : ""}
            >
              提交
            </View>
            <View
              className='change-btn btn G-Fsize-16 G-color-222'
              onClick={this.changeType.bind(this, 2)}
            >
              我希望用视频进行回答
            </View>

            {/* 录制音频弹窗 */}

            {alertShow && (
              <View className='bg'>
                <View className='black-bg' onClick={this.alertShowFn}></View>
                <View className='alert-b'>
                  <View className='title G-Fsize-16 G-color-222 G-bold'>
                    录制音频
                  </View>
                  <Text
                    className='iconfont iconguanbi close G-color-999'
                    onClick={this.alertShowFn}
                  ></Text>
                  <View className='con fl-row-justy'>
                    <View className='left fl-row-left'>
                      <View
                        className={`cir1 ${startVoiceSave ? "start" : ""}`}
                        onClick={this.startSaveVoice.bind(this)}
                      >
                        <View
                          className={`cir2 ${startVoiceSave ? "start" : ""}`}
                        >
                          <View
                            className={`cir3 ${startVoiceSave ? "start" : ""}`}
                          ></View>
                        </View>
                      </View>
                      <Text className='G-Fsize-14 G-color-222'>
                        {startVoiceSave ? "点击完成" : "录制音频"}
                      </Text>
                    </View>

                    <Text className='right G-Fsize-18 G-bold'>
                      {voiceCount}″/600″
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

export default List;
