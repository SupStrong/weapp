import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserInfo from "@/actions/userInfo";
import { View, Text } from "@tarojs/components";
import { Blank } from "@/components/blank";
import { API_COLLECT_LIST } from "@/http/api/COLLECT";
import { showLoading, shareWx } from "@/utils/index";

import "./index.scss";

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
      listData: [],
      page: 1
    };
  }
  componentDidShow() {
    this.initData()
  }

  onShareAppMessage() {
    shareWx();
    return {
      title: "收藏",
      path: `pages/collect/index`,
      imageUrl: ""
    };
  }
  onReachBottom() {
    if (this.state.page == 0) {
      return false;
    }
    this.getListData();
  }
  onPullDownRefresh(){
    Taro.showNavigationBarLoading()
    this.initData()
    setTimeout(()=>{
      Taro.hideNavigationBarLoading()
      Taro.stopPullDownRefresh()
    },1000)
  }
  initData(){
    this.setState({
      page: 1,
      listData: []
    });
    this.getListData();
  }
  async getListData() {
    showLoading();
    let { data } = await API_COLLECT_LIST({
      page: this.state.page,
      unionid: this.props.userInfo.userInfo.unionid
    });
    Taro.hideLoading();
    this.setState({
      listData: [...this.state.listData, ...data.items],
      page: data.next_page
    });
  }

  godes(id) {
    Taro.navigateTo({
      url: `/pages/article/des/index?id=${id}`
    });
  }
  render() {
    const { listData } = this.state;
    return (
      <View className='index'>
        <View className='bd'>
          {listData.length == 0 ? (
            <Blank message='您还没有收藏哦~'></Blank>
          ) : (
            listData.map(item => (
              <View className='item-con' key={item.time}>
                <View className='item-time'>{item.time}</View>
                {item.collect.map(collectItem => (
                  <View
                    className='collect-item'
                    key={collectItem.id}
                    onClick={this.godes.bind(this, collectItem.id)}
                  >
                    <View className='collect-item-left'>
                      <View className='collect-title'>{collectItem.title}</View>
                      <View className='collect-price'>
                        基准：
                        {collectItem.price}/{collectItem.unit}
                      </View>
                    </View>
                    <Text className='iconfont icongengduo'></Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </View>
    );
  }
}

export default Index;
