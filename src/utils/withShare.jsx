
import { connect } from '@tarojs/redux';


const defaultOpts = {
  path:'pages/index/index',
  title:'默认标题',
  imageUrl:'',
}

function withShare({path=defaultOpts.path,title=defaultOpts.title,imageUrl=defaultOpts.imageUrl} = defaultOpts) {
  

  return function demoComponent(Component) {      
    // redux里面的用户数据
    @connect(({ user }) => ({
      userInfo: user.userInfo
    }))
    class WithShare extends Component {
      async componentWillMount() {
        wx.showShareMenu({
          withShareTicket: true
        });

        if (super.componentWillMount) {
          super.componentWillMount();
        }
      }

      // 点击分享的那一刻会进行调用
      onShareAppMessage() {
        // const { userInfo } = this.props;

        // 每条分享都补充用户的分享id
        // 如果path不带参数，分享出去后解析的params里面会带一个{''： ''}
        // const sharePath = `${path}&shareFromUser=${userInfo.shareId}`; 

        return {
          title: title ,
          path: path,
          imageUrl: imageUrl
        };
      }

      render() {
        return super.render();
      }
    }

    return WithShare;
  };
}

export default withShare;