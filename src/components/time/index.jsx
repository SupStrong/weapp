import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View } from "@tarojs/components";
import { getTime } from "@/utils/index";

import "./index.scss";


class TimeEl extends Component {
  constructor(props) {
    super(props);
  }
  linkToTime() {
    Taro.navigateTo({
      url: "/pages/time/index/index"
    });
  }

  render() {
    let { timeData, extClass='' } = this.props;
    let useTime = getTime(timeData)
    return (
      <View className={`G-time-ft ${extClass}`}>
        <View className='title'>
          <View className='title-text'>产品生命倒计时</View>
          <View className='title-icon iconfont iconguize'></View>
          <View className='time-btn' onClick={this.linkToTime}>
          </View>
        </View>
        <View className='time-content'>
          <View className='time-item'>{useTime.hour}</View>
          <View className='time-split'>:</View>
          <View className='time-item'>{useTime.minute}</View>
          <View className='time-split'>:</View>
          <View className='time-item'>{useTime.s}</View>
        </View>
      </View>
    );
  }
}

export { TimeEl };
