import Taro  from "@tarojs/taro";
import React, { Component } from "react";
import { View, Image } from "@tarojs/components";
import { API_STENCIL_LIST } from "@/http/api/STENCIL";
import { shareWx } from "@/utils/index";
import "./index.scss";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: []
    };
  }
  componentDidMount() {
    this.getListData();
  }

  componentWillUnmount() {}

  componentDidShow() {
  }

  componentDidHide() {}
  onShareAppMessage() {
    shareWx()
    return {
      title: "防坑模板",
      path: `pages/stencil/index/index`,
      imageUrl: ""
    };
  }
  async getListData() {
    let { data } = await API_STENCIL_LIST();
    this.setState({ listData: data });
  }

  godes(id) {
    Taro.navigateTo({
      url: `/pages/stencil/des/index?id=${id}`
    });
  }
  render() {
    const { listData } = this.state;
    return (
      <View className='index'>
        {listData.map((item) => (
          <View className='bd-con' key={item.id}>
            <Image className='bg-img' src={item.bg_img} />
            <View className='des-con'>
              <View
                className='bd-con-left'
                onClick={this.godes.bind(this, item.id)}
              >
              </View>
              <View className='bd-con-right'>
                {item.items.map(samllItem => (
                  <View
                    className='el-item'
                    key={samllItem.id}
                    onClick={this.godes.bind(this, samllItem.id)}
                  ></View>
                ))}
              </View>
            </View>
          </View>
        ))}
        <View className='ft'>防坑模板，配合搜索希望可以帮助到您</View>
      </View>
    );
  }
}

export default Index;
