import React, { Component } from "react";
import { View } from "@tarojs/components";
import "./index.scss";

class MiniPrice extends Component {
  constructor(props) {
    super(props);
  }
  getMax(data){
    let arr = []
    for (const iterator of data) {
      arr.push(iterator.value)
    }
    return  Math.max(...arr)
  }
  render() {
    let { desData } = this.props;
    let max = this.getMax(desData)
    return (
      <View className='G-price-small'>
        <View className='bg-con'>
          {[1, 2, 3, 4].map((number) => 
            <View className='bg-item' key={number.toString()}></View>
          )}
        </View>
        <View className='price-des'>
        {desData.map(item => (
          <View className='price-item' key={item.name} style={`height:${(item.value)*100/max}%`}></View>
        ))}
        </View>
    
      </View>
    );
  }
}

export { MiniPrice };
