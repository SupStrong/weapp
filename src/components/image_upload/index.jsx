import React, { Component } from "react";
import { View} from "@tarojs/components";
import "./index.scss";

class TabBar extends Component {
  constructor(props) {
    super(props);

  }

  changeTab(value){
    this.props.changeTab(value)
  }


  render() {
    let {} = this.props;
    return (
      <View className='G-tab-con'>
       
      </View>
    );
  }
}

export { TabBar };
