import _isFunction from 'lodash/isFunction';
import Taro from '@tarojs/taro';

export default function withComponent(Component) {
  class WithLogin extends Component {
    constructor(props) {
      super(props);
    }
    handlerGobackClick() {
      if (_isFunction(super.handlerGobackClick)) {
        super.handlerGobackClick();
      } else {
        const pages = Taro.getCurrentPages();
        if (pages.length >= 2) {
          Taro.navigateBack({
            delta: 1
          });
        } else {
          Taro.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    }
    handlerGohomeClick() {
      Taro.switchTab({
        url: '/pages/index/index'
      });
    }
  }
  return WithLogin;
}