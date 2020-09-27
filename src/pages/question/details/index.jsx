import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserInfo from "@/actions/userInfo";
import { View, Image, Video, Text, Button } from "@tarojs/components";
import { API_QUESTION_SHOW, API_QUESTION_DELETE } from "@/http/api/QUESTION";
import { API_ATTENTION } from "@/http/api/ATTENTION";
import { Answer } from "@/components/question/answer";
import { API_ANSWER_LIST } from "@/http/api/ANSWER";
import {
  showPopup,
  showLoading,
  shareWx,
  previewImage,
  goLogin,
  setRefrs,
  checkRefrs
} from "@/utils/index";
import "./index.scss";

const search =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/question/search.png";
const answer =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/question/answer.png";
const play =
  "https://cw100.oss-cn-beijing.aliyuncs.com/minipro/search/question/play.png";

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
      desData: {
        tags: [],
        images: [],
        city_data: {
          name: null
        }
      },
      answerList: [],
      mark: {
        title: "",
        type: "edit",
        status: false
      },
      isPlay: true,
      isControls: false,
      question_id: "",
      page: 1
    };
  }
  componentDidMount() {
    let { id: question_id, timeline = 0 } = getCurrentInstance().router.params;
    if (timeline) {
      this.timeline = 1;
    }
    this.setState({ question_id }, () => {
      this.initData();
    });
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
  }
  componentDidShow() {
    if (checkRefrs("pages/question/details/index")) {
      this.initData();
    }
  }
  onShareAppMessage() {
    shareWx();
    return {
      title: "问题详情",
      path: `pages/question/details/index?id=${this.state.question_id}`,
      imageUrl: ""
    };
  }
  onShareTimeline() {
    return {
      title: "问题详情",
      query: `id=${this.state.question_id}&timeline=1`,
      imageUrl: ""
    };
  }
  onReachBottom() {
    if (this.state.page == 0) {
      return false;
    }
    this.getListData("RB");
  }
  onPullDownRefresh() {
    Taro.showNavigationBarLoading();
    this.initData();
    setTimeout(() => {
      Taro.hideNavigationBarLoading();
      Taro.stopPullDownRefresh();
    }, 1000);
  }
  initData() {
    this.setState({
      desData: {
        tags: [],
        images: [],
        city_data: {
          name: null
        }
      }
    });
    this.setState({ page: 1 });
    this.setState({ answerList: [] });
    this.getDesData();
    this.getListData();
  }
  // 遮罩的幕布
  tabMark(data) {
    this.setState({
      mark: {
        title: data.name,
        type: data.type,
        status: data.show
      }
    });
  }
  // 跳转到修改标签页面
  async editTags(question_id) {
    let tags = JSON.stringify(this.state.desData.tags);
    Taro.navigateTo({
      url: `/pages/question/tag/index?tags=${tags}&question_id=${question_id}`
    });
  }
  // 修改问题详情
  editProblem(id) {
    Taro.navigateTo({
      url: `/pages/question/ask/index?id=${id}`
    });
  }
  // 图片
  previewImageFn(url, imgs) {
    previewImage(url, imgs);
  }
  // 删除问题详情
  async deleteProblem(id) {
    let that = this;
    Taro.showModal({
      title: "提示",
      content: "您确定要删除这一条问题吗？",
      confirmColor: "#0000AF",
      success(res) {
        if (res.confirm) {
          let postData = {
            id,
            unionid: that.props.userInfo.userInfo.unionid || ""
          };
          API_QUESTION_DELETE(postData).then(data => {
            if (data.status) {
              that.tabMark({ name: "", type: "", show: false });
              setRefrs(["pages/qalist/index"]);
              showPopup(data.message);
              setTimeout(function() {
                Taro.switchTab({
                  url: "/pages/qalist/index"
                });
              }, 1000);
            }
          });
        } else if (res.cancel) {
          that.setState({
            mark: {
              status: false
            }
          });
        }
      }
    });
  }
  //回答列表
  async getListData(type) {
    let { question_id } = this.state;
    try {
      showLoading();
      const { data } = await API_ANSWER_LIST({
        page: this.state.page,
        type: 1,
        unionid: this.props.userInfo.userInfo.unionid || "",
        id: question_id,
        timeline: this.timeline || ""
      });
      Taro.hideLoading();
      this.setState({
        page: data.next_page
      });
      let { answerList } = this.state;
      this.setState({
        answerList: type == "RB" ? [...answerList, ...data.items] : data.items
      });
    } catch (error) {
      showPopup("载入远程数据错误");
    }
  }
  // 获取问题详情
  async getDesData() {
    let { question_id } = this.state;
    showLoading();
    let { data } = await API_QUESTION_SHOW({
      id: question_id,
      unionid: this.props.userInfo.userInfo.unionid || "",
      timeline: this.timeline || ""
    });
    Taro.hideLoading();
    this.setState({
      desData: data
    });
  }
  // 关注
  async follow(item, question_id) {
    let that = this;
    if (!this.props.userInfo.userInfo.unionid) {
      goLogin();
      return false;
    }
    let { status, message } = await API_ATTENTION({
      type: "question",
      id: question_id,
      operate: item.type,
      unionid: this.props.userInfo.userInfo.unionid
    });
    let { desData } = this.state;
    desData.is_attention = item.type;
    if (status) {
      that.setState({ desData });
      showPopup(message);
      return false;
    } else {
      showPopup(message);
    }
  }
  // 点击icon全屏播放视频
  IconPlay() {
    let videoplay = Taro.createVideoContext("video");
    videoplay.requestFullScreen();
  }
  //
  tabStatus(data, question_id) {
    if (data.type == "edit") {
      this.tabMark({ name: "修改", type: "edit", show: true });
    } else if (data.type == "video") {
      this.goAnswerRouter();
    } else {
      this.follow(data, question_id);
    }
  }
  changes(event) {
    let videoplay = Taro.createVideoContext("video");
    if (event.detail.fullScreen == true) {
      videoplay.play();
    }
    if (event.detail.fullScreen == false) {
      videoplay.pause();
    }
  }
  // 下面列表的关注事件
  async childFollow(id, index, value, master_id) {
    let that = this;
    if (!this.props.userInfo.userInfo.unionid) {
      goLogin();
      return false;
    }
    if (master_id == this.props.userInfo.userInfo.unionid) {
      showPopup("无法关注自己~");
      return false;
    }

    let operate = value == 0 ? 1 : 0;
    let { status, message } = await API_ATTENTION({
      unionid: this.props.userInfo.userInfo.unionid,
      type: "person",
      id: id,
      operate: operate
    });
    let { answerList } = this.state;
    answerList[index].answer_info.is_attention = operate;
    if (status) {
      that.setState({ answerList });
      showPopup(message);
      return false;
    } else {
      showPopup(message);
    }
  }
  // 我来回答
  goAnswerRouter = () => {
    if (!this.props.userInfo.userInfo.unionid) {
      goLogin();
      return false;
    }
    Taro.navigateTo({
      url: `/pages/answer/reply/index?que_id=${this.state.desData.id}&question=${this.state.desData.title}`
    });
  };
  render() {
    const {
      desData,
      answerList,
      mark,
      isPlay,
      isControls,
      question_id
    } = this.state;
    let linkEl, shareEl, statusEl;
    let statusConfigData = [
      {
        show: desData.is_self == 0,
        iconPath: "iconshipinhuida",
        text: "视频回答",
        type: "video"
      },
      {
        show: desData.is_attention == 0,
        iconPath: "iconpingfen2",
        text: "关注",
        type: 1
      },
      {
        show: desData.is_attention != 0,
        iconPath: " iconpingfen2 active",
        text: "已关注",
        type: 0
      },
      {
        show: desData.is_change != 0,
        iconPath: "iconbianji",
        text: "修改",
        type: "edit"
      }
    ];
    let shareConfigData = [
      {
        viewName: "main-modify",
        iconClass: "iconbianji G-Fsize-20",
        text: "修改",
        type: "edit"
      },
      {
        viewName: "main-delete",
        iconClass: "iconguanbi G-Fsize-18",
        text: "删除",
        type: "delete"
      }
    ];
    if (desData.is_self == 1 && answerList.length == 0) {
      linkEl = (
        <View className='tips-info'>
          <View className='tips-info-main G-bg-white'>
            <Image className='tips-image' src={search}></Image>
            <View className='tips-title G-Fsize-14 G-Fweight-500'>
              正在为您寻找答案
            </View>
            <View className='tips-date G-Fsize-12'>
              可能需要几十分钟，请耐心等待
            </View>
          </View>
        </View>
      );
    } else if (desData.is_self != 1 && answerList.length == 0) {
      linkEl = (
        <View className='tips-info'>
          <View className='tips-info-answer G-bg-white'>
            <Image className='tips-image' src={answer}></Image>
            <View className='tips-title G-Fsize-14 G-Fweight-500 G-Mt-20 color-all'>
              还无人回答，快来当第一个吃螃蟹的人
            </View>
            <View className='tips-btn G-Fsize-16' onClick={this.goAnswerRouter}>
              我来回答
            </View>
          </View>
        </View>
      );
    } else {
      linkEl = (
        <View className='bd'>
          {this.state.answerList.map((item, index) => (
            <Answer
              key={item.id}
              title={item.title}
              currentIndex={index}
              id={item.id}
              answer_info={item.answer_info}
              hasUserInfo
              from='des'
              extClass='no-title'
              onChangeAttention={this.childFollow.bind(this)}
            />
          ))}
        </View>
      );
    }
    // 底部弹窗
    if (mark.type == "edit") {
      shareEl = (
        <View className='flex shareEl'>
          {shareConfigData.map(item => (
            <View className='flex' key={item.text}>
              <View
                className='main'
                onClick={
                  item.type == "edit"
                    ? this.editProblem.bind(this, question_id)
                    : this.deleteProblem.bind(this, question_id)
                }
              >
                <View className={item.viewName}>
                  <View
                    className={`iconfont G-color-white ${item.iconClass}`}
                  ></View>
                </View>
                <View className='G-Mt-10 G-Fsize-14 mask-text'>
                  {item.text}
                </View>
              </View>
            </View>
          ))}
        </View>
      );
    } else {
      // shareEl = (
      //   <View className="flex">
      //     <View className="main">
      //       <View className="main-wechat">
      //         <View className="iconfont iconweixin1 G-color-white">
      //           <Button openType="share" className="button-share"></Button>
      //         </View>
      //       </View>
      //       <View className="G-Mt-10 G-Fsize-14">微信</View>
      //     </View>
      //     <View className="main">
      //       <View className="main-moments">
      //         <Image className="image" src={pyq}>
      //           <Button  openType='share'  className='button-share'></Button>
      //         </Image>
      //       </View>
      //       <View className="G-Mt-10 G-Fsize-14">朋友圈</View>
      //     </View>
      //   </View>
      // );
    }
    // 状态
    statusEl = (
      <>
        {statusConfigData.map(
          item =>
            item.show == true && (
              <View
                className='share-btn'
                onClick={this.tabStatus.bind(
                  this,
                  item,
                  question_id,
                  this.state.desData.title
                )}
              >
                <View className={`iconfont ${item.iconPath}`}></View>
                <Text className='text G-Fsize-14'>{item.text}</Text>
              </View>
            )
        )}
      </>
    );
    let {
      title,
      video_url = "",
      images,
      tags,
      is_change,
      city_data
    } = this.state.desData;
    return (
      <View className='index'>
        <View className='G-bg-white hd'>
          <View className='problem-tags'>
            <View className='tags-l'>
              <View className='G-inline-block'>
                <View className='iconfont address-icon icondingwei G-Fsize-14 G-inline-block'></View>
                <Text className='address color-all G-inline-block G-Fsize-14 G-Mr-10'>
                  {city_data.name}
                </Text>
              </View>
              {tags.map((item, index) => (
                <Text
                  className='tags color-all G-inline-block G-Fsize-14'
                  key={index}
                >
                  {item.name}
                </Text>
              ))}
            </View>
            {is_change == 1 && (
              <View className='tags-r G-text-c'>
                <View
                  className='G-Fsize-12 G-Fweight-500'
                  onClick={this.editTags.bind(this, question_id)}
                >
                  <View className='fl-row-center'>
                    <View className='G-Fsize-14 G-Fweight-500 wz'>
                      {this.state.desData.tags.length > 0
                        ? "修改标签"
                        : "打标签"}
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
          <View className='problem-details'>
            <View className='problem-details-text G-Fsize-16 G-Fweight-500'>
              {title}
            </View>
          </View>
          <View className='problem-content'>
            <View className='problem-image'>
              {video_url != "" && (
                <View className='video-main problem-image-child'>
                  <Video
                    id='video'
                    className='video'
                    src={video_url}
                    object-fit='cover'
                    controls={isControls}
                    direction='0'
                    showPlayBtn={false}
                    showCenterPlayBtn={false}
                    showFullscreenBtn={false}
                    onPlay={() => {
                      this.setState({ isPlay: false, isControls: true });
                    }}
                    onPause={() => {
                      this.setState({ isPlay: true, isControls: false });
                    }}
                    onEnded={() => {
                      this.setState({ isPlay: true, isControls: false });
                      let videoplay = Taro.createVideoContext("video");
                      videoplay.exitFullScreen();
                    }}
                    onFullscreenChange={this.changes.bind(this)}
                  />
                  {video_url != "" && isPlay ? (
                    <>
                      <Image
                        className='play'
                        src={play}
                        onClick={this.IconPlay.bind(this)}
                      ></Image>
                    </>
                  ) : null}
                </View>
              )}
              {images.length > 0 && (
                <>
                  {images.map(item => (
                    <Image
                      className='image-list problem-image-child'
                      onClick={this.previewImageFn.bind(this, item, images)}
                      src={item}
                      key={item}
                    ></Image>
                  ))}
                </>
              )}
            </View>
          </View>
          <View className='problem-share'>
            <View className='share-btn'>
              <Button openType='share' className='button-share'></Button>
              <View className='iconfont iconfenxiang'></View>
              <Text className='text G-Fsize-14'>分享</Text>
            </View>
            {statusEl}
          </View>
        </View>
        {linkEl}
        {/* 弹窗 */}
        {mark.status && (
          <View className='mask-details' catchtouchmove='true'>
            <View className='mask-details-content'>
              <View className='details-title'>
                <Text className='G-Fsize-16 G-color-333 G-Fweight-500'>
                  {mark.title}
                </Text>
                <View
                  className='iconfont iconguanbi icon-close G-Fsize-14 G-color-999'
                  onClick={this.tabMark.bind(this, {
                    name: "",
                    type: "",
                    show: false
                  })}
                ></View>
              </View>
              <View className='details-main'>{shareEl}</View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default Index;
