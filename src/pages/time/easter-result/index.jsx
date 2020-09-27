import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";

const desc = 'https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/time/desc.png'
const incr = 'https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/time/incr.png'


let defaultData={
  desc:{
    hdText:'居然如此狠心，因为你的操作 我减少了',
    ftText:'PS：彩蛋操作不会记录，您是无名的狠人。 本页面不可分享',
    img:desc
  },
  incr:{
    hdText:'十分感谢，因为您的操作 我增加了',
    ftText:'PS：彩蛋操作不会记录，您是无名的英雄。 每个微信账号只能操作一次',
    img:incr
  }
}


class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time:0,
      opreate_type:''
    };
  }
  componentDidMount() {
    let {opreate_type,time}= getCurrentInstance().router.params;
    this.setState({opreate_type:opreate_type,time:time})
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  goBack(){
    Taro.switchTab({
      url: '/pages/index/index'
    });
  }
  render() {
    let { time,opreate_type} = this.state
    return (
      <View className='index'>
        <View className='hd'>
          <Image src={defaultData[opreate_type].img}  className='hd-img'  />
          <View className='hd-text'>
          {defaultData[opreate_type].hdText}{time}分钟的生命时长
          </View>
        </View>
        <View className='bd'>
            <View className='btn-con'>
              <View className='btn add' onClick={this.goBack.bind(this)}>回到首页</View>
            </View>
            <Text className='bd-subtitle'>{defaultData[opreate_type].ftText}</Text>
        </View>
      </View>
    );
  }
}

export default Index;
