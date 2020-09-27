import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image } from "@tarojs/components";
import { API_STENCIL_DES } from "@/http/api/STENCIL";
import { showPopup, goLogin, shareWx } from "@/utils/index";

import "./index.scss";


function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS(),
    isIphone: state.isIphone.toJS()
  };
}

@connect(mapStateToProps)
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: "",
      desData: {
        title: "",
        img: "",
        top_img: "https://api.chuwei100.net//images/renovation/jcbj_top.png"
      }
    };
    this.id=''
  }
  componentDidMount() {
    this.id = getCurrentInstance().router.params.id;
    this.getData(this.id);
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  onShareAppMessage() {
    shareWx()
    return {
      title: this.state.desData.title,
      path: `pages/stencil/des/index?id=${this.state.desData.id}`,
      imageUrl: ""
    };
  }
  async getData(id) {
    let { data } = await API_STENCIL_DES({ id });
    Taro.setNavigationBarTitle({
      title: data.title
    });
    this.setState({ desData: data });
  }
  changeHeight(e) {
    let { height } = e.detail;
    this.setState({ height: height / 4 });
  }
  async saveImg(imgUrl) {
    if (this.props.userInfo.userInfo.unionid.length == 0) {
      goLogin()
      return;
    }
    let { path } = await this.getImageInfo(imgUrl);
    // 获取权限
    let { authSetting } = await this.getAuthSetting();

    if (!authSetting["scope.writePhotosAlbum"]) {
      let authorizeRes = await this.authorize();
      if (authorizeRes == 2) {
        //拒绝授权
        Taro.showModal({
          title: "权限设置",
          content: "为方便保存图片，请开启保存到相册权限",
          confirmColor: "#47B238",
          success(res) {
            if (res.confirm) {
              Taro.openSetting();
            } else if (res.cancel) {
            }
          }
        });
      }
    }
    this.saveToPhotosAlbum(path);
  }
  saveToPhotosAlbum(path) {
    Taro.saveImageToPhotosAlbum({
      filePath: path,
      success: function(res) {
        if (res.errMsg == "saveImageToPhotosAlbum:ok") {
          showPopup("保存成功，请去相册查看");
        }
      }
    });
  }
  getImageInfo(imgUrl) {
    return new Promise(resolve => {
      Taro.getImageInfo({
        src: imgUrl,
        success: function(res) {
          resolve(res);
        },
        fail() {
        }
      });
    });
  }
  getAuthSetting() {
    return new Promise(resolve => {
      Taro.getSetting({
        success(res) {
          resolve(res);
        }
      });
    });
  }
  authorize() {
    return new Promise(resolve => {
      Taro.authorize({
        scope: "scope.writePhotosAlbum",
        success: function() {
          resolve(1);
        },
        fail: function() {
          resolve(2);
        },
        complete: function() {}
      });
    });
  }
  showImg(url){
    Taro.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  }
  render() {
    const { desData, height } = this.state;
    const { unionid:userInfo } = this.props.userInfo.userInfo;
    let isIphone = this.props.isIphone.isIphone;
    return (
      <View className={`index ${isIphone ? "G-iphone" : ""}`}>
        <View className='bd'>
          <Image
            className='des-img'
            src={desData.img}
            style={`height:${height}px`}
            onLoad={this.changeHeight.bind(this)}
            onClick={this.showImg.bind(this,desData.img)}
          />
        </View>
        <View className='ft'>
          <View
            className='save-btn'
            onClick={this.saveImg.bind(this, desData.img)}
          >
            {userInfo.length > 0 ? "下载到手机相册" : "登录后下载到手机相册"}
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
