import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Image } from "@tarojs/components";
import { API_ATTENTION } from "@/http/api/ATTENTION";
import { API_USER_ATTENTION_LIST } from "@/http/api/USER";
import BlueV from "@/assets/images/common/blue_v.png";
import { Blank } from "@/components/blank";
import { showPopup, showLoading } from "@/utils/index";
import "./index.scss";

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS(),
  };
}

@connect(mapStateToProps)
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      page: 1,
    };
  }
  componentDidMount() {}

  componentDidShow() {
    this.setState({ page: 1, listData: [] });
    this.getListData();
  }

  onPullDownRefresh() {
    Taro.stopPullDownRefresh();
    this.setState({ page: 1, listData: [] });
    this.getListData();
  }
  onReachBottom() {
    if (this.state.page == 0) {
      return false;
    }
    this.getListData();
  }
  async getListData() {
    try {
      showLoading();
      const { data } = await API_USER_ATTENTION_LIST({
        unionid: this.props.userInfo.userInfo.unionid || "",
        page: this.state.page,
      });
      Taro.hideLoading();
      this.setState({
        listData: [...this.state.listData, ...data.items],
        page: data.next_page,
      });
    } catch (error) {
      showPopup("载入远程数据错误");
    }
  }
  async updateCollect(wx_user_id, is) {
    // 关注
    let { status, message } = await API_ATTENTION({
      type: "person",
      id: wx_user_id,
      operate: is ? "0" : "1",
      unionid: this.props.userInfo.userInfo.unionid,
    });
    showPopup(message);
    if (status) {
      let arrData = [...this.state.listData];
      for (let i = 0; i < arrData.length; i++) {
        if (arrData[i].wx_user_id == wx_user_id) {
          arrData[i].is_attention = !arrData[i].is_attention;
        }
      }
      this.setState({
        listData: arrData,
      });
    }
  }
  goNextPage(path, param) {
    let pStr = "";
    if (param.length > 0) {
      pStr = "?" + param.join("&");
    }
    Taro.navigateTo({
      url: path + pStr,
    });
  }
  render() {
    const { listData } = this.state;
    return (
      <View className='content'>
        {listData.length > 0 ? (
          <View className='list'>
            {listData.map((item) => (
              <View className='item fl-row-leftNowrap' key={item.id}>
                <View className='avatar G-bold G-Fsize-16'>
                  <Image className='img' src={item.avatar} />
                </View>
                <View className='info G-Fsize-12'>
                  <View className='tit fl-row-leftNowrap'>
                    <Text className='name G-Fsize-16  G-bold G-color-222'>
                      {item.name}
                    </Text>
                    {item.is_verified ? <Image className='vip' src={BlueV} />:''}
                  </View>
                  {item.is_verified ? (
                    <View className='place fl-row-leftNowrap'>
                      <Text className='iconfont icondizhi G-Fsize-16'></Text>
                      <Text className='G-Fsize-14 G-color-222'>
                        {item.city_name}
                      </Text>
                    </View>
                  ):''}
                </View>
                <View
                  className='cover-click'
                  onClick={this.goNextPage.bind(
                    this,
                    "/pages/master/detail/index",
                    [`unionid=${item.unionid}`]
                  )}
                ></View>
                <View
                  className='btn'
                  onClick={this.updateCollect.bind(
                    this,
                    item.wx_user_id,
                    item.is_attention
                  )}
                >
                  {item.is_attention ? (
                    <View className='cancel G-Fsize-14 G-bold'>已关注</View>
                  ) : (
                    <View className='add fl-row-center'>
                      <Text className='sign G-Fsize-8 G-bold iconfont iconxinjian'></Text>
                      <Text className='word G-Fsize-14 G-bold'>关注</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Blank message='您还没有关注哦~'></Blank>
        )}
      </View>
    );
  }
}

export default List;
