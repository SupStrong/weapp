import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text } from "@tarojs/components";
import { Blank } from "@/components/blank";
import { TabBar } from "@/components/tabbar";
import { Answer } from "@/components/question/answer";
import { NoAnswer } from "@/components/question/noanswer";
import { ActiveEl } from "@/components/active";
import { API_QUESTION_LIST } from "@/http/api/QUESTION";
import * as UserInfo from "@/actions/userInfo";
import {
  showPopup,
  goLogin,
  checkRefrs,
  getActiveInfo,
  shareWx,
} from "@/utils/index";

import "./index.scss";

let tabData = [
  { name: "已解答", value: 1 },
  { name: "待解答", value: 2 },
];

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
      type: 1,
      listData: [],
      cityData: {
        id: "",
        name: "全部",
      },
      onceRequest: true,
      activeInfo: {
        status: "",
      },
    };
  }

  componentDidMount() {
    //一般情况下回来要刷新
    let cityData = Taro.getStorageSync("cityData") || { name: "全部", id: 0 };
    this.setState({ cityData }, () => {
      if (checkRefrs("pages/qalist/index")) {
        this.initData();
      }
    });
  }
  componentWillUnmount() {}

  async componentDidShow() {
    //一般情况下回来要刷新
    let cityData = Taro.getStorageSync("cityData") || { name: "全部", id: 0 };
    this.setState({ cityData }, () => {
      if (checkRefrs("pages/qalist/index")) {
        this.initData();
      }
    });
    let activeInfo = await getActiveInfo();
    this.setState({ activeInfo });
  }
  componentDidHide() {}
  onPullDownRefresh() {
    Taro.stopPullDownRefresh();
    this.initData();
  }
  onShareAppMessage() {
    shareWx();
    return {
      title: "装修工艺搜索",
      path: `pages/qalist/index`,
      imageUrl: "",
    };
  }
  onReachBottom() {
    if (this.page == 0) {
      return false;
    }
    this.getListData();
  }
  initData() {
    if (this.state.onceRequest) {
      this.page = 0;
      this.setState({ listData: [] }, () => {
        this.getListData();
      });
      this.setState({
        onceRequest: false,
      });
    }
  }
  async getListData() {
    try {
      // showLoading();
      const { data } = await API_QUESTION_LIST({
        page: this.page,
        type: this.state.type,
        city_id: this.state.cityData.id,
      });
      // Taro.hideLoading();
      this.page = data.next_page;
      this.setState({
        listData: [...this.state.listData, ...data.items],
        onceRequest: true,
      });
    } catch (error) {
      showPopup("载入远程数据错误");
    }
  }
  changeTab(value) {
    this.setState({ type: value }, () => {
      this.initData();
    });
  }
  getStyle() {
    let bottonStyle = Taro.getMenuButtonBoundingClientRect();
    let getSystenInfo = Taro.getSystemInfoSync();
    let heightDiff = bottonStyle.top - getSystenInfo.statusBarHeight;
    let paddingCenter = getSystenInfo.screenWidth - bottonStyle.right;
    let narbarStyle = `padding:${
      Taro.pxTransform(getSystenInfo.statusBarHeight *2)
    } ${Taro.pxTransform(paddingCenter *2)} 0 15px;height:${
      Taro.pxTransform((bottonStyle.bottom + heightDiff + 2) *2) 
    };`;
    let listPaddingTop = `padding-top:${
      Taro.pxTransform((bottonStyle.bottom + heightDiff + 2 + 56 + 45)*2)
    }`; //56,45为搜索框和tabbar的高度
    return { narbarStyle, listPaddingTop };
  }
  goChangeCity = () => {
    Taro.navigateTo({
      url: `/pages/city/index?cityId=${this.state.cityData.id}&from=qa`,
    });
  };
  goAskQuestion = () => {
    if (this.props.userInfo.userInfo.unionid.length == 0) {
      goLogin();
      return;
    }
    Taro.navigateTo({
      url: `/pages/question/ask/index`,
    });
  };
  goSearch = () => {
    Taro.navigateTo({
      url: `/pages/question/search/index`,
    });
  };
  render() {
    let { type, cityData, listData, activeInfo } = this.state;
    let { narbarStyle, listPaddingTop } = this.getStyle();
    let bdEL = <Blank message='暂无~'></Blank>;
    if (listData.length > 0) {
      bdEL = (
        <View className='bd'>
          {listData.map((item, index) => {
            if (item.type == 1) {
              return (
                <>
                  <Answer
                    key={item.id}
                    title={item.title}
                    id={item.id}
                    answer_info={item.answer_info}
                    hasUserInfo={false}
                    to='question'
                  />
                  {!index && activeInfo.status !=0 && (
                    <ActiveEl extClass='qa-list' />
                  )}
                </>
              );
            } else {
              return (
                <>
                  <NoAnswer
                    key={item.id}
                    title={item.title}
                    id={item.id}
                    question_info={item.question_info}
                    showActive={!index}
                  />
                  {!index && activeInfo.status != 0 && (
                    <ActiveEl extClass='qa-list' />
                  )}
                </>
              );
            }
          })}
        </View>
      );
    }

    return (
      <View className='index'>
        <View className='hd'>
          <View className='narbar' style={narbarStyle}>
            <View className='city-con narbar-item' onClick={this.goChangeCity}>
              <Text className='city-con-name'>{cityData.name}</Text>
              <Text className='iconfont iconxiala'></Text>
            </View>
            <View className='center-text narbar-item'>问答</View>
            <View className='center-text narbar-item'></View>
          </View>
          <View className='search-con' onClick={this.goSearch}>
            <View className='search-con-input' >
              <View className='iconfont iconsousuo'></View>
              <Text className='search-con-text'>最新最火的装修问答平台</Text>
            </View>
          </View>

          <TabBar
            data={tabData}
            selectVal={type}
            changeTab={this.changeTab.bind(this)}
          />
        </View>
        <View style={listPaddingTop}></View>
        {bdEL}
        <View className='ask-btn fl-column-center' onClick={this.goAskQuestion}>
          <View className='iconfont icontiwen'></View>
        </View>
      </View>
    );
  }
}

export default Index;
