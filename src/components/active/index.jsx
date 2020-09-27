import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Image } from "@tarojs/components";

import "./index.scss";
import activeImg from "./index.png";

class ActiveEl extends Component {
  constructor(props) {
    super(props);
  }

  goActivePage= ()=>{
    Taro.navigateTo({
      url: "/pages/activity/detail/index",
    });
  }
  render() {
    let { extClass = '' } = this.props;
    return (
      <View className={`G-active ${extClass}`} onClick={this.goActivePage}>
        <Image className='G-blank-img' src={activeImg}  />
      </View>
    );
  }
}

export { ActiveEl };
