import React, { Component } from "react";
import { View , Text} from "@tarojs/components";
import { goLogin } from "@/utils/index";
import "./index.scss";

class BigPrice extends Component {
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
    let { desData, isUser } = this.props;
    let max = this.getMax(desData)
    let basePrice = 0
    if(desData.length){
      basePrice = desData[0].value
    }
    return (
      <View className={`C-price-big ${isUser ? '' : 'no-login'}`} >
        <View className='bg-con'>
          {[1, 2, 3, 4,5].map((number) => 
            <View className='bg-item' key={number.toString()}></View>
          )}
        </View>
        <View className='G-price-des'>
        {desData.map(item => (
          <View className='G-price-con' key={item.name} style={`height:${(item.value)*100/max}%`}>
            <Text className='price-text'>¥{item.value}</Text>
            <View className='price-item'></View>
            <Text className='price-type'>{item.name}</Text>
          </View>
        ))}
        <View className='G-split-line' style={`height:${(basePrice)*100/max}%`}></View>
        </View> 
        <View className='login-btn' onClick={goLogin}>登录后可查看</View>
      </View>
    );
  }
}

export { BigPrice };
