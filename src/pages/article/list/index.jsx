import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Time from "@/actions/time";
import { View, Input, Text } from "@tarojs/components";
import { MiniPrice } from "@/components/mini_price";
import { Blank } from "@/components/blank";
import { TimeEl } from "@/components/time";
import { API_ARTICLE_LIST } from "@/http/api/ARTICLE";
import {
  showPopup,
  showLoading,
  shareWx,
  getLife,
  startInterval,
  stopInterval
} from "@/utils/index";
import "./index.scss";

function mapStateToProps(state) {
  return {
    counter: state.time.toJS(),
    isIphone: state.isIphone.toJS()
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(Time, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchData: { keywords: "", page: 0 },
      listData: []
    };
  }
  componentDidMount() {
    let name = getCurrentInstance().router.params.name || "标题";
    let { searchData } = this.state;
    searchData.keywords = name;
    this.setState(searchData);
    this.getListData();
  }

  componentDidShow() {
    stopInterval()
    getLife();
  }
  componentDidHide() {
   
  }
  onShareAppMessage() {
    shareWx();
    return {
      title: "搜索结果",
      path: `pages/article/list/index?name=${this.state.name}`,
      imageUrl: ""
    };
  }
  onReachBottom() {
    if (this.state.searchData.page == 0) {
      return false;
    }
    this.getListData();
  }
  async getListData() {
    try {
      showLoading();
      const { data } = await API_ARTICLE_LIST(this.state.searchData);
      Taro.hideLoading();
      let { searchData } = this.state;
      searchData.page = data.next_page;
      this.setState({
        listData: [...this.state.listData, ...data.items],
        searchData: searchData
      });
    } catch (error) {

      showPopup("载入远程数据错误");
    }
  }

  handleChange(event) {
    let { searchData } = this.state;
    searchData.keywords = event.target.value;
    this.setState({ searchData: searchData });
  }
  onFocus() {
    stopInterval();
  }
  onBlur() {
    startInterval();
  }
  clearKeywords() {
    let { searchData } = this.state;
    searchData.keywords = "";
    this.setState({ searchData: searchData });
  }
  startSearch() {
    this.setState({ listData: [] });
    let { searchData } = this.state;
    searchData.page = 0;
    this.setState({ searchData: searchData });
    this.getListData();
  }

  godes(id) {
    Taro.navigateTo({
      url: `/pages/article/des/index?id=${id}`
    });
  }

  changeTitle(title, keywords) {
    // let title = ''
    if (!title.includes(keywords)) {
      return <Text className='item-title G-limit-one'>{title}</Text>;
    }

    return <Text className='item-title G-limit-one'>{title}111</Text>;
  }
  render() {
    const { listData, searchData } = this.state;
    let timeData = this.props.counter.time;
    let isIphone = this.props.isIphone.isIphone;
    let reg = new RegExp(searchData.keywords, "g");
    return (
      <View className={`index ${isIphone ? "G-iphone" : ""}`}>
        <View className='hd'>
          <View className='input-con'>
            <Input
              type='text'
              placeholder='搜素施工项目'
              maxLength='10'
              value={searchData.keywords}
              onInput={e => {
                this.handleChange(e);
              }}
              onFocus={this.onFocus.bind(this)}
              onBlur={this.onBlur.bind(this)}
              onConfirm={this.startSearch.bind(this)}
              className='input-el'
            />
            {searchData.keywords.length > 0 ? (
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
          <View className='search-btn' onClick={this.startSearch.bind(this)}>
            搜索
          </View>
        </View>
        {listData.length == 0 ? (
          <Blank message='没有您要搜索的内容，可以去模板哪里找找~'></Blank>
        ) : (
          <View className='bd'>
            {listData.map(item => (
              <View
                className='item-con'
                key={item.id}
                onClick={this.godes.bind(this, item.id)}
              >
                <View className='title-con'>
                  {!item.title.includes(searchData.keywords) ? (
                    <Text className='item-title G-limit-one'>{item.title}</Text>
                  ) : (
                    <View
                      className='G-limit-one  item-title'
                      dangerouslySetInnerHTML={{
                        __html: item.title.replace(
                          reg,
                          `<Text class='G-color-bule G-Fsize-14'>${searchData.keywords}</Text>`
                        )
                      }}
                    ></View>
                  )}
                  <Text className='iconfont icongengduo'></Text>
                </View>
                <View className='item-bd'>
                  <View className='item-bd-left'>
                    <Text className='item-des G-limit-2 '>{item.des}</Text>
                    <Text className='item-default'>基准</Text>
                    <View className='price-con'>
                      <Text className='price-small mr-2'>¥</Text>
                      <Text className='price-big'>{item.price}</Text>
                      <Text className='price-small'>/{item.unit}</Text>
                    </View>
                  </View>
                  <View className='item-bd-right'>
                    <MiniPrice desData={item.price_des} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
        <TimeEl timeData={timeData} extClass='small' />
      </View>
    );
  }
}

export default List;
