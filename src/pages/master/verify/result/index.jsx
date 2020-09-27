import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View,  Text} from "@tarojs/components";
import * as UserInfo from "@/actions/userInfo";
import { setRefrs } from "@/utils/index";
import "./index.scss";

let questionId = '';

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
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if(Taro.getCurrentInstance().router.params.question_id){
      questionId = Taro.getCurrentInstance().router.params.question_id
    }
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  goMine(){
    
    if(questionId==''){
      Taro.switchTab({
        url: '/pages/mine/index'
      });
      return false;
    }
    setRefrs(["pages/qalist/index", "pages/question/details/index"]);
    Taro.reLaunch({
      url: `/pages/question/details/index?id=${questionId}`,
    });
  }
  render() {
    return (
      <View className='index'>
        <View className='hd'>
          <View className='iconfont iconshenqingtongguo'></View>
          <Text className='des'>个人信息提交成功！</Text>
        </View>
        <View className='bd'>
          您的个人信息已经提交，我们将对您进行电话回访，回访中，会提出一些专业问题，来确定您的行业经验与资质。通过后，您的联系方式将展示在产品中。
        </View>
        <View className='ft' onClick={this.goMine.bind(this)}>确定</View>
      </View>
    );
  }
}

export default Index;
