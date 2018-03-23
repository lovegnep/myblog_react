import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { is, fromJS } from 'immutable';
import API from '../../api/api';
import {Sidebar} from '../components/sidebar';
import {Head} from '../components/head';
import {Footer} from '../components/footer';
import PublicHeader from '../components/header/header';

class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      name: '',
      passwd: '',
      code: '',
      imgSrc: ''
    };
  }
  handleClickImg(e){
      this.clickImg(e);
  }
  clickImg = async e =>{
    let result = await API.getValidImg();
    this.setState({imgSrc: result.data});
  }

  componentWillMount(){
    this.clickImg();
  }
  login = async params=>{
    let res = await API.login(params);
    alert('登陆成功');
  }
  submit = ()=>{
   let name = this.state.name;
   let passwd = this.state.passwd;
   let code = this.state.code;
   if(!name || name.length < 1){
     return alert('用户名非法');
   }
   if(!passwd || name.length < 1){
     return alert('密码非法');
   }
   if(!code || code.length < 4){
     return alert('验证码非法');
   }
   let params = {name,pass:passwd,code};
   console.log(params); 
   this.login(params);
  }

  handleInput = (type, e) =>{
  let value = e.target.value;
  value = value.trim();
  switch(type){
    case 'name':
      this.setState({name: value});
      break;
    case 'passwd':
      this.setState({passwd: value});
      break;
    case 'code':
      this.setState({code: value});
      break;
    default:
      ;
  }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
  }

  render(){
    let self = this;
    return (
      <div>
        <PublicHeader title="登陆" />
        <div> 
                    <div>
            <span>用户名：</span>
            <input type="text" placeholder="请输入用户名" value={this.state.name} onChange={this.handleInput.bind(this, 'name')}/>
          </div>
          <div>
            <span>密码：</span>
            <input type="text" placeholder="请输入密码" value={this.state.passwd} onChange={this.handleInput.bind(this, 'passwd')}/>
          </div>
          <div>
            <span>验证码：</span>
            <input type="text" maxLength="13" placeholder="请输入验证码" value={this.state.code} onChange={this.handleInput.bind(this, 'code')}/>
           <img src={this.state.imgSrc} onClick={this.handleClickImg.bind(this)}  alt='验证码' />
           </div>
           <div>
             <button type='button' onClick={this.submit.bind(this)}>登陆</button>
           </div>       
        </div>
      <Footer />
      </div> 
  
    )

  }

}
export default Login;
