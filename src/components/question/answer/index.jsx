import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Text, Image } from "@tarojs/components";
import { showPopup } from "@/utils/index";
import BlueV from "@/assets/images/common/blue_v.png";
import playBtnImg from "@/assets/images/common/play-btn.png";
import "./index.scss";


class Answer extends Component {
  constructor(props) {
    super(props);
  }

  changeTab(value) {
    this.props.changeTab(value);
  }
  goDes(id, to,status) {
    if(status == 0) {
      showPopup('该回答已删除')
      return false
    }


    if ((to = "question")) {
      Taro.navigateTo({
        url: `/pages/question/details/index?id=${id}`,
      });
    }
  }
  goUser(id) {
    let pageLength = Taro.getCurrentPages().length
    if(pageLength >= 7){//防止10层嵌套
      Taro.redirectTo({
        url: `/pages/master/detail/index?unionid=${id}`
      })
      return
    }
    Taro.navigateTo({
      url: `/pages/master/detail/index?unionid=${id}`,
    });
  }
  goAnswerList(id) {
    Taro.navigateTo({
      url: `/pages/answer/detail/index?id=${id}`,
    });
  }
  childFollow(id, index, value,master_id) {
    this.props.onChangeAttention(id, index, value,master_id);
  }
  formatTime(time) {
    let useTime = Math.ceil(time - 0);
    let h = Math.floor((useTime / 3600) % 24);
    let m = Math.floor((useTime / 60) % 60);
    let s = useTime - h * 3600 - m * 60;
    if (h) {
      return `${h}:${m}:${s}`;
    }
    if (m) {
      return `${m}:${s}`;
    }
    return `00:${s}`;
  }

  render() {
    let {
      title,
      id,
      currentIndex,
      answer_info,
      hasUserInfo,
      from,
      extClass,
      status = 1
    } = this.props;

    let bd;
    if (status == 0) {
      bd = <View className='delate-text'>内容涉及敏感信息和敏感人物,已删除
      </View>;
    } else {
      bd =
        answer_info.source_type == 2 ? (
          <View className='video-con'>
            <Image
              mode='aspectFill'
              className='cover-img'
              src={answer_info.source_cover}
              lazyLoad
            ></Image>
            <Image
              className='play-btn'
              src={playBtnImg}
            ></Image>
            <View className='progress-line'>
              {this.formatTime(answer_info.source_time)}
            </View>
          </View>
        ) : (
            <View className='audio'>
              <View className='iconfont iconziyuan G-bold'></View>
              <View className='time'>{Math.ceil(answer_info.source_time - 0)}″</View>
            </View>
          );
    }

    return (
      <View className={`G-question-answer ${extClass}`}>
        <View className='item-title' onClick={this.goDes.bind(this, id,status)}>
          {title}
        </View>
        {(answer_info != '') ?
          <View>
            <View className='item-user fl-row-leftNowrap'>
              <Image
                className='avatar-img'
                src={answer_info.avatar}
                lazyLoad
                onClick={
                  from == "des"
                    ? this.goUser.bind(this, answer_info.unionid)
                    : this.goDes.bind(this, id)
                }
              />
              <View className='info G-Fsize-12'>
                <View className='tit fl-row-leftNowrap'>
                  <Text className='name G-Fsize-16  G-bold G-color-222'>
                    {answer_info.user_name}
                  </Text>
                  {answer_info.is_verified > 0 && (
                    <Image className='vip' src={BlueV} lazyLoad />
                  )}
                </View>
                {answer_info.is_verified > 0 && (
                  <View className='commicatinon fl-row-leftNowrap'>
                    <View className='commicatinon-item'>
                      <Text className='iconfont iconweixin2 G-Fsize-16'></Text>
                      <Text className='G-Fsize-14'>{answer_info.weChat_id}</Text>
                    </View>
                    <View className='commicatinon-item'>
                      <Text className='iconfont icondianhua G-Fsize-16'></Text>
                      <Text className='G-Fsize-14'>{answer_info.phone}</Text>
                    </View>
                  </View>
                )}
              </View>
              {hasUserInfo && (
                <View
                  className='btn'
                  onClick={this.childFollow.bind(
                    this,
                    answer_info.wx_user_id,
                    currentIndex,
                    answer_info.is_attention,
                    answer_info.unionid
                  )}
                >
                  {answer_info.is_attention ? (
                    <View className='cancel G-Fsize-14 G-bold'>已关注</View>
                  ) : (
                      <View className='add fl-row-center'>
                        <Text className='sign iconfont iconxinjian'></Text>
                        <Text className='word G-bold'>关注</Text>
                      </View>
                    )}
                </View>
              )}
            </View>

            <View
              className='item-bd'
              onClick={
                from == "des"
                  ? this.goAnswerList.bind(this, answer_info.answer_id)
                  : this.goDes.bind(this, id, from,status)
              }
            >
              {bd}
            </View>
            <View
              className='item-ft'
              onClick={
                from == "des"
                  ? this.goAnswerList.bind(this, answer_info.answer_id)
                  : this.goDes.bind(this, id, from,status)
              }
            >
              <View className='item-ft-text'>{answer_info.agree_num}个赞</View>
              <View className='item-ft-split'></View>
              <View className='item-ft-text'>{answer_info.comment_num}评论</View>
              {extClass=='no-user'?<View className='date-time G-Fsize-12'>{answer_info.time}</View>:''}
            </View>
          </View>
          : ''}
      </View>
    );
  }
}

export { Answer };
