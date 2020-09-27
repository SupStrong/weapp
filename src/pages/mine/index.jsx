import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserInfo from "@/actions/userInfo";
import { View, Image, Text } from "@tarojs/components";
import { API_USER_SHOW } from "@/http/api/USER";
import {
  showLoading,
  showPopup,
  goLogin,
  shareWx,
  getActiveInfo,
  stopInterval
  
} from "@/utils/index";
import "./index.scss";

const note =  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/mine/note.png";
const hotImg =  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/mine/hot.png";


const notVerifiedImg =  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/mine/not-verified.png";
const verifiedImg =  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/mine/verified.png";

let linkConfigData = [
  {
    path: "/pages/user/answer/index",
    icon: "iconhuida",
    text: "我的回答",
  },
  {
    path: "/pages/user/questions/index",
    icon: "icontiwen1",
    text: "我的提问",
  },
  {
    path: "/pages/user/follow/index",
    icon: "iconguanzhu",
    text: "我的关注",
  },
  {
    path: "/pages/user/attention/index",
    icon: "iconwenti",
    text: "关注问题",
  },
];

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS(),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(UserInfo, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoData: {},
      activeInfo: {
        status: 0,
        topic_title: "",
        btn_title: "",
      },
    };
  }
  componentDidMount() {}

  componentWillUnmount() {}

  async componentDidShow() {
    this.getMasterInfo();
    let activeInfo = await getActiveInfo();
    this.setState({ activeInfo });
  }

  componentDidHide() {
    stopInterval()
  }

  onShareAppMessage() {
    shareWx();
    return {
      title: "装修工艺搜索",
      path: `pages/index/index`,
      imageUrl: "",
    };
  }
  async getMasterInfo() {
    try {
      showLoading();
      const { data } = await API_USER_SHOW({
        id: this.props.userInfo.userInfo.unionid,
        unionid: "",
      });
      Taro.hideLoading();
      this.setState({
        infoData: data,
      });
    } catch (error) {
      showPopup("工长详情载入远程数据错误");
    }
  }
  goTime(isUser) {
    if (!isUser) {
      goLogin();
      return false;
    }
    Taro.navigateTo({
      url: `/pages/user/time/index`,
    });
  }
  goCollect(isUser) {
    if (!isUser) {
      goLogin();
      return false;
    }
    Taro.navigateTo({
      url: "/pages/user/collect/index",
    });
  }
  goVerify = () => {
    Taro.navigateTo({
      url: "/pages/master/verify/index/index",
    });
  }
  linkFun(item, isUser) {
    if (!isUser) {
      goLogin();
      return false;
    }
    Taro.navigateTo({
      url: `${item.path}`,
    });
  }
  goOther() {
    Taro.navigateToMiniProgram({
      appId: "wx6a1c8cd6030c586a",
      path: "pages/tabs/home/main",
      envVersion: "release",
      success: function () {
        // 打开成功
      },
    });
  }
  goActivePage= ()=>{
    Taro.navigateTo({
      url: "/pages/activity/detail/index",
    });
  }
  render() {
    let isUser = this.props.userInfo.userInfo.unionid.length > 0 ? true : false;
    let userInfoEl;
    if (!isUser) {
      userInfoEl = (
        <View className='info-con' onClick={goLogin}>
          <View className='avatar no'>
            <View className='icontouxiangmorentu iconfont'></View>
          </View>
          <Text className='name-text'>点击授权</Text>
        </View>
      );
    } else {
      let { user_name, avatar, is_verified } = this.state.infoData;
      userInfoEl = (
        <View
          className='info-con'
          onClick={is_verified == 0 && this.goVerify}
        >
          <View className='avatar'>
            <Image className='avatar-img' src={avatar} />
          </View>
          <Image
            className='verify-img'
            src={is_verified == 1 ? verifiedImg : notVerifiedImg}
          />
          <Text className='name-text'>{user_name}</Text>
        </View>
      );
    }
    let linkEL = (
      <View className='link-con'>
        {linkConfigData.map((item) => (
          <View
            className='link-item'
            key={item.icon}
            onClick={this.linkFun.bind(this, item, isUser)}
          >
            <View className={`iconfont ${item.icon}`}></View>
            <Text className='link-item-text'>{item.text}</Text>
          </View>
        ))}
      </View>
    );
    let { fans_num = 0, agree_num = 0 } = this.state.infoData;
    let { activeInfo } = this.state;
    return (
      <View className='index'>
        <View className='hd'>
          <View className='bg-bule'></View>
          <View className='user-con'>
            <View className='num-item'>
              <Text className='num-item-title'>粉丝总数</Text>
              <Text className='num-item-num'>{fans_num}</Text>
            </View>
            {userInfoEl}
            <View className='num-item'>
              <Text className='num-item-title'>获赞总数</Text>
              <Text className='num-item-num'>{agree_num}</Text>
            </View>
          </View>
          {linkEL}
        </View>
        <View className='bd'>
          <View className='bd-item' onClick={this.goActivePage}>
            <View className='left-con'>
              <Image src={hotImg} className='hot-img' />
              <Text className='title'>{activeInfo.btn_title}</Text>
            </View>
            <Text className='iconfont icongengduo'></Text>
          </View>
          <View className='bd-item' onClick={this.goCollect.bind(this, isUser)}>
            <View className='left-con'>
              <Text className='iconfont iconshoucang1'></Text>
              <Text className='title'>我的收藏</Text>
            </View>
            <Text className='iconfont icongengduo'></Text>
          </View>
          <View className='bd-item' onClick={this.goTime.bind(this, isUser)}>
            <View className='left-con'>
              <Text className='iconfont iconchanpingongxianjilu'></Text>
              <Text className='title'>产品贡献记录</Text>
            </View>
            <Text className='iconfont icongengduo'></Text>
          </View>
        </View>
        <View className='ft'>
          <View className='descript'>
            装修时您可能还需要记账 推荐自己的另外一个产品:
          </View>
          <View className='link' onClick={this.goOther}>
            <Image src={note} className='note-img'></Image>
            <View className='btn'>家装记账本</View>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
