import React, { Component } from "react";
import { View, Image, Button } from "@tarojs/components";
import enterHouse from "./enter_house.png";
import enterHouse2 from"./enter_house2.png";
import hand from "./hand.png";
import card from "./card.png";
import "./index.scss";

class ActiveAddHouse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertStep: 1
    }
  }

  alertShowFn() {
    this.props.fnData(!this.props.alertShow)
    this.setState({
      alertStep: 1
    })
  }
  changeStep() {
    this.setState({
      alertStep: 2
    })
  }
  render() {
    let { alertShow = false } = this.props;
    return (
      <View>
        {/* 加群引导 */}
        {alertShow && <View className='alert'>
          <View className='bg-black' onClick={this.alertShowFn.bind(this)}></View>
          <View className='step'>
            <View className='tit'>进入客服消息后，点击右下角快捷图片，再点击进群连接</View>
            {this.state.alertStep == 1 &&
              <View>
                <View className='img-box'>
                  <Image className='img1 img' src={enterHouse} />
                  <Image className='hand' src={hand} />
                </View>
                <View className='next btn' onClick={this.changeStep.bind(this)}>明白了，下一步</View>
              </View>
            }
            {this.state.alertStep == 2 &&
              <View>
                <View className='img-box'>
                  <Image className='img1 img' src={enterHouse2} />
                  <Image className='hand hand2' src={hand} />
                </View>
                <View className='enter btn' >明白！点我进群
                <Button
                  className='true-btn'
                  openType='contact'
                  onContact=''
                  showMessageCard='true'
                  sendMessageTitle="'不要点击！稍等一会，下面才是进群链接'"
                  sendMessagePath='/pages/index/index'
                  sendMessageImg={card}
                ></Button>
                </View>
              </View>
            }
          </View>

        </View>

        }
      </View>
    );
  }
}

export { ActiveAddHouse };
