import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { is, fromJS } from 'immutable';
import PropTypes from 'prop-types';

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

