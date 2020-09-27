import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View } from "@tarojs/components";
import { Blank } from "@/components/blank";
import { API_RECORD } from "@/http/api/RECORD";
import { shareWx, showLoading } from "@/utils/index";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      page: 1
    };
  }
  componentDidMount() {
    this.getListData();
  }
  onShareAppMessage() {
    shareWx();
    return {
      title: "感谢列表",
      path: `pages/time/thanks/index`,
      imageUrl: ""
    };
  }
  onReachBottom() {
    if (this.state.page == 0) {
      return false;
    }
    this.getListData();
  }
  async getListData() {
    showLoading();
    let { data } = await API_RECORD({
      page: this.state.page
    });
    Taro.hideLoading();
    this.setState({
      listData: [...this.state.listData, ...data.items],
      page: data.next_page
    });
  }

  render() {
    const { listData } = this.state;
    return (
      <View className='index'>
        {listData.length == 0 ? (
          <Blank message='暂无记录哦～'></Blank>
        ) : (
          <View className='table-con'>
            <View className='table-hd table-row'>
              <View className='table-item'>微信昵称</View>
              <View className='table-item'>触发事件</View>
              <View className='table-item'>增加时间</View>
            </View>
            <View className='table-bd'>
              {listData.map((item, index) => (
                <View className='table-row' key={index.toString()}>
                  <View className='table-item'>{item.nickname}</View>
                  <View className='table-item'>{item.event}</View>
                  <View className='table-item'>{item.time}</View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default Index;
