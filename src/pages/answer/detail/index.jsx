import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserInfo from "@/actions/userInfo";
import { View, Image, Swiper, SwiperItem, Video, Button } from "@tarojs/components";
import { API_ANSWER_SHOW } from "@/http/api/QUESTION";
import { API_ATTENTION, API_AGREE } from "@/http/api/COLLECT";
import { showPopup, showLoading, shareWx,setRefrs, checkRefrs,goLogin } from "@/utils/index";
import CollectMaster from "./collect";
import "./index.scss";

let innerAudioContext = null;

function mapStateToProps(state) {
  return { 
    userInfo: state.userInfo.toJS(),
    isIphone: state.isIphone.toJS()
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(UserInfo, dispatch)
  };
}
@connect(mapStateToProps, mapDispatchToProps)
class Index extends Component {

  state = {
    off: true,
    innerAudioContext: null,
    isPlay: true,
    isControls: false,
    answerData: {
      question: {
        images: []
      },
      answer: {}
    },
    bannerCurrent: 1,
    params: {},
    playSign:''
  }
  componentDidMount() {
    innerAudioContext = Taro.createInnerAudioContext();
    Taro.setInnerAudioOption({
      obeyMuteSwitch:false
    })
    this.setState({ innerAudioContext: innerAudioContext })
    this.setState({ params: getCurrentInstance().router.params },()=>{
      this.getListData()
    })
    //this.getListData()
  }
  componentDidShow() {
   
    if(checkRefrs("pages/answer/detail/index")){
      this.getListData()
    }
  
  }
  componentDidHide(){
    this.setState({ 
      off: true,
      playSign:''
     })    
     innerAudioContext.stop()
  }
  componentWillUnmount(){
    this.setState({ 
      off: true,
      playSign:''
     })
    innerAudioContext.stop()
  }
  onShareAppMessage() {
    shareWx();
    return {
      title: "回答详情",
      path: `/pages/answer/detail/index?id=${this.state.params.id}`,
      imageUrl: ""
    };
  }
  onReachBottom() {

  }
  onPullDownRefresh() {

  }
  async getListData() {
    try {
      showLoading();
      let { data } = await API_ANSWER_SHOW({
        id: this.state.params.id,
        unionid: this.props.userInfo.userInfo.unionid
      });
      Taro.hideLoading();
      this.setState({
        answerData: data
      });
      let Nums = this.state.answerData.question.images.length == 0 ? '1' : this.state.answerData.question.images.length
      let title = '1/' + Nums
      Taro.setNavigationBarTitle({
        title: title
      })
    } catch (err) {
      showPopup("载入远程数据错误");
    }
  }
  async updateCollect() {
    // 关注
    const { answerData } = this.state;
    if (answerData.unionid == this.props.userInfo.userInfo.unionid) {
      showPopup('无法关注自己~')
      return;
    }
    let { status, message } = await API_ATTENTION({
      type: 'person',
      id: answerData.wx_user_id,
      unionid: this.props.userInfo.userInfo.unionid,
      operate: answerData.is_attention ? 0 : 1
    });
    showPopup(message)
    if (status) {
      setRefrs(["pages/question/details/index"])
      answerData.is_attention = !answerData.is_attention;
      this.setState({
        answerData
      })
    }
  }
  async updateAgree() {
    if(!this.props.userInfo.userInfo.unionid){
      goLogin();
      return false
    }
    const { answerData } = this.state;
    let { status, message } = await API_AGREE({
      id: this.state.params.id,
      operate: answerData.is_agree ? 'desc' : 'incr',
      unionid: this.props.userInfo.userInfo.unionid
    });
    if (status) {
      setRefrs(["pages/qalist/index","pages/question/details/index"])
      this.getListData()
      showPopup(message)
    }
  }
  goRouter = (url) => {
    if (url == 'master') {
      url = `/pages/master/detail/index?unionid=${this.state.answerData.unionid}`
    } else {
      url = `/pages/answer/comment/index?id=${this.state.params.id}`;
    }
    Taro.navigateTo({
      url: url
    })
  }
  createInnerAudio = () => {
    const { innerAudioContext, answerData } = this.state;
    innerAudioContext.src = answerData.answer.voice_url;
    if (!this.state.off) {
      innerAudioContext.pause()
    } else {
      innerAudioContext.play()
    }
    innerAudioContext.onPlay(() => {
      this.setState({ 
        off: false,
        playSign:'正在播放'
      })
    })
    innerAudioContext.onPause(() => {
      this.setState({ 
        off: true,
        playSign:'已经暂停'
       })
    })
    innerAudioContext.onStop(() => {
      this.setState({ 
        off: true,
        playSign:''
       })
    })
    innerAudioContext.onEnded(() => {
      this.setState({ 
        off: true,
        playSign:''
       })
    })
  }
  render() {
    let { answerData, bannerCurrent, isPlay, isControls } = this.state;
    const isIphone = this.props.isIphone.isIphone;
    const videoContext = Taro.createVideoContext('answerVideo')
    let questionBanner;
    if (answerData.question.images.length > 0) {
      questionBanner = (
        <Swiper className='swiper' onChange={(e) => {
          this.setState({ bannerCurrent: e.detail.current + 1 });
          Taro.setNavigationBarTitle({
            title: this.state.bannerCurrent + '/' + answerData.question.images.length
          })
        }}
        >

          {answerData.question.images.map((item, index) =>
            <SwiperItem key={index}>
              <Image class='image' mode='aspectFit' src={item} />
            </SwiperItem>
          )}
        </Swiper>
      )
    } else {
      questionBanner = (
        <View className='banner-video'>
          <Video src={answerData.question.video_url}
            show-center-play-btn={false}
            controls={false}
          ></Video>
        </View>
      )
    }

    return (
      <View className={`${isIphone ? 'ipx' : 'pad-bot'} 'default-height'`}>
        <View onClick={this.goRouter.bind(this, 'master')}>
          <CollectMaster isCollect={answerData.is_attention} list={answerData} updateCollect={this.updateCollect.bind(this)} />
        </View>
        <View className='gray-line'></View>
        <View className='record-box'>
          <View className='record'>
          {answerData.answer.type == 2 ?
            <View className='video'>
              <View className='video-paly'>
                <Video id='answerVideo' src={answerData.answer.video_url}
                  object-fit='cover'
                  controls={isControls}
                  direction='0'
                  show-center-play-btn={false}
                  onPlay={() => {
                    this.setState({ isPlay: false, isControls: true })
                  }}
                  onPause={() => {
                    this.setState({ isPlay: true, isControls: false })
                  }}
                  onEnded={() => {
                    videoContext.exitFullScreen()
                   
                  }}
                >

                </Video>
                {
                  isPlay ? <View className='play' onClick={() => {videoContext.play()}}>
                    <View className='iconfont iconshipin'></View>
                  </View> : null
                }
              </View>
            </View> : 
            <View className='manager fl-row-justy' onClick={this.createInnerAudio}>
              <View className='iconfont iconziyuan'></View>
              <View className="play-sign">
                {this.state.playSign}
              </View>
              <View className='record-time'>{Math.ceil(answerData.answer.voice_time - 0)}″</View>
            </View>
          }
        </View>
        
          <View className='banner'>
            {questionBanner}
            <View className='paging'>
              {bannerCurrent}/{answerData.question.images.length > 0 ? answerData.question.images.length : 1}
            </View>
          </View>
          
        </View>
        
        <View className='question-title'>{answerData.question.title}</View>
        <View className={isIphone ? 'fot-ios' : 'fot-link'}>
          <View className='link agree' onClick={() => { this.updateAgree() }}>
            <View className='iconfont icondianzan'></View>
            <View className='text'>赞同({answerData.agree_num})</View>
          </View>
          <View className='line'></View>
          <View className='link comment' onClick={this.goRouter}>
            <View className='iconfont iconhuida'></View>
            <View className='text'>评论({answerData.comment_num})</View>
          </View>
          <View className='link'>
            <View className='iconfont iconfenxiang1'></View>
            <View className='text'>分享</View>
            <Button openType='share' className='share-btn'></Button>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
