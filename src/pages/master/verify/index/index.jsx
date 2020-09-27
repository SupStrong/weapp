import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Image, Text, Input } from "@tarojs/components";
import { API_USER_CREAT } from "@/http/api/USER";
import * as UserInfo from "@/actions/userInfo";
import { showPopup, showLoading, uploadImg, getActiveInfo, setRefrs } from "@/utils/index";
import envConfig from "../../../../http/env";

import "./index.scss";
import hdImg from "./hd.png";
import avatarImg from "./avatar.png";

let questionId = '';
function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS(),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(UserInfo, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitData:{
        avatar: "",
        user_name: "",
        phone: "",
        wechat_id: "",
        introduction: "",
        city_id: "",
        city_name: "",
      },
      activeInfo:{}
    };
  }

  componentDidMount() {
    Taro.removeStorageSync("masterCityData");
    if(Taro.getCurrentInstance().router.params.question_id){
      questionId = Taro.getCurrentInstance().router.params.question_id
    }
  }
  componentWillUnmount() {}
  async componentDidShow() {
    let { id = "", name = "" } = Taro.getStorageSync("masterCityData");
    let {submitData} = this.state
    submitData = Object.assign(submitData,{ city_id: id, city_name: name })
    this.setState({submitData});
    let activeInfo =  await getActiveInfo();
    this.setState({activeInfo})
  }

  componentDidHide() {}

  getformItem(that, configData) {
    let { title, placeholder, key, value, type } = configData;
    return (
      <View className='form-item'>
        <Text className='item-title'>{title}</Text>
        <View className='item-el'>
          <Input
            className='input-el'
            placeholder={placeholder}
            value={value}
            placeholderClass='placeholder-text'
            onInput={(e) => {
              that.handleChange(e, key);
            }}
            type={type}
          />
        </View>
      </View>
    );
  }
  handleChange(event, key) {
    let {submitData} = this.state
    submitData[key] = event.target.value
    this.setState({submitData});
  }
  async uploadAvatar() {
    let data = await uploadImg({ num: 1 });
    // let avatar = data[0];
    this.handleChange({target:{value:data[0]}},'avatar')
    // this.setState({ avatar });
  }
  async submitForm() {
    if (this.isSubmit) {
      return false;
    }
    this.isSubmit = true;
    showLoading();
    let submitData = Object.assign(this.state.submitData, {
      unionid: this.props.userInfo.userInfo.unionid,
    });
    let { status, message } = await API_USER_CREAT({ data: submitData });
    this.isSubmit = false;
    showPopup(message, status);
    Taro.hideLoading();
    if (status) {
      setTimeout(() => {
        Taro.navigateTo({
          url: `/pages/master/verify/result/index?question_id=${questionId}`,
        });
      }, 2000);
    }
  }
  goChangeCity() {
    Taro.navigateTo({
      url: `/pages/city/index?cityId=${this.state.city_id}&from=master`,
    });
  }
  getSubmitStatus() {
    let arr = Object.values(this.state.submitData);
    return arr.every((currentValue) => currentValue.toString().length > 0);
  }
  render() {
    let {
      avatar,
      user_name,
      phone,
      wechat_id,
      introduction,
      city_name,
    } = this.state.submitData;
    let {activeInfo} = this.state
    let canSubmit = this.getSubmitStatus();
    return (
      <View className='index'>
        <View className='hd'>
          <Image src={hdImg} className='hd-img'></Image>
          <Text className='hd-title'>增加个人信息 | 视频靠前展示</Text>
          <View className='hd-sub-title'>
            增加个人信息，可以让看到视频的用户方便联系到您！信息审核通过后，您可以获得蓝色V，视频展示更加靠前。
            {activeInfo.status&&(<Text className='hd-sub-title active-text'>
              活动奖品会通过手机与您联系
            </Text>)} 
          </View>
        </View>

        <View className='bd'>
          <View className='form-item'>
            <Text className='item-title'>头像</Text>
            <View
              className='item-el avatar'
              onClick={this.uploadAvatar.bind(this)}
            >
              <View className='flex'>
                {!avatar && <Text className='placeholder-text'>点击上传</Text>}
                <View className='avatar-con'>
                  <Image
                    mode='aspectFit'
                    className={`avatar-img ${!avatar && "no"}`}
                    src={avatar ? envConfig.imgUrl + avatar : avatarImg}
                  ></Image>
                </View>
              </View>
              <View className='iconfont icongengduo'></View>
            </View>
          </View>
          {this.getformItem(this, {
            title: "姓名",
            placeholder: "请输入姓名",
            key: "user_name",
            value: user_name,
            type: "text",
          })}
          {this.getformItem(this, {
            title: "联系电话",
            placeholder: "请输入联系电话",
            key: "phone",
            value: phone,
            type: "number",
          })}
          {this.getformItem(this, {
            title: "微信号",
            placeholder: "请输入微信号",
            key: "wechat_id",
            value: wechat_id,
            type: "number",
          })}
          {this.getformItem(this, {
            title: "个人说明",
            placeholder: "请输入个人说明",
            key: "introduction",
            value: introduction,
            type: "text",
          })}
          <View className='form-item'>
            <Text className='item-title'>所在城市</Text>
            <View className='item-el ' onClick={this.goChangeCity.bind(this)}>
              <View className='flex'>
                {city_name ? (
                  <Text className='input-text'>{city_name}</Text>
                ) : (
                  <Text className='placeholder-text'>请选择城市</Text>
                )}

                <View className='iconfont icongengduo'></View>
              </View>
            </View>
          </View>
        </View>

        <View className='ft'>
          <View
            className={`submit-btn btn ${canSubmit && "ok"}`}
            onClick={canSubmit && this.submitForm.bind(this)}
          >
            提交
          </View>
          <View
            className='no-add btn'
            onClick={() => {
              if(questionId.length==''){
                Taro.switchTab({
                  url: "/pages/mine/index",
                });
                return false;
              }
              setRefrs(["pages/qalist/index", "pages/question/details/index"]);
              Taro.reLaunch({
                url: `/pages/question/details/index?id=${questionId}`,
              });

            }}
          >
            不增加联系方式
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
