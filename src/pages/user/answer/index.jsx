import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View } from "@tarojs/components";
import { Blank } from "@/components/blank";
import { Answer } from "@/components/question/answer";
import { API_USER_ANSWER } from "@/http/api/USER";
import * as UserInfo from "@/actions/userInfo";
import { showPopup, showLoading } from "@/utils/index";

import "./index.scss";

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS()
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(UserInfo, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: []
    };
  }

  componentDidMount() {
    this.initData();
  }
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  onReachBottom() {
    if (this.page == 0) {
      return false;
    }
    this.getListData();
  }
  initData() {
    this.type = 1
    this.page = 1;
    this.setState({ listData: [] });
    this.getListData();
  }
  async getListData() {
    try {
      showLoading();
      const { data } = await API_USER_ANSWER({
        page: this.page,
        unionid: this.props.userInfo.userInfo.unionid,
        id: this.props.userInfo.userInfo.unionid,
      });
      Taro.hideLoading();
      this.page = data.next_page;
      this.setState({
        listData: [...this.state.listData, ...data.items]
      });
    } catch (error) {
      showPopup("载入远程数据错误");
    }
  }
  render() {
    let { listData } = this.state
    let bdEL = <Blank message='暂无~'></Blank>

    if (listData.length > 0) {
      bdEL = <View className='bd'>
       
  
          {listData.map(item =>
            <View className='backg' key={item.id}><Answer
              key={item.id}
              title={item.title}
              id={item.id}
              answer_info={item.answer_info}
              hasUserInfo
              to='question'
              extClass='no-user'
              status={item.status}
            />
            </View>

          )}
       

      </View>
    }
    return (
      <View className='index'>
        {bdEL}
      </View>
    );
  }
}

export default Index;
