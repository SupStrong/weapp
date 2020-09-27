import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Image } from "@tarojs/components";
import { Blank } from "@/components/blank";
import { API_RECORD } from "@/http/api/RECORD";
import { showLoading, shareWx} from "@/utils/index";
import "./index.scss";
import indexPng from "./index.png";

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS()
  };
}

@connect(mapStateToProps)
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: "",
      page: 1,
      listData: []
    };
  }
  componentDidMount() {
    this.getListData();
  }
  onShareAppMessage() {
    shareWx()
    return {
      title: "贡献记录",
      path: `pages/index/index`,
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
      unionid: this.props.userInfo.userInfo.unionid,
      page: this.state.page
    });
    Taro.hideLoading();
    this.setState({
      total: data.total_minite,
      listData: [...this.state.listData, ...data.items],
      page: data.next_page
    });
  }

  render() {
    const { listData, total } = this.state;
    return (
      <View className='index'>
        <View className='hd'>
          <Image src={indexPng} className='hd-img' />
          <View className='he-text'>
            感谢您提供的<Text className='total-time'>{total}</Text>
            分钟的生命时间
          </View>
        </View>
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
