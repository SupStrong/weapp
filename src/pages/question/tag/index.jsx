import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserInfo from "@/actions/userInfo";
import { View, Text } from "@tarojs/components";
import { API_TAG_SAVE,API_GROUP_LIST } from "@/http/api/TAG";
import { showPopup, showLoading, shareWx, setRefrs } from "@/utils/index";

import "./index.scss";

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS(),
    isIphone: state.isIphone.toJS()
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
      listData: [],
      currentData:[],
      currentDataValue :[],
      question_id:''
    };
  }
  componentDidMount(){
    let tags = getCurrentInstance().router.params.tags;
    let question_id = getCurrentInstance().router.params.question_id
    let jsonTags = JSON.parse(tags);
    let data = []
    jsonTags.map(item =>{
      data.push(item.id);
    })
    this.setState({ 
      question_id,
      currentData: data,
      currentDataValue : jsonTags
    },()=>{
      this.initData()
    });
  }
  componentDidShow() {
    this.initData()
  }

  onShareAppMessage() {
    shareWx();
    return {
      title: "收藏",
      path: `pages/collect/index`,
      imageUrl: ""
    };
  }
  onPullDownRefresh(){
    Taro.showNavigationBarLoading()
    this.initData()
    setTimeout(()=>{
      Taro.hideNavigationBarLoading()
      Taro.stopPullDownRefresh()
    },1000)
  }
  initData(){
    this.setState({
      listData: []
    });
    this.getListData();
  }
  // 获取标签列表
  async getListData() {
    showLoading();
    let postData = {
      type:'tag',
      question_id:this.state.question_id,
    };
    let { data } = await API_GROUP_LIST(postData);
    Taro.hideLoading();
    this.setState({
      listData : this.selected(data)
    });
  }
  // 保存标签
  async submitData(){
    showLoading();
    let postData = {
      tags: this.state.currentData,
      item_id:this.state.question_id,
      item_type:'question',
      unionid:this.props.userInfo.userInfo.unionid,
    };
    const { status,message } = await API_TAG_SAVE(postData);
    Taro.hideLoading();
    if(status){
      setRefrs(["pages/qalist/index","pages/question/details/index"])
      showPopup(message)
      setTimeout(() => {
        Taro.navigateBack({
          delta:1
        })
      }, 1000);
    }
  }
  // 编辑标签时已选中的
  selected(data) {
    let that = this;
    for (const itemData of data) {
      for (const item of itemData.sub_items) {
        item.is_select = that.state.currentData.includes(item.id) ? true :false;
      }
    }
    return data
  }
  // 切换当前选中的
  currentIndex(_this) {
    if(this.state.currentDataValue.length >= 3 && _this.is_select == false){
      showPopup('最多不能超过3个哦~');
      return;
    }
    _this.is_select = !_this.is_select;
    let index = this.state.currentData.indexOf(_this.id);
    let newData = this.state.currentData;
    let newDataVal = this.state.currentDataValue;
    if (index > -1) {
      newData.splice(index, 1);
      newDataVal.splice(index,1)
    } else {
      newData.push(_this.id);
      newDataVal.push(_this)
    }
    this.setState({
      currentData : newData,
      currentDataValue:newDataVal
    });
  }
  render() {
    const { listData,currentDataValue } = this.state;
    let isIphone = this.props.isIphone.isIphone;
    let addEl;
    if(currentDataValue.length == 0){
      addEl = (<View className='G-Fsize-12 tag-add-empty'>最多添加三个</View>)
    }else{
      addEl = <View className='tag-add-list'>{
        currentDataValue.map(item =>(
          <View  className='content G-Fsize-14 G-text-c' key={item.id}>{item.name}</View>
        ))
      }
      </View>
    }
    return (
      <View className={`index ${isIphone ? "isIphone" : ""}`}>
        <View className='tag-add G-fx-c G-bg-white'>
          <View className='tag-add-text G-Fsize-16 G-Fweight-500'>已添加标签</View>
          {addEl}
        </View>
        <View className='tag-list G-mt-10 G-bg-white'>
        {listData.map((item,index) => (
            <View key={index}>
              <Text className='tag-list-title G-Fsize-16 G-Fweight-500'>{item.name}</Text>
              <View className='tag-list-content'>
                {item.sub_items.map((ele,idx) =>(
                  <View className={`content G-Fsize-14 G-text-c ${ele.is_select ? 'active' : ''}`}  key={idx} onClick={this.currentIndex.bind(this,ele)}>{ele.name}</View>
                ))}
              </View>
            </View>
        ))}
        </View>
        <View className={`tag-submit G-bg-white ${isIphone ? "isIphone" : ""}`}>
          <Text className='submit G-text-c G-color-white G-Fsize-16' onClick={this.submitData.bind(this)}>提交</Text>
        </View>
      </View>
    );
  }
}

export default Index;
