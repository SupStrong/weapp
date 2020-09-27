import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserInfo from "@/actions/userInfo";
import { View, Image, ScrollView, Text } from "@tarojs/components";
import { API_ACTIVE_QUALIFICA, API_ACTIVE_SORT } from "@/http/api/ACTIVE";
import { showPopup, showLoading, setRefrs, goLogin, shareWx } from "@/utils/index";
import { ActiveAddHouse } from "@/components/active/add_house";
import "./index.scss";

let actBanner = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/activity_banner.png";
let no1Gift = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/no_1_gift.png";
let no1 = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/no_1.png";
let no2Gift = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/no_2_gift.png";
let no2 = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/no_2.png";
let no3Gift = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/no_3_gift.png";
let no3 = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/no_3.png";
let no4Gift = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/no_4_gift.png";
let no4 = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/no_4.png";
let btn1 = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/btn1.png";
let btn2 = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/btn2.png";
let btn3 = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/btn3.png";
let btn4 = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/btn4.png";
let cup = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/cup.png";
let bh2 = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/bh2.png";
let first = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/first.png";
let second = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/second.png";
let third = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/third.png";
let people = "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/people.png";


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
  state = {
    tabList: [
      {
        title: '活动规则',
        type: 0
      },
      {
        title: '排行榜单',
        type: 1
      },
      {
        title: '抽奖榜单',
        type: 2
      }
    ],
    currentTab: 0,
    qualificaData: {
      nick_name: '',
      avatar: '',
      num: 0
    },
    userInfo: {
      user_name: '',
      avatar: '',
      cur_sort: 0,
      prev_sort: 0,
      agree_num: 0
    },
    sortDate: [],
    page: 1,
    alertShow: false
  }
  componentDidMount() {


  }
  componentDidShow() {

  }
  onShareAppMessage() {
    shareWx();
    return {
      title: "如何获得Iphone",
      path: `/pages/activity/detail/index`,
      imageUrl: ""
    };
  }
  onReachBottom() {

  }
  onPullDownRefresh() {

  }
  async getQualigica() {
    try {
      showLoading();
      let { data } = await API_ACTIVE_QUALIFICA({
        unionid: this.props.userInfo.userInfo.unionid
      });
      Taro.hideLoading();
      this.setState({
        qualificaData: data
      });
    } catch (err) {
      showPopup("载入远程数据错误");
    }
  }
  async getSort() {
    try {
      let { data } = await API_ACTIVE_SORT({
        unionid: this.props.userInfo.userInfo.unionid || '',
        page: this.state.page
      });
      let sortArr = [...this.state.sortDate, ...data.items];
      let userin = this.state.userInfo;
      this.setState({
        sortDate: sortArr,
        page: data.next_page||'',
        userInfo: data.user_info||userin
      });
    } catch (err) {
      showPopup("载入远程数据错误");
    }
  }
  getNext() {
    if (this.state.page == 0) {
      return false
    }
    this.getSort()
  }
  changeTab(type) {
    if(type==this.state.currentTab){
      return false
    }
    this.setState({
      currentTab: type
    })
    if (type == 1) {
      this.setState({
        sortDate: [],
        page: 1
      })
      this.getSort()
    }
    if (type == 2) {
      this.getQualigica()
    }
  }

  updateParent(val) {
    this.setState({
      alertShow: val
    })
  }

  goRouter = (url, type) => {
    if (type == 'nav') {
      setRefrs(['pages/qalist/index'])
      Taro.switchTab({
        url:url
      })
      return false
    }
    Taro.navigateTo({
      url: url
    })
  }
  render() {
    let { currentTab, tabList, qualificaData, sortDate, userInfo } = this.state;
    const isIphone = this.props.isIphone.isIphone;
    const unionId = this.props.userInfo.userInfo.unionid;
    return (
      <View className={`${isIphone ? 'ipx' : ''} container ${currentTab == 0 ? 'pdbot' : ''}`}>
        <View className='bg-linear'></View>
        <View className='act-content'>
          {
            //活动规则
            currentTab == 0 && (
              <View>
                <View className='img-box'>
                  <Image className='act-banner' src={actBanner} />
                </View>
                <View className='prize-content'>
                  <View className='prize'>
                    <View className='pic-box box1'>
                      <Image className='gift' src={no1Gift} />
                      <Image className='ranking' src={no1} />
                    </View>
                    <View className='info info1'>
                      <View className='name G-Fsize-16 G-color-222 G-bold'>iPhone12 256G 亮黑色</View>
                      <View className='price G-Fsize-14 G-color-222'>价值6666元</View>
                      <View className='num G-Fsize-16 G-bold'>1名</View>
                    </View>
                  </View>
                  <View className='prize'>
                    <View className='pic-box'>
                      <Image className='gift' src={no2Gift} />
                      <Image className='ranking' src={no2} />
                    </View>
                    <View className='info'>
                      <View className='name G-Fsize-16 G-color-222 G-bold'>京东卡2000元</View>
                      <View className='price G-Fsize-14 G-color-222'>价值2000元</View>
                      <View className='num G-Fsize-16 G-bold'>2名</View>
                    </View>
                  </View>
                  <View className='prize'>
                    <View className='pic-box'>
                      <Image className='gift' src={no3Gift} />
                      <Image className='ranking' src={no3} />
                    </View>
                    <View className='info'>
                      <View className='name G-Fsize-16 G-color-222 G-bold'>京东卡500元</View>
                      <View className='price G-Fsize-14 G-color-222'>价值500元</View>
                      <View className='num G-Fsize-16 G-bold'>3名</View>
                    </View>
                  </View>
                  <View className='prize'>
                    <View className='pic-box'>
                      <Image className='gift' src={no4Gift} />
                      <Image className='ranking' src={no4} />
                    </View>
                    <View className='info'>
                      <View className='name G-Fsize-16 G-color-222 G-bold'>回答获得10个赞即可参加抽奖</View>
                      <View className='product  G-Fsize-14'>德恩特智能消毒刀筷架</View>
                      <View className='fl-row-leftNowrap'>
                        <Text className='num G-Fsize-16 G-bold'>10名</Text>
                        <Text className='lucky-price price G-Fsize-14 G-color-222'>价值369元(京东价)</Text>
                      </View>
                    </View>
                  </View>

                </View>
                <View className='add fl-row-leftNowrap'>
                  <Image className='house' src={people} />
                  <View>
                    <View className='tit G-Fsize-16 G-color-222'>回答的内部群</View>
                    <View className='detail G-Fsize-14 G-color-999'>任何问题都可加入咨询哦~</View>
                  </View>
                  <View className='btn-box' onClick={this.updateParent.bind(this, true)}>
                    加群
                  </View>
                </View>
                <View className={`${isIphone ? 'ipx' : ''} footer`}>
                  <Image className='btn' src={btn1} onClick={this.goRouter.bind(this, '/pages/activity/step/index')} />
                </View>
              </View>
            )
          }
          {
            // 排行榜单
            currentTab == 1 && (
              <View className='ranking-place'>
                <View>
                  <Image className='cup' src={cup} />
                  <View className='rank'>
                    <View className='title G-color-white  G-Fsize-16'>当前排名</View>
                    {!unionId ? (
                      <View className='goLogin G-bold G-color-white G-Fsize-18' onClick={goLogin}>
                        授权小程序查看
                      </View>
                    ) :
                      (<>
                        <View className='num G-color-white  G-Fsize-30'>{userInfo.cur_sort}</View>
                        <View className='agree G-Fsize-14'>已获{userInfo.agree_num}个点赞 距上一名差{userInfo.prev_sort}个赞</View>
                      </>)}
                  </View>
                </View>
                <View className='rank-box'>
                  <Image className='tit' src={bh2} />
                  <ScrollView
                    className='role-box'
                    scrollY
                    onScrollToLower={this.getNext.bind(this)}
                  >
                    {sortDate.map((item, index) =>
                      <View className='item fl-row-leftNowrap' key={index}>
                        <View className='num' >
                          {index == 0 && <Image className='pic' src={first} />}
                          {index == 1 && <Image className='pic' src={second} />}
                          {index == 2 && <Image className='pic' src={third} />}
                          {index > 2 && item.cur_sort}
                        </View>
                        <Image src={sortDate.avator} className='avator' />
                        <View className='nick G-Fsize-14 G-color-222'>{item.user_name}</View>
                        <View className='agree G-Fsize-14 G-bold'>{item.agree_num}个点赞</View>
                        {item.gift_img != '' && <Image src={item.gift_img} className='gift' />}
                      </View>

                    )}

                  </ScrollView>
                  <View className='rank-footer'>
                    <Image className='btn' src={btn2} onClick={this.goRouter.bind(this, '/pages/activity/violations/index')} />
                  </View>

                </View>
              </View>
            )
          }
          {
            // 抽奖榜单
            currentTab == 2 && (
              <View className='draw-box'>
                <View className='bottom-bg'></View>
                <View className='center-bg'></View>
                <View className='top-bg'>
                  <View>
                    {unionId && <Image className='avator' src={qualificaData.avatar} />}
                    {unionId && <View className='name G-Fsize-16 G-color-222'>{qualificaData.nick_name}</View>}
                    {unionId ? <View className='term G-bold'>{qualificaData.num == 0 ? '已获得抽奖条件' : `差${qualificaData.num}个赞，即可参与抽奖！`}</View> :
                      <View className='term G-bold ptop'>登录小程序查看中奖资格</View>
                    }
                    {
                      unionId && qualificaData.num == 0 &&
                      <View className='date G-color-222'>
                        抽奖结果将于2020年10月15日发布
                      </View>
                    }
                    {
                      unionId && qualificaData.num > 0 && <View className='btn-box'>
                        <Image className='btn' src={btn3} onClick={this.goRouter.bind(this, '/pages/qalist/index', 'nav')} />
                      </View>
                    }
                    {
                      !unionId && <View className='btn-box'>
                        <Image className='btn' src={btn4} onClick={goLogin} />
                      </View>
                    }

                  </View>
                </View>

              </View>
            )
          }
        </View >

        {(this.state.alertShow) && <ActiveAddHouse fnData={this.updateParent.bind(this)} alertShow={this.state.alertShow}></ActiveAddHouse>}

        <View className='fl-row-justy tab-box'>
          {tabList.map(item =>
            <View key={item.type} className={`tab-item G-Fsize-16 ${currentTab == item.type ? 'active G-bold' : ''}`} onClick={this.changeTab.bind(this, item.type)}>
              {item.title}
            </View>
          )}
        </View>

      </View >
    );
  }
}

export default Index;
