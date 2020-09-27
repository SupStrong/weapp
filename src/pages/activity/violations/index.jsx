import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserInfo from "@/actions/userInfo";
import { View, Image } from "@tarojs/components";
import { API_ACTIVE_BLOCK } from "@/http/api/ACTIVE";
import { showPopup, showLoading } from "@/utils/index";
import { ActiveAddHouse } from "@/components/active/add_house";
import "./index.scss";

let bh =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/bh.png";
let people =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/people.png";

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
@connect(mapStateToProps, mapDispatchToProps)
class Index extends Component {
  state = {
    alertShow: false,
    listData: [],
  };
  componentDidMount() {
    this.getListData();
  }
  componentDidShow() {}
  onShareAppMessage() {}
  onReachBottom() {}
  onPullDownRefresh() {}
  async getListData() {
    try {
      showLoading();
      let { data } = await API_ACTIVE_BLOCK({});
      Taro.hideLoading();
      this.setState({
        listData: data.items,
      });
    } catch (err) {
      showPopup("载入远程数据错误");
    }
  }

  updateParent(val) {
    this.setState({
      alertShow: val,
    });
  }

  render() {
    let { listData } = this.state;
    const isIphone = this.props.isIphone.isIphone;

    return (
      <View className={`container ${isIphone ? "ipx" : ""}`}>
        <View className='bg-linear'></View>
        <View className='true-content'>
          <View className='no'>!</View>
          <View className='word'>
            为了保证活动的公平性，对于恶意刷赞的用户，平台将会直接取消活动参与资格哦~
          </View>
          <View className='list'>
            <Image className='tit' src={bh} />
            <View className='name-list'>
              {listData.length > 0 ? (
                listData.map((item, index) => (
                  <View className='item fl-row-leftNowrap ' key={index}>
                    <Image className='avator' src={item.avatar} />
                    <View className='nick G-Fsize-14 G-color-222'>
                      {item.nick_name}
                    </View>
                    <View className='agree G-Fsize-14 G-color-222'>
                      刷赞数量:{item.agree_num}赞
                    </View>
                  </View>
                ))
              ) : (
                <View className='empty G-bold G-Fsize-16 G-color-222'>
                  暂无取消资格用户名单哦~
                </View>
              )}
            </View>
          </View>
          <View className={`add fl-row-leftNowrap ${isIphone ? "ipx" : ""}`}>
            <Image className='house' src={people} />
            <View>
              <View className='tit G-Fsize-16 G-color-222'>回答的内部群</View>
              <View className='detail G-Fsize-14 G-color-999'>
                任何问题都可加入咨询哦~
              </View>
            </View>
            <View
              className='btn-box'
              onClick={this.updateParent.bind(this, true)}
            >
              加群
            </View>
          </View>
        </View>

        {this.state.alertShow && (
          <ActiveAddHouse
            fnData={this.updateParent.bind(this)}
            alertShow={this.state.alertShow}
          ></ActiveAddHouse>
        )}
      </View>
    );
  }
}

export default Index;
