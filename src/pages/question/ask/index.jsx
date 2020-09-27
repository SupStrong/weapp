import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Textarea, Progress, Video, Image, Text } from "@tarojs/components";
import { showPopup, showLoading, shareWx,uploadImg,sendFormId,setRefrs } from "@/utils/index";
import { API_LIFE_OPREATE } from "@/http/api/LIFE";
import { API_OSSINFO } from "@/http/api/COMMON";
import { API_QUESTION_SAVE,API_QUESTION_SHOW } from "@/http/api/QUESTION";
import "./index.scss";
import envConfig from '../../../http/env'

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS(),
  };
}

@connect(mapStateToProps)
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeData:{},
      title: '',
      maintainImg: [],
      video_url: [],
      ossInfo: {},
      cityData:{},
      prograssBol: false,
      prograssLine: 0,
    };
  }
  componentDidMount () {
    let routeData = Taro.getCurrentInstance().router.params;
    this.setState({routeData:routeData});
    if(routeData.title){
      this.setState({
        title:routeData.title
      })
    }
    if(routeData.id){
      this.getQuestionShow(routeData.id)
    }
    this.getOssInfo();
  }
  componentDidShow (){
    this.setState({
      cityData: Taro.getStorageSync('questionCity') || {id:'',name:'请选择城市'}
    });
  }
  onShareAppMessage() {
    shareWx()
    return {
      title: '',
      path: '',
      imageUrl: '',
    }
  }
  async getQuestionShow(id) {
    try {
      showLoading();
      let postData = {
        id:id,
        unionid: this.props.userInfo.userInfo.unionid
      };
      const { data } = await API_QUESTION_SHOW(postData);
      Taro.hideLoading();
      this.setState({title: data.title});
      this.setState({video_url: data.video_url!=''?[data.video_url]:[]});
      this.setState({maintainImg: data.images});
      this.setState({cityData: data.city_data});
    } catch (error) {
      showPopup("载入远程数据错误");
    }
  }
  async getOssInfo() {
    try {
      showLoading();
      let postData = {
        dir: this.props.userInfo.userInfo.unionid
      };
      const { data } = await API_OSSINFO(postData);
      Taro.hideLoading();
      let { ossInfo } = this.state;
      ossInfo = data;
      this.setState({
        ossInfo: ossInfo
      });
    } catch (error) {
      showPopup("载入远程数据错误");
    }
  }
  chooseVideo() {
    let _that = this
    Taro.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        _that.uploadVideo(res.tempFilePath, res.result)
      }
    })
  }
  uploadVideo(tempFilePath) {
    showLoading('视频上传中', true);
    let _that = this;
    _that.setState({
      prograssBol: true
    });
    let dirPath = _that.state.ossInfo.dir + _that.random_string(10);
    const uploadTask = Taro.uploadFile({
      url: _that.state.ossInfo.host, //开发者服务器 url
      filePath: tempFilePath, //要上传文件资源的路径
      name: "file", //必须填file
      formData: {
        key: dirPath,
        policy: _that.state.ossInfo.policy,
        OSSAccessKeyId: _that.state.ossInfo.accessid,
        signature: _that.state.ossInfo.signature,
        success_action_status: "200",
        callbackUrl:_that.state.ossInfo.callbackurl
      },
      success: function () {
        Taro.hideLoading();
        let { video_url } = _that.state;
        video_url = [...video_url, _that.state.ossInfo.host +'/'+ dirPath];
        _that.setState({
          video_url: video_url
        });
        _that.setState({
          prograssBol: false
        });
      },
      fail: function () {
      },
    });
    uploadTask.progress((res) => {
      _that.setState({
        prograssLine: res.progress
      });
    })
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

  async chooseImage() {
    let _that = this;
    let countImg = 5 - this.state.maintainImg.length;
    let data = await uploadImg({ num: countImg });
    let { maintainImg } = _that.state;
    let arrData=[];
    if(data){
      data.forEach(element => {
        arrData.push(envConfig.imgUrl + element)
      });
    }
    maintainImg = [...maintainImg,...arrData];
    _that.setState({
      maintainImg: maintainImg
    });
  }

  delImg(type, index) {
      let maintainImg_source = this.state.maintainImg;
    if (type == 'video_url') {
      let video_url_source = this.state.video_url;
      video_url_source.splice(index, 1);
      this.setState({
        video_url: video_url_source
      });
    } else {
      maintainImg_source.splice(index, 1);
      this.setState({
        maintainImg: maintainImg_source
      });
    }
  }
  // 文本框双向绑定
  textareaChange(e) {
    this.setState({
      title: e.target.value,
    });
  }

  setRouter() {
    Taro.navigateTo({
      url: `/pages/city/index?cityId=${this.state.cityData.id}`
    });
  }
  previewImage(url, args) {
    Taro.previewImage({
      current: url, // 当前显示图片的http链接
      urls: args // 需要预览的图片http链接列表
    })
  }
  // 播放视频
  videoPlay() {
    let videoplay = Taro.createVideoContext("video");
    videoplay.requestFullScreen()
  }
  // 视频改变全屏触发事件
  changes(event) {
    let videoplay = Taro.createVideoContext("video");
    if (event.detail.fullScreen == true) {
      videoplay.play();
    }
    if (event.detail.fullScreen == false) {
      videoplay.pause();
    }
  }
  async submitForm() {
    let postData = {
      id: this.state.routeData.id || '',
      unionid: this.props.userInfo.userInfo.unionid,
      title: this.state.title,
      video_url: this.state.video_url[0] || '',
      images: this.state.maintainImg,
      city_id: this.state.cityData.id,
    };
    if(postData.title == ''){
      showPopup('请填写标题')
      return false;
    }
    if(!(postData.video_url != '' || postData.images.length != 0)){
      showPopup('视频或图片必传一种')
      return false;
    }
    if(postData.city_id == ''){
      showPopup('请选择所在位置')
      return false;
    }
    let _that = this;
    sendFormId({
      'modelIdArr':[JSON.parse(envConfig.formId).ask, JSON.parse(envConfig.formId).answer],
      'question_id':this.state.routeData.id ? this.state.routeData.id : 0,
    }).then(() =>{
      _that.state.routeData.id ?  setRefrs(["pages/qalist/index","pages/question/details/index"]) :  setRefrs(["pages/qalist/index"])     
      showLoading();
      API_QUESTION_SAVE(postData).then((res)=>{
        API_LIFE_OPREATE({ type: 5, opreate_type: "incr", unionid: _that.props.userInfo.userInfo.unionid });
        showPopup('发布成功')
        setTimeout(function(){
          if(res.data.id){
            if(_that.state.routeData.id){
              Taro.navigateBack({
                delta: 2 // 返回上两级页面。
              });
            }else{
              Taro.reLaunch({
                url:`/pages/question/details/index?id=${res.data.id}`
              })
            }
          }else{
            showPopup('没有返回问题id')
          }
        },1000)

      });
      
      
     
      Taro.hideLoading();
    })
    try {
      
    } catch (error) {
      showPopup("载入远程数据错误");
    }
  }
  getSubmitStatus(){
    if(this.state.title == ''){
      return false;
    }
    let video_url = this.state.video_url[0] || ''
    if(!( video_url != '' || this.state.maintainImg.length != 0)){
      return false;
    }
    if(this.state.cityData.id == ''){
      return false;
    }
    return true
  }
  render() {
    const { maintainImg, video_url } = this.state;
    const formStatus = this.getSubmitStatus()
    const videos = video_url.map((item, index) => {
      return <View className='ask-video-box-img' key={index}>
        <Video id='video' className='image-or-video' src={item}     onFullscreenChange={this.changes.bind(this)} 
          showPlayBtn={false}
          showCenterPlayBtn={false} 
          showFullscreenBtn={false}
        >
        </Video>
        <View className='v-content fl-row-center' onClick={this.videoPlay.bind(this)}>
          <View className='iconfont iconshipin'></View>
        </View>
        <View className='delete-relevantImg fl-row-center' onClick={this.delImg.bind(this, 'video_url', index)}>
          <View className='iconfont iconguanbi'></View>
        </View>
      </View>
    })
    const images = maintainImg.map((item, index) => {
      return <View className='ask-video-box-img' key={index}>
        <Image className='image-or-video' src={item} onClick={this.previewImage.bind(this, item, maintainImg)} />
        <View className='delete-relevantImg fl-row-center' onClick={this.delImg.bind(this, 'maintainImg', index)}>
          <View className=' iconfont iconguanbi'></View>
        </View>
      </View>
    })


    return (
      <View className='content'>
        <Textarea value={this.state.title} onInput={this.textareaChange.bind(this)} placeholder='请在此处写下您的问题，50字内' maxlength='50' className='ask-text' placeholderClass='ask-placeholder' />
        <View className='ask-bd'></View>
        <View className='ask-media'>
          <View className='ask-video'>
            {videos}
            {video_url.length < 1 && <View className='ask-video-box fl-column-center' onClick={this.chooseVideo.bind(this)}>
              <View className='icon'>
                <View className='iconfont iconshipin2'></View>
              </View>
              <View className='text'>上传视频</View>
              {/* 上传视频进度条 */}
              {this.state.prograssBol && <View className='prograss fl-row-center'>
                <Progress className='line' percent={this.state.prograssLine} activeMode='forwards' strokeWidth={4} borderRadius={2} active color='white' activeColor='blue' />
              </View>}
            </View>}
            {images}
            {maintainImg.length < 5 && <View className='ask-video-box img-con fl-column-center' onClick={this.chooseImage.bind(this)}>
              <View className='icon'>
                <View className='iconfont icontupian'></View>
              </View>
              <View className='text'>上传照片</View>
            </View>}
          </View>
          <View className='ask-tips fl-column-start'><Text className='ask-tips-item'>*图片越清晰，判断问题越准确</Text><Text className='ask-tips-item'>{`为了回答的精准度，您必须上传真实图片或视频（内容\n会通过审核）`}</Text></View>
        </View>
        <View className='ask-location fl-row-justy' onClick={this.setRouter.bind(this)}>
          <View className='left'>所在位置</View>
          <View className='right fl-row-right'>{this.state.cityData.name}<View className='iconfont icongengduo'></View></View>
        </View>
        <View className={`ask-btn ${formStatus&&'ok'} `} onClick={this.submitForm.bind(this)}>确定</View>
      </View>
    );
  }
}

export default Index;
