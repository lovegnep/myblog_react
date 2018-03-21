import React, { Component } from 'react';

export class Head extends Component{
  state = {
    loginStatus: false
  }
  render(){
    return (
      <div>
        <p>好像吃肉</p>
        <p>
          <span>首页</span><span>关于</span><span>联系</span><span>搜索</span>
          ｛this.state.loginStatus ?  <span>登出</span> : <span>登陆</span>｝
        </p>
      </div> 
  
    )

  }

}

