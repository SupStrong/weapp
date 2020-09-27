import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Input, Text } from "@tarojs/components";
import { TimeEl } from "@/components/time";
import {
  showPopup,
  shareWx,
  startInterval,
  stopInterval,
  getLife
} from "@/utils/index";

import "./index.scss";
import hotData from "./index.json";

let topData = Object.keys(hotData);

function mapStateToProps(state) {
  return {
    counter: state.time.toJS(),
    isIphone: state.isIphone.toJS()
  };
}

@connect(mapStateToProps)
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: "",
      historyData: Taro.getStorageSync("searchHistory") || [],
      tabType: "拆除"
    };
  }
  componentDidMount() {
  }
  componentWillUnmount() {}

  componentDidShow() {
    stopInterval()
    getLife();
  }
  componentDidHide() {
    // stopInterval()
  }
  onShareAppMessage() {
    shareWx();
    return {
      title: "搜索",
      path: `pages/article/search/index`,
      imageUrl: ""
    };
  }
  handleChange(event) {
    this.setState({ keywords: event.target.value });
  }
  onFocus() {
    stopInterval();
  }
  onBlur() {
    startInterval();
  }
  startSearch(keywords) {
    if (!keywords) {
      showPopup("请输入关键字");
      return false;
    }
    //存入storege
    let data = [...new Set([keywords, ...this.state.historyData])];
    Taro.setStorageSync("searchHistory", data);
    this.setState({ historyData: data });
    this.goSearchPage(this.state.keywords);
  }
  clearKeywords() {
    this.setState({ keywords: "" });
  }
  goSearchPage(name) {
    Taro.navigateTo({
      url: `/pages/article/list/index?name=${name}`
    });
  }
  changeTab(tabType) {
    this.setState({ tabType });
  }
  render() {
    const { historyData, keywords, tabType } = this.state;
    let isIphone = this.props.isIphone.isIphone;
    let timeData = this.props.counter.time;
    return (
      <View className={`index ${isIphone ? "G-iphone" : ""}`}>
        <View className='page-index'>
          <View className='hd'>
            <View className='input-con'>
              <Input
                type='text'
                placeholder='搜索施工项目'
                value={keywords}
                onInput={e => {
                  this.handleChange(e);
                }}
                onFocus={this.onFocus.bind(this)}
                onBlur={this.onBlur.bind(this)}
                onConfirm={this.startSearch.bind(this, keywords)}
                className='input-el'
              />
              {keywords.length > 0 ? (
                <View
                  className='icon-btn'
                  onClick={this.clearKeywords.bind(this)}
                >
                  <View className='icon-con'>
                    <View className='iconfont iconguanbi'></View>
                  </View>
                </View>
              ) : (
                ""
              )}
            </View>
            <View
              className='search-btn'
              onClick={this.startSearch.bind(this, keywords)}
            >
              搜索
            </View>
          </View>
          <View className='search-con '>
            <View className='tab-con'>
              {topData.map((item, index) => (
                <View
                  className={`teb-item ${item == tabType && "active"}`}
                  key={index}
                  onClick={this.changeTab.bind(this, item)}
                >
                  {item}
                </View>
              ))}
            </View>
            <View className='search-items'>
              {hotData[tabType].map((item, index) => (
                <View
                  className='search-item'
                  key={index}
                  onClick={this.goSearchPage.bind(this, item)}
                >
                  <Text className='search-item-num'>{index + 1}.</Text>
                  <Text className='search-item-text'>{item}</Text>
                </View>
              ))}
            </View>
          </View>
          {this.state.historyData.length > 0 ? (
            <View className='search-con flex2'>
              <View className='search-title'>历史搜索</View>
              <View className='search-items'>
                {historyData.map(item => (
                  <View
                    className='search-item'
                    key={item}
                    onClick={this.goSearchPage.bind(this, item)}
                  >
                    <Text className='search-item-text G-limit-one'>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            ""
          )}
        </View>
        <TimeEl timeData={timeData} extClass='small' />
      </View>
    );
  }
}

export default Index;
