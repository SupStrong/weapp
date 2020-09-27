import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Image, Text, Button } from "@tarojs/components";
import { API_AUTH_LOGIN } from "@/http/api/AUTH";
import { wxLogin } from "@/http/config";
import * as UserInfo from "@/actions/userInfo";

import { showPopup } from "@/utils/index";

import "./index.scss";

import logo from './logo.png'

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS()
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(UserInfo, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: ""
    };
  }

  componentDidMount() {
    this.getCode();
  }
  componentWillUnmount() {}

  componentDidShow() {}

  async getCode() {
    const code = await wxLogin();
    this.setState({ code: code });
  }
  componentDidHide() {}
  async getInfo(e) {
    let postData = {
      openid: "oYYmR4kn4Qi6Ggqvum8Mb5MWts6E",
      code: this.state.code,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    };
    let { data, status, message } = await API_AUTH_LOGIN(postData);
    showPopup(message);
    if (!status) {
      this.getCode();
      return;
    }
    this.props.initUser(data);
    setTimeout(()=>{
      Taro.navigateBack({
        delta: 1
      })
    },1500)
  }
  render() {
    return (
      <View className='index'>
        <Image className='login-img' src={logo} />
        <Text className='login-text'>装修防坑搜索</Text>
        <View className='btn-con'>
          <Button
            openType='getUserInfo'
            className='hidden-btn'
            onGetUserInfo={this.getInfo.bind(this)}
          ></Button>
          <View className='show-btn'>
            <Text className='iconfont iconweixin1'></Text>
            <Text className='show-btn-text'>微信一键登录</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
