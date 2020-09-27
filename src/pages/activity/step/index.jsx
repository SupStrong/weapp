import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserInfo from "@/actions/userInfo";
import { View, Text, Image } from "@tarojs/components";
import { shareWx } from "@/utils/index";
import "./index.scss";

let step1 =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/step1.png";
let step3 =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/step3.png";
let step4 =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/step4.png";
let step2 =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/step2.png";
let t1 =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/t1.png";
let t2 =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/t2.png";
let t3 =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/t3.png";
let t4 =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/t4.png";
let no1Gift =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/no_1_gift.png";
let no2Gift =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/no_2_gift.png";
let no3Gift =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/no_3_gift.png";
let no4Gift =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/activity/no_4_gift.png";

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
  state = {};
  componentDidMount() {}
  componentDidShow() {}
  onShareAppMessage() {
    shareWx();
    return {
      title: "如何获得Iphone12",
      path: `/pages/activity/step/index`,
      imageUrl: "",
    };
  }
  onReachBottom() {}
  onPullDownRefresh() {}

  render() {
    const isIphone = this.props.isIphone.isIphone;

    return (
      <View className={`${isIphone ? "ipx" : ""} 'container'`}>
        <View className='step'>
          <View className='small-bg'></View>
          <View className='box'>
            <View className='tit'>
              <Text className='word G-Fsize-16'>
                第1步：找一个自己能解答的问题
              </Text>
            </View>
            <View className='img-box'>
              <Image className='s1' src={step1} lazyLoad />
            </View>
          </View>
        </View>
        <View className='step'>
          <View className='small-bg'></View>
          <View className='box'>
            <View className='tit'>
              <Text className='word G-Fsize-16'>
                第2步：对这个问题做出自己独到的解答
              </Text>
            </View>
            <View className='img-box'>
              <Image className='s2' src={step2} lazyLoad />
            </View>
            {/* <Image className="" scr={} /> */}
          </View>
        </View>
        <View className='step'>
          <View className='small-bg'></View>
          <View className='box'>
            <View className='tit'>
              <Text className='word G-Fsize-16'>
                第3步：系统会将您的解答展示给所有用户
              </Text>
              <Text>(您的回答中，会保留您的手机号和微信号哦~）</Text>
            </View>
            <View className='img-box'>
              <Image className='s3' src={step3} />
            </View>
            {/* <Image className="" scr={} /> */}
          </View>
        </View>
        <View className='step'>
          <View className='small-bg'></View>
          <View className='box'>
            <View className='tit'>
              <Text className='word G-Fsize-16'>
                第4步：用户如果觉得您的好，对您的答案进行点赞
              </Text>
            </View>
            <View className='img-box'>
              <Image className='s4' src={step4} />
            </View>
            {/* <Image className="" scr={} /> */}
          </View>
        </View>
        <View className='step'>
          <View className='small-bg'></View>
          <View className='box'>
            <View className='tit'>
              <Text className='word G-Fsize-16'>
                第5步：活动中会根据您在9月23日-9月30日
              </Text>
              <Text>23：59：59 后所有的点赞之和进行排名</Text>
            </View>
            <View className='img-box s5'>
              <View className='answer1 answer fl-column-centerTop'>
                <View className='circle G-Fsize-16'>3234</View>
                <Text className='tip G-Fsize-14'>回答1</Text>
              </View>
              <View className='answer2 answer fl-column-centerTop'>
                <View className='circle G-Fsize-16'>332234</View>
                <Text className='tip G-Fsize-14'>回答2</Text>
              </View>
              <View className='answer3 answer fl-column-centerTop'>
                <View className='circle G-Fsize-16'>5634</View>
                <Text className='tip G-Fsize-14'>回答3</Text>
              </View>
              <View className='answer4 answer fl-column-centerTop'>
                <View className='circle G-Fsize-16'>345344</View>
                <Text className='tip G-Fsize-14'>回答4</Text>
              </View>
              <View className='answer5 answer fl-column-centerTop'>
                <View className='circle G-Fsize-16'>198</View>
                <Text className='tip G-Fsize-14'>回答5</Text>
              </View>
              <View className='all-answer answer fl-column-centerTop'>
                <View className='circle G-Fsize-24 G-bold'>6734672</View>
                <Text className='tip G-Fsize-14'>点赞数</Text>
              </View>
              <View className='big-tit G-Fsize-18 G-bold'>
                针对排名前6名分别会寄出丰厚礼品！
              </View>
              <View className='gift-item'>
                <Image className='pic first' src={no1Gift} />
                <Image className='intro first' src={t1} />
              </View>
              <View className='gift-item'>
                <Image className='pic common' src={no2Gift} />
                <Image className='intro second' src={t2} />
              </View>
              <View className='gift-item'>
                <Image className='pic common' src={no3Gift} />
                <Image className='intro third' src={t3} />
              </View>
              <View className='gift-item'>
                <Image className='pic common' src={no4Gift} />
                <Image className='intro forth' src={t4} />
              </View>
            </View>
          </View>
        </View>
        <View className='talk G-Fsize-20 G-color-222 G-bold'>
          礼品丰厚，快回答问题参与吧！
        </View>
      </View>
    );
  }
}

export default Index;
