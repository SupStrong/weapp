import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { Provider } from "react-redux";
import * as isIphone from "@/actions/isIphone";
import {checkUpdateVersion, setRefrs } from "@/utils/index";

import '@/utils/sdk/ald-stat'  //阿拉丁统计
import configStore from "./store";
import "./app.scss";


const store = configStore();

class _App extends Component {
  componentWillMount() {
  }
  componentDidMount() {
 
    Taro.$store = store;
    // this.init();
    let { model } = Taro.getSystemInfoSync();
    const modelArr = ["iPhone X", 'iPhone XR', "iPhone XS", "iPhone XS MAX","iPhone 11","iPhone 11 Pro","iPhone 11 Pro Max","unknown<iPhone12,1>","unknown<iPhone12,3>","unknown<iPhone12,5>"];
    for (const iterator of modelArr) {
      if (model.includes(iterator)) {
        store.dispatch(isIphone.init(true));
      }
    }
  }
  componentDidShow(res) {
    if(res.scene == 1007){
        
      setRefrs(["pages/qalist/index"])
    }

    checkUpdateVersion()
  }

  componentDidHide() {
  }
  componentDidCatchError() {}
  // 在 _App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default _App;
