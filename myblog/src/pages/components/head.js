import React, { Component } from 'react';
import { Link } from 'react-router-dom';
export class Head extends Component{
  constructor(props){
    super(props);
    this.state = {
      loginStatus: false
    };
  }
  render(){
    let login = null;
    if(this.state.loginStatus){
      login = <span><Link to='/loginout'>登出</Link></span>;
    }else{
      login = <span><Link to='/login'>登陆</Link></span>;
    }
    return (
      <div>
        <p>好像吃肉</p>
        <p>
          <span>首页</span><span>关于</span><span>联系</span><span>搜索</span>
          {login}
        </p>
      </div> 
  
    )

  }

}

