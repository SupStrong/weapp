import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "@tarojs/components";
import { TimeEl } from "@/components/time";
import { ActiveEl } from "@/components/active";
import { API_LIFE_OPREATE } from "@/http/api/LIFE";
import { shareWx, getLife, stopInterval, getActiveInfo  } from "@/utils/index";
import "./index.scss";

const shareImg = 'https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/index/share.jpg'

function mapStateToProps(state) {
  return {
    counter: state.time.toJS(),
    userInfo: state.userInfo.toJS(),
  };
}

@connect(mapStateToProps)
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
        activeInfo:{
          status:0,
          topic_title:'',
          btn_title:''
        }
    };
  }
  async componentDidShow() {
    stopInterval();
    getLife();
    let activeInfo =  await getActiveInfo();
    this.setState({activeInfo})

  }
  componentDidHide() {
    stopInterval();
  }

  onShareAppMessage() {
    shareWx();
    return {
      title: "装修防坑搜索",
      path: "pages/index/index",
      imageUrl: shareImg,
    };
  }
  goSearch=()=>{
    API_LIFE_OPREATE({
      type: 1,
      opreate_type: "incr",
      unionid: this.props.userInfo.userInfo.unionid,
    });
    Taro.navigateTo({
      url: "/pages/article/search/index",
    });
  }

  render() {
    let timeData = this.props.counter.time;
    let {activeInfo} = this.state
    return (
      <View className='index'>
        {activeInfo.status != 0&&<ActiveEl extClass='search' />}
        <View className='bd'>
          <View className='icon-con' onClick={this.goSearch}>
            <View className='iconfont iconsousuo1'></View>
          </View>
          <View className='introduction'>产品因使用而存在</View>
        </View>
        <TimeEl timeData={timeData} />
      </View>
    );
  }
}

export default Index;
