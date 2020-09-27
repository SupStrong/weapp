import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserInfo from "@/actions/userInfo";
import { View } from "@tarojs/components";
import { API_AttentionQList } from "@/http/api/COLLECT";
import { showPopup, showLoading, shareWx } from "@/utils/index";
import { Blank } from "@/components/blank";
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
  state = {
    page:1,
    listData: []
  }
  componentDidMount(){
    this.getListData()
  }
  componentDidShow() {
  }

  onShareAppMessage() {
    shareWx();
    return {
      title: "关注问题",
      path: `pages/user/attention/index`,
      imageUrl: ""
    };
  }
  onReachBottom() {
    if(this.state.page != 0){
      this.getListData()
    }
  }
  onPullDownRefresh(){
    this.setState({page:1,listData:[]})
    this.getListData()
  }
  async getListData() {
    showLoading();
    let { data } = await API_AttentionQList({
      page: this.state.page,
      unionid: this.props.userInfo.userInfo.unionid
    });
    Taro.hideLoading();
    this.setState({
      listData: [...this.state.listData, ...data.items],
      page: data.next_page
    });
  }
  goQuestion(id,status){
    if(status == 0 ){
      showPopup('该问题已删除')
      return false
    }

    Taro.navigateTo({
      url: `/pages/question/details/index?id=${id}`,
    });
  }
 
  render() {
    const { listData } = this.state;
     return (
      <View>
        {
          listData.map((list)=>
            <View className='list-item' key={list.id} onClick={this.goQuestion.bind(this,list.id,list.status)}>
              <View className='title'>{list.title}</View>
              <View className='total'>{list.total}个回答</View>
              {list.status == 0 && <View className='del'>内容涉及敏感信息和敏感人物,已删除</View>}
            </View>
          )
        }
        {
          listData.length == 0 ? <Blank message='您还关注问题哦~' />:null
        }
       
      </View>
    );
  }
}

export default Index;
