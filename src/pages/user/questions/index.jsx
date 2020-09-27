import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Time from "@/actions/time";
import { View } from "@tarojs/components";
import * as UserInfo from "@/actions/userInfo";
import { Blank } from "@/components/blank";
import { API_USER_QUESTION } from "@/http/api/USER";
import { showPopup, showLoading } from "@/utils/index";
import "./index.scss";

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS(),
    isIphone: state.isIphone.toJS(),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(UserInfo, dispatch),
    ...bindActionCreators(Time, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
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
    this.setState({
      listData: [],
      page: 1,
    });
    this.getListData();
  }

  onPullDownRefresh() {
    Taro.stopPullDownRefresh();
    this.setState({
      listData: [],
      page: 1,
    });
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
      const { data } = await API_USER_QUESTION({
        id: this.props.userInfo.userInfo.unionid || "",
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

  goNextPage(path, param, status) {
    if (status == 0) {
      showPopup("该问题已经删除");
      return false;
    }

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
          listData.map((item) => (
            <View
              className='list'
              onClick={this.goNextPage.bind(
                this,
                "/pages/question/details/index",
                [`id=${item.id}`],
                item.status
              )}
              key={item.id}
            >
              <View className='que G-bold G-Fsize-16'>{item.title}</View>
              {item.status == 0 ? (
                <View className='del'>内容涉及敏感信息和敏感人物,已删除</View>
              ) : (
                <View className='total G-Fsize-12'>
                  {item.video_total}条视频回复
                </View>
              )}
            </View>
          ))
        ) : (
          <Blank message='您还没有提问哦~'></Blank>
        )}
      </View>
    );
  }
}

export default List;
