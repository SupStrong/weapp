import React, { Component } from "react";
import { View } from "@tarojs/components";
import "./index.scss";

class TabBar extends Component {
  constructor(props) {
    super(props);

  }

  changeTab(value){
    this.props.changeTab(value)
  }


  render() {
    let { data, selectVal } = this.props;
    return (
      <View className='G-tab-con' >
        {data.map(item => (
          <View className={`tab-item ${(item.value == selectVal)&&'active'}`} key={item.value} onClick={this.changeTab.bind(this,item.value)}>
            <View className='tab-item-text'>
              {item.name}
            </View>
            <View className='bottom-line'></View>
          </View>
        ))}
      </View>
    );
  }
}

export { TabBar };
