import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, Image } from "@tarojs/components";
import { API_LIFE_OPREATE } from "@/http/api/LIFE";
import * as UserInfo from "@/actions/userInfo";
import { showPopup } from "@/utils/index";
import "./index.scss";

const easterImg = 'https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/time/easterImg.png'

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS(),
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
    };
  }
  componentDidMount() {
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  async getListData(opreate_type) {
    if(this.props.userInfo.userInfo.unionid.length == 0){
      Taro.navigateTo({
        url: `/pages/auth/index`
      });
      return;
    }
    if(this.locking == true){
      return
    }
    let { data,status,message } = await API_LIFE_OPREATE({type:4,opreate_type:opreate_type,unionid:this.props.userInfo.userInfo.unionid});
    this.locking == false
    if(!status){
      showPopup(message)
      return false
    }
    showPopup(data.time_text)
      Taro.navigateTo({
        url: `/pages/time/easter-result/index?opreate_type=${opreate_type}&time=${data.time_num}`
      });
  }
  render() {
    return (
      <View className='index'>
        <View className='hd'>
          <Image src={easterImg} className='hd-img' webp='true' />
          <View className='hd-text'>
          没想到让你发现了 这个页面是设计者的隐藏页面
          </View>
        </View>
        <View className='bd'>
            <Text className='bd-title'>您现在可以进行两个操作</Text>
            <Text className='bd-subtitle'>每个微信账号只能操作一次</Text>
            <View className='btn-con'>
              <View className='btn cut' onClick={this.getListData.bind(this,'desc')}>减少产品生命50%</View>
              <View className='btn add' onClick={this.getListData.bind(this,'incr')}>增加产品生命50%</View>
            </View>
        </View>
      </View>
    );
  }
}

export default Index;
