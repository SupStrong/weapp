import React, { Component } from "react";
import { View, Image } from "@tarojs/components";

import "./index.scss";
import blankImg from "./blank.png";

class Blank extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { message } = this.props;
    return (
      <View className='G-blank'>
        <Image className='G-blank-img' src={blankImg}  />
        <View className='G-blank-message'>{message}</View>
      </View>
    );
  }
}

export { Blank };
