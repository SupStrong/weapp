import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Input, Image, Text } from "@tarojs/components";
import { Blank } from "@/components/blank";
import { Answer } from "@/components/question/answer";
import { API_QUESTION_LIST } from "@/http/api/QUESTION";
import { showPopup, showLoading } from "@/utils/index";

import "./index.scss";
import moonImg from "./moon.png";


class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: "",
      listData: [],
      cityData: {},
      isSearch:false,
      isShowKeyboard:true,
      cityData:{
        id:'',
        name:'全部'
      },
    };
  }

  componentDidMount() {
    let cityData = Taro.getStorageSync('cityData') || {name:'全部',id:0}
      this.setState({cityData},()=>{
      })
  }
  componentWillUnmount() {}

  componentDidShow() {
  }

  componentDidHide() {}
  onReachBottom() {
    if (this.page == 0) {
      return false;
    }
    this.getListData();
  }
  initData(keywords='') {
    if(!keywords){
      showPopup('请输入关键字')
      return false
    }
    this.page = 0;
    this.setState({listData: []})
    this.setState({isShowKeyboard:false})
    this.setState({keywords},()=>{
      this.getListData();
    }
    )
  }
  async getListData() {
    try {
      showLoading();
      const { data } = await API_QUESTION_LIST({
        page: this.page,
        type: 1,
        keywords:this.state.keywords,
        city_id:this.state.cityData.id
      });
      Taro.hideLoading();
      this.page = data.next_page;
      this.setState({
        listData: [...this.state.listData, ...data.items],
        isSearch:true
      });
    } catch (error) {
      showPopup("载入远程数据错误");
    }
  }
  handleChange(event) {
    this.setState({ isSearch: false });
    this.setState({ keywords: event.target.value });
  }
  goAskQuestion = () => {
    Taro.navigateTo({
      url: `/pages/question/ask/index?title=${this.state.keywords}`,
    });
  };
  clearKeywords() {
    this.setState({ isSearch: false });
    this.setState({ keywords: "" },()=>{
    });
    this.setState({isShowKeyboard:true})
  }
  render() {
    let { keywords, listData, isSearch,isShowKeyboard } = this.state;
    let showKeywords = keywords;
    if (keywords.length > 10) {
      showKeywords = keywords.slice(0,10) + "...";
    }
    let bdEL = <Blank message='暂无~'></Blank>;
    if (listData.length > 0) {
      bdEL = (
        <View className='bd'>
          {listData.map((item) => (
            <Answer
              key={item.id}
              title={item.title}
              id={item.id}
              answer_info={item.answer_info}
              hasUserInfo={false}
              to='question'
            />
          ))}
        </View>
      );
    } else if (keywords.length > 0 && isSearch) {
      bdEL = (
        <View className='moon'>
          <View className=''></View>
          <Image src={moonImg} className='moon-img' />
          <Text className='moon-des'>
            {`装修就像探索月球表面\n爬出来一个坑然后再掉进下一个坑`}
          </Text>
          <Text className='moon-title'>
            {`成为第一个发布问题\n“${showKeywords}”的勇士`}
          </Text>
          <Text className='moon-subtitle'>帮助自己和其他人脱坑</Text>
          <View className='btn' onClick={this.goAskQuestion}>立即发布</View>
        </View>
      );
    }
    return (
      <View className='index'>
        <View className='hd'>
          <View className='input-con'>
            <Input
              type='text'
              placeholder='搜索问题'
              value={keywords}
              focus={isShowKeyboard}
              onInput={(e) => {
                this.handleChange(e);
              }}
              onConfirm={this.initData.bind(this, keywords)}
              className='input-el'
            />
            {keywords.length > 0 ? (
              <View
                className='icon-btn'
                onClick={this.clearKeywords.bind(this)}
              >
                <View className='icon-con'>
                  <View className='iconfont iconguanbi'></View>
                </View>
              </View>
            ) : (
              ""
            )}
          </View>
          <View className='search-btn' onClick={this.initData.bind(this, keywords)}>
            搜索
          </View>
        </View>
        {bdEL}
      </View>
    );
  }
}

export default Index;
