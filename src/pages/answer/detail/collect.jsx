import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserInfo from "@/actions/userInfo";
import { View, Image, Text } from "@tarojs/components";
import imgV from "@/assets/images/common/blue_v.png";
import "./index.scss";

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS(),
    isIphone: state.isIphone.toJS(),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(UserInfo, dispatch),
  };
}
function ConcernNot(props) {
  return (
    <View className='btn btn-no fl-row-center' onClick={props.getUpDate}>
      <Text className='sign G-Fsize-8 G-bold iconfont iconxinjian'></Text>
      <Text className='word G-Fsize-14 G-bold'>关注</Text>
    </View>
  );
}
function ConcernFollowed(props) {
  return (
    <View className='btn btn-yes' onClick={props.getUpDate}>
      已关注
    </View>
  );
}
@connect(mapStateToProps, mapDispatchToProps)
class Index extends Component {
  getUpDate = (e) => {
    e.stopPropagation();
    this.props.updateCollect();
  };
  render() {
    const list = this.props.list;
    return (
      <View>
        <View className='collect-box fl-row-justy'>
          <View className='message'>
            <Image class='image' src={list.avatar} />
            <View className='G-Ml-10'>
              <View className='name'>
                {list.user_name}
                {list.is_verified ? <Image class='image-v' src={imgV} /> : ""}
              </View>
              <View className='contact'>
                {list.weChat_id ? (
                  <View
                    className='box'
                    onClick={(e) => {
                      e.stopPropagation();
                      Taro.setClipboardData({ data: list.weChat_id });
                    }}
                  >
                    <View className='iconfont iconweixin2'></View>
                    <View className='text'>{list.weChat_id}</View>
                  </View>
                ) : (
                  ""
                )}
                {list.phone ? (
                  <View
                    className='box'
                    onClick={(e) => {
                      e.stopPropagation();
                      Taro.makePhoneCall({
                        phoneNumber: list.phone,
                      });
                    }}
                  >
                    <View className='iconfont icondianhua'></View>
                    <View className='text'>{list.phone}</View>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
          <View className='button'>
            {this.props.isCollect ? (
              <ConcernFollowed getUpDate={this.getUpDate} />
            ) : (
              <ConcernNot getUpDate={this.getUpDate} />
            )}
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
