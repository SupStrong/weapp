import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Image, Text } from "@tarojs/components";
import { NavBar } from "@/components/navbar";
import withComponent from "@/components/navbar/mixin";
import { getTime, shareWx, getLife,  stopInterval } from "@/utils/index";
import * as Time from "@/actions/time";

import "./index.scss";

const move = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/time/move.gif";

function mapStateToProps(state) {
  return {
    counter: state.time.toJS(),
    isIphone: state.isIphone.toJS()
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(Time, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
@withComponent
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styleData: {},
      isHome: false
    };
  }


  componentDidMount() {
    let page = Taro.getCurrentPages();
    this.setState({ isHome: page.length > 1 ? false : true });
  }
  componentDidShow() {
    let styleData = Taro.getMenuButtonBoundingClientRect();
    getLife()
    stopInterval()

    this.setState({ styleData: styleData });
  }

  componentDidHide() {}
  onShareAppMessage() {
    shareWx();
    return {
      title: "产品因使用而存在",
      path: `pages/time/index/index`,
      imageUrl: ""
    };
  }
  goBack() {
    Taro.navigateBack({
      delta: 2
    });
  }
  goThanks() {
    Taro.navigateTo({
      url: "/pages/time/thanks/index"
    });
  }
  goEaster() {
    Taro.navigateTo({
      url: "/pages/time/easter/index"
    });
  }
  render() {
    let timeData = getTime(this.props.counter.time);
    let isIphone = this.props.isIphone.isIphone;
    let { styleData } = this.state;
    return (
      <View className={`index ${isIphone ? "G-iphone" : ""}`}>
        <NavBar
          title='产品因使用而存在'
          background='rgba(255,255,255,0)'
          color='#FFFFFF'
          iconTheme='white'
          back={!this.state.isHome}
          home={this.state.isHome}
          onBack={this.handlerGobackClick}
          onHome={this.handlerGohomeClick}
        />
        <View className='page-index'>
          <View className='hd'>
            <View
              className='back-btn'
              style={`top:${styleData.height}px;height:${styleData.height}px`}
              onClick={this.goBack}
            >
              <View className='iconfont icongengduo'></View>
            </View>
            <Image className='move-img' src={move}></Image>
            <View className='easter-con' onClick={this.goEaster}></View>
            <View className='time-con'>
              <View className='time-item'>
                <Text className='time-text'>{timeData.hour}</Text>
                <Text className='time-unit'>小时</Text>
              </View>
              <View className='time-item'>
                <Text className='time-text'>{timeData.minute}</Text>
                <Text className='time-unit'>分钟</Text>
              </View>
              <View className='time-item'>
                <Text className='time-text'>{timeData.s}</Text>
                <Text className='time-unit'>秒</Text>
              </View>
            </View>
            <View className='hd-descript'>系统将自动清除所有代码</View>
          </View>
          <View className='bd'>
            <View className='bd-item'>
              <View className='bd-item-title'>时间增加规则</View>
              <View className='bd-item-text'>用户搜索，时间增加1分钟；</View>
              <View className='bd-item-text'>用户收藏，时间增加10分钟；</View>
              <View className='bd-item-text'>用户提问，时间增加30分钟；</View>
              <View className='bd-item-text'>用户回答，时间增加60分钟；</View>
              <View className='bd-item-text'>用户分享，时间增加60分钟</View>
            </View>
            <View className='bd-item'>
              <View className='bd-item-title'>为什么存在倒计时</View>
              <View className='bd-item-text'>
                产品因使用而存在，如产品不能解决用户需求，与其让老板砍掉，
                不如将权利交给用户。感谢您的使用和分享，为这款产品注入新
                的生命时长。
              </View>
            </View>
          </View>
          <View className='ft'>
            <View className='ft-btn' onClick={this.goThanks}>
              感谢列表
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
