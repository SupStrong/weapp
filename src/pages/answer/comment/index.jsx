import Taro,{getCurrentInstance} from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as UserInfo from "@/actions/userInfo";
import { View ,Image,Input} from "@tarojs/components";
import { API_COMMENT_LIST,API_COMMENT_SAVE } from "@/http/api/COMMENT";
import { showPopup, showLoading, shareWx,setRefrs } from "@/utils/index";
import { Blank } from "@/components/blank";
import "./index.scss";

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo.toJS(),
    isIphone:state.isIphone.toJS()
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
     page:1,
     listData:[],
     commentVal:'',
     keyHeight:0,
     params:{},
     onceRequest:true
    };
  }
 
  componentDidMount(){
  }
  componentDidShow() {
    this.setState({page:1,listData:[]})
    this.setState({params:getCurrentInstance().router.params})
    this.getListData()
  }
  onReachBottom() {
    if(this.state.page != 0){
        this.getListData()
    }
  }
  onPullDownRefresh (){
    setTimeout(() => {
      Taro.stopPullDownRefresh()
    }, 1000);
    this.setState({page:1,listData:[]})
    this.getListData()
  }
  onShareAppMessage() {
    shareWx();
    return {
      title: "全部评论",
      path: `pages/answer/comment/index`,
      imageUrl: ""
    };
  }
  async getListData() {
    if(!this.state.onceRequest){
      return false
    }
    this.setState({
      onceRequest:false
    })
    showLoading();
    let { data } = await API_COMMENT_LIST({
      page: this.state.page,
      answer_id:this.state.params.id
    });
    Taro.hideLoading();
    this.setState({
      listData: [...this.state.listData, ...data.items],
      page: data.next_page,
      onceRequest:true
    });
  }
  changeVal = (e)=>{
    this.setState({commentVal:e.detail.value})
  }
  async sendComment (){
    if(this.state.commentVal == '') {
      showPopup('请输入评论内容')
      return
    }
    showLoading();
    let { message,status } = await API_COMMENT_SAVE({
      unionid: this.props.userInfo.userInfo.unionid,
      answer_id:this.state.params.id,
      des:this.state.commentVal
    });
    
    Taro.hideLoading();
    if(!status){
      showPopup(message)
      return false;
    }
    setRefrs(["pages/qalist/index","pages/question/details/index","pages/answer/detail/index"])
    this.setState({commentVal:'',listData:[]})
    this.getListData()
  }
  render() {
    const { listData,keyHeight } = this.state;
    const isIphone = this.props.isIphone.isIphone;
     return (
      <View className={isIphone?'ipx':'pad-bot'}>
       <View className='ul'>
        {
          listData.map((item,index)=>
            <View key={index} className='comment-item'>
              <View className='comment-img'>
                <Image className='image' src={item.avatar} />
              </View>
              <View className='comment-content'>
                <View className='name'>{item.username}</View>
                <View className='content'>{item.des}</View>
                <View className='time'>{item.created_at}</View>
              </View>
            </View> 
          )
        }
       </View>
       {listData.length == 0 ?<Blank message='您还没有评论哦~' />:null}
       <View className={isIphone?'fot-ios':'fot-send'} style={{bottom:(keyHeight == 0) ? '0':keyHeight}}>
        <View className='btn fl-row-justy '>
          <Input onInput={this.changeVal}
            onFocus={(e)=>{
              isIphone?this.setState({keyHeight:e.detail.height - 34}):this.setState({keyHeight:e.detail.height})
            }}
            onBlur={()=>{
              this.setState({keyHeight:0})
            }}
            placeholder='评论千万条，就少您一条' 
            value={this.state.commentVal}
            adjustPosition={false}
          />
          <View className='send' onClick={this.sendComment.bind(this)}>发布</View>
        </View>
       </View>
      </View>
    );
  }
}

export default Index;
