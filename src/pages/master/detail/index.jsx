import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Image } from "@tarojs/components";
import { showPopup, showLoading, shareWx } from "@/utils/index";
import { API_USER_SHOW ,API_USER_ANSWER} from "@/http/api/USER";
import { API_ATTENTION } from "@/http/api/ATTENTION";
import { NoAnswer } from "@/components/question/noanswer";
import BlueV from "@/assets/images/common/blue_v.png";
import "./index.scss";

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS(),
  };
}

@connect(mapStateToProps)
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page:1,
      master_unionid:null,//工长unionID
      operate:null,
      answerList:[],
      InfoData:{
        is_attention:null,
        avatar:'',
        introduction:'',
        weChat_id:'',
        phone:''
      }
    };
  }
  componentDidMount() {
    let master_unionid = Taro.getCurrentInstance().router.params.unionid;
    this.setState({ master_unionid: master_unionid },()=>{
      this.getMasterInfo()
      this.getAnswerList()
    });
  }
  onReachBottom() {
    if (this.state.page == 0) {
      return false;
    }
    this.getAnswerList();
  }

  async getMasterInfo() {
    try {
      showLoading();
      const { data } = await API_USER_SHOW(
        {
          id: this.state.master_unionid,
          unionid: this.props.userInfo.userInfo.unionid || ""
        }
      );
      Taro.hideLoading();
      let { InfoData } = this.state;
      InfoData = data;
      this.setState({
        InfoData: InfoData
      });
      this.setState({
        operate: InfoData.is_attention
      });
      Taro.setNavigationBarTitle({
        title: InfoData.user_name
      })
    } catch (error) {
      showPopup("工长详情载入远程数据错误");
    }
  }
  
  async getAnswerList(){
    try {
      showLoading();
      let postData = {
        page: this.state.page,
        id: this.state.master_unionid,
        unionid: this.props.userInfo.userInfo.unionid || "",
        from:'chief'
      };
      const { data } = await API_USER_ANSWER(postData);
      Taro.hideLoading();
      let arr = [...this.state.answerList, ...data.items]
      this.setState({
        answerList: arr
      });
      this.setState({
        page: data.next_page
      });
    } catch (error) {
      showPopup("TA的回答载入远程数据错误");
    }
  }
  async operateFocus(master_id){
    try {
      if(master_id==this.props.userInfo.userInfo.unionid){
        showPopup('无法关注自己~')
        return false;
      }
      showLoading();
      
      let newInfoData={...this.state.InfoData};
      newInfoData.fans_num=this.state.operate==1 ?newInfoData.fans_num*1-1:newInfoData.fans_num*1+1
      let postData = {
        type:'person',
        id: this.state.InfoData.wx_user_id,
        unionid:this.props.userInfo.userInfo.unionid,
        operate: this.state.operate==1 ? 0:1
      };
      const {} = await API_ATTENTION(postData);
      Taro.hideLoading();
      this.setState({
        InfoData:newInfoData,
        operate: this.state.operate==1 ? 0:1
        
      });
    } catch (error) {
      showPopup("关注载入远程数据错误");
    }
  }
  copy(){
    Taro.setClipboardData({
      data: this.state.InfoData.wechat_id,
      success: function () {
        showPopup('微信号复制成功')
      }
    })
  }
  call(){
    Taro.makePhoneCall({
      phoneNumber: this.state.InfoData.phone
    })
  }
  onShareAppMessage () {
    shareWx()
    return {
      title: '',
      path: '',
      imageUrl:'',
    }
  }
  render() {
    const { InfoData ,answerList} = this.state;
    const AnswerList = answerList.map(item =>(
        <NoAnswer key={item.id} title={item.title} id={item.id} question_info={item.answer_info} eleClass='master-page' />
      )
    )
    return (
      <View className='content'>
        <View className='master-head'>
          <View className='master-head-bg'></View>
          <View className='master-head-box fl-row-bet-end'>
            <Image className='master-head-image' src={InfoData.avatar}></Image>
            <View className={`focus-master fl-row-center ${this.state.operate?'active':''}`}  onClick={this.operateFocus.bind(this,InfoData.unionid)}>
              {!this.state.operate && <View className='iconfont iconxinjian'></View>}{this.state.operate?'已关注':'关注'}
            </View>
          </View>
          <View className='master-head-info'>
            <View className='master-head-title fl-row-leftNowrap'>
              <View className='master-head-name'>{InfoData.user_name}</View>
              {InfoData.is_verified == 1 && <View className='master-head-V'><Image className='blue-v' src={BlueV}></Image><Text className='word G-Fsize-12'>官方认证工长</Text></View>}
            </View>
            <View className='master-data fl-row-leftNowrap'>
              <View className='data-item fl-row-leftNowrap'><View className='master-num'>{InfoData.agree_num}</View>点赞数</View>
              <View className='data-item fl-row-leftNowrap'><View className='master-num'>{InfoData.fans_num}</View>粉丝数</View>
              <View className='data-item fl-row-leftNowrap'><View className='master-num'>{InfoData.answer_num}</View>回答数</View>
            </View>
            {InfoData.is_verified == 1 && <View className='master-contact fl-row-leftNowrap'>
              <View className='contact-item fl-row-leftNowrap' onClick={this.copy.bind(this)}><View className='iconfont iconweixin2'></View>{InfoData.wechat_id}</View>
              <View className='contact-item fl-row-leftNowrap' onClick={this.call.bind(this)}><View className='iconfont icondianhua'></View>{InfoData.phone}</View>
            </View>}
            {InfoData.is_verified == 1 && <View className='master-head-profile'>
              <View className='profile-title'>个人简介</View>
              <View className='profile-con'>{InfoData.introduction}</View>
            </View>}
          </View>
        </View>
        {InfoData.answer_num!=0 && <View className='ask-bd'></View>}
        {InfoData.answer_num!=0 && <View className='master-anwser'>
            <View className='anwser-title'>TA的回答({InfoData.answer_num})</View>
            <View className=''>
              {AnswerList}
            </View>
        </View>}

      </View>
    );
  }
}

export default Index;
