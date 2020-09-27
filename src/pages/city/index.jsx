import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import { API_CITY } from "@/http/api/COMMON";
import { showPopup, showLoading,setRefrs } from "@/utils/index";

import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [{ items: [] }],
      cityId: "",
      from: "",
    };
  }

  componentDidMount() {
    let routerData = getCurrentInstance().router.params;
    let { cityId, from = ""} = routerData;
    this.setState({ cityId, from });
    this.getListData();
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  async getListData() {
    try {
      showLoading();
      const { data } = await API_CITY();
      Taro.hideLoading();
      if(this.state.from == 'qa'){
        data[0].items.unshift({name:'全部',id:0})
      }
      this.setState({
        listData: data,
      });
    } catch (error) {
      showPopup("载入远程数据错误");
    }
  }
  scrollsSource(source) {
    Taro.pageScrollTo({
      selector: `#${source}`,
      duration: 300,
    });
  }
  changeCity(cityData) {
    let {from} = this.state
    this.setState({ cityId: cityData.id });
    if (from == "qa") {
      Taro.setStorageSync("cityData", cityData);
      setRefrs(["pages/qalist/index"])
      Taro.navigateBack({
        delta: 1, // 返回上一级页面。
      });
      return;
    }
    if(from == 'master'){
      Taro.setStorageSync("masterCityData", cityData);
      Taro.navigateBack({
        delta: 1, // 返回上一级页面。
      });
      return;
    }

    var pages = Taro.getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    if (!!~prevPage.route.indexOf("question/ask")) {
      Taro.setStorageSync("questionCity", cityData);
      Taro.navigateBack({
        delta: 1, // 返回上一级页面。
      });
    }
  }

  render() {
    let { listData, cityId, from } = this.state;
    return (
      <View className='index'>
        {from !== 'qa' && (
          <View className='tip-con'>
            <View className='tip-text'>为什么要选择城市</View>
            <Text className='tip-subtext'>{`装修的规则和要求均有不同，定位城市可以让\n您提出的问题，回答的更加准确`}</Text>
          </View>
        )}
        <View className='test'>test</View>
        <View className='city-con'>
          {listData.length > 0 &&
            listData.map((item) => (
              <View key={item.source_index} id={item.source_index}>
                <View className='source-text'>{item.source_index}</View>
                {item.items.map((cityItems) => (
                  <View
                    className='city-item'
                    key={cityItems.id}
                    onClick={this.changeCity.bind(this, cityItems)}
                  >
                    <View className='city-name'>{cityItems.name}</View>
                    {cityItems.id == cityId && (
                      <View className='iconfont icondizhi'></View>
                    )}
                  </View>
                ))}
              </View>
            ))}
        </View>
        <View className='index-con'>
          {listData.length > 0 &&
            listData.map((item) => (
              <View
                className='city-item'
                key={item.source_index}
                onClick={this.scrollsSource.bind(this, item.source_index)}
              >
                {item.source_index}
              </View>
            ))}
        </View>
      </View>
    );
  }
}

export default Index;
