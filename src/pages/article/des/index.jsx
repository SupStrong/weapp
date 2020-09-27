import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, Button } from "@tarojs/components";
import { BigPrice } from "@/components/big_price";
import { TimeEl } from "@/components/time";
import { API_DES, API_ARTICLE_OPREATE } from "@/http/api/ARTICLE";
import { API_LIFE_OPREATE } from "@/http/api/LIFE";
import { showPopup, showLoading, shareWx, getLife, goLogin, stopInterval } from "@/utils/index";
import * as Time from "@/actions/time";
import * as UserInfo from "@/actions/userInfo";

import "./index.scss";

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS(),
    counter: state.time.toJS(),
    isIphone: state.isIphone.toJS()
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(UserInfo, dispatch),
    ...bindActionCreators(Time, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      desData: {
        title: "",
        unit: "",
        is_collect: "",
        price_des: [],
        des: ""
      }
    };
  }
  componentDidMount() {
    let id = getCurrentInstance().router.params.id;
    this.setState({ id: id },()=>{
      this.getData();
    });
    stopInterval()
    getLife()
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {
  }
  onShareAppMessage() {
    shareWx();
    return {
      title: this.state.desData.title,
      path: `pages/article/dex/index?id=${this.state.desData.id}`,
      imageUrl: ""
    };
  }
  async getData() {
    showLoading()
    let { data } = await API_DES({
      id: this.state.id,
      unionid: this.props.userInfo.userInfo.unionid || ""
    });
    Taro.hideLoading();
    Taro.setNavigationBarTitle({
      title: data.title
    });
    this.setState({ desData: data })
  }
  async opreateArticle(type) {
    if (this.props.userInfo.userInfo.unionid.length == 0) {
      goLogin()
      return;
    }
    if(this.locking == true){
      return
    }
    this.locking = true
    let postData = {
      unionid: this.props.userInfo.userInfo.unionid,
      article_id: this.state.id,
      type: type
    };
    let { status, message } = await API_ARTICLE_OPREATE(postData);
    if (!status) {
      showPopup(message);
      return false;
    }
    API_LIFE_OPREATE({
      type: 2,
      opreate_type: type == 0 ? "desc" : "incr" ,
      unionid: this.props.userInfo.userInfo.unionid
    }).then(res=>{
      if (res.status) {
        showPopup(res.data.time_text);
        let {desData} = this.state
        desData.is_collect = desData.is_collect == 0 ? 1 : 0
        this.setState(desData)
        getLife()
        this.locking = false
      }
    })
   
  }
  copyDes(data) {
    Taro.setClipboardData({
      data: data,
      success: function() {
        Taro.getClipboardData({
          success: function() {
          }
        });
      }
    });
  }
  render() {
    const { desData } = this.state;
    let timeData = this.props.counter.time;
    let isIphone = this.props.isIphone.isIphone;
    let isUser = this.props.userInfo.userInfo.unionid.length > 0 ? true : false
    return (
      <View className={`index ${isIphone ? "G-iphone" : ""}`}>
        <View className='hd'>
          <Text className='title'>{desData.title}</Text>
          <View className='bd-ft'>
            {desData.is_collect === 0 ? (
              <View
                className='item-con split'
                onClick={this.opreateArticle.bind(this, 1)}
              >
                <Text className='iconfont iconxin1'></Text>
                <Text className='item-text'>收藏</Text>
              </View>
            ) : (
              <View
                className='item-con split '
                onClick={this.opreateArticle.bind(this, 0)}
              >
                <Text className='iconfont iconxin2 collect'></Text>
                <Text className='item-text'>已收藏</Text>
              </View>
            )}

            <View className='item-con'>
              <Text className='iconfont iconfenxiang1'></Text>
              <Text className='item-text'>分享</Text>
              <Button openType='share' className='share-btn'>
              </Button>
            </View>
          </View>
        </View>
        <View className='bd'>
          <Text className='bd-title'>收费标准(单位：㎡）</Text>
          <View className='price-des'>
            <BigPrice desData={desData.price_des} isUser={isUser}> </BigPrice>
          </View>
        </View>
        <View className='ft'>
          <View className='bd-title-con'>
            <Text className='bd-title--text'>工艺做法和材料说明</Text>
            <View
              className='cope-btn'
              onClick={this.copyDes.bind(this, desData.des)}
            >
              复制
            </View>
          </View>
          <View className='des-con' >
            <Text className='des-con-item'>
              {desData.des}
            </Text>
            </View>
        </View>
        <TimeEl timeData={timeData} extClass='small' />
      </View>
    );
  }
}

export default Index;
