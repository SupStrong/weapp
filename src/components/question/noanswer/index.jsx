import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Image } from "@tarojs/components";
import playBtnImg from "@/assets/images/common/play-btn.png";
import "./index.scss";

class NoAnswer extends Component {
  constructor(props) {
    super(props);
  }

  changeTab(value) {
    this.props.changeTab(value);
  }
  goDes(id) {
    let pageLength = Taro.getCurrentPages().length;
    if (pageLength >= 6) {
      //防止10层嵌套
      Taro.redirectTo({
        url: `/pages/question/details/index?id=${id}`
      });
      return;
    }

    Taro.navigateTo({
      url: `/pages/question/details/index?id=${id}`
    });
  }
  render() {
    let { title, id, question_info, eleClass = "" } = this.props;
    let rightEl = (
      <View className='item-right'>
        <Image
          mode='aspectFill'
          className='img-con'
          src={question_info.image || ""}
        ></Image>
      </View>
    );

    if (question_info.source_type && question_info.source_type == "1") {
      rightEl = (
        <View className='voice-con fl-column-center'>
          <View className='iconfont iconziyuan'></View>
          <View>{Math.ceil(question_info.source_time - 0)}″</View>
        </View>
      );
    }

    if (question_info.source_cover.length > 0) {
      rightEl = (
        <View className='item-right'>
          <View className='video-con'>
            <Image
              mode='aspectFill'
              className='cover-img'
              src={question_info.source_cover}
            ></Image>
            <Image className='play-btn' src={playBtnImg}></Image>
          </View>
        </View>
      );
    }

    return (
      <View
        className={`G-question-noanswer ${eleClass}`}
        onClick={this.goDes.bind(this, id)}
      >
        <View className='item-left'>
          <View className='item-title'>{title}</View>
          {rightEl}
        </View>
        <View className='item-tag-con'>
          <View className='city-item'>
            <View className='iconfont icondingwei'></View>
            <View className='city-item-text'>{question_info.city_name}</View>
          </View>
          {question_info.tags.map((item, index) => (
            <View className='tag-item G-limit-one' key={index}>
              {item}
            </View>
          ))}
        </View>
      </View>
    );
  }
}

export { NoAnswer };
