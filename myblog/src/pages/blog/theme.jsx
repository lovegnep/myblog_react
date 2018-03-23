import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { is, fromJS } from 'immutable';
import API from '../../api/api';
import {Sidebar} from '../components/sidebar';
import {Head} from '../components/head';
import {Footer} from '../components/footer';
import ReactMarkdown from 'react-markdown';
import PublicHeader from '../components/header/header';

class Theme extends Component{
  constructor(props){
    super(props);
    this._id = props.match.params.id;
    this.loginStatus = false;
    this.state = {
      theme:{},
      reply:[]
    };
  }
  getTheme = async () => {
    let result = await API.getTheme({_id:this._id});
    this.setState({theme:result.data[0], reply:result.data[1]});
  }

  componentWillMount(){
      this.getTheme();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
  }

  render(){
    let self = this;
    let toolbar = null;
    let createat = new Date(this.state.theme.create_at).toLocaleDateString();
    let updateat = new Date(this.state.theme.update_at).toLocaleDateString();
    if(this.loginStatus){
    toolbar = <p><span>删除</span><span>编辑</span><span>{this.state.theme.secret ? '取消隐藏' : '隐藏'}</span></p>;
    }
    return (
      <div>
       <PublicHeader title='文章' />
        <div>
          <div>
              <p>{this.state.theme.title}</p>
              {toolbar} 
              <span>创建时间{createat}</span><span>更新时间{updateat}</span>
<span>浏览次数{this.state.theme.visit_count}</span><span>回复次数{this.state.theme.reply_count}</span>
          </div>
         <div>
          <ReactMarkdown source={this.state.theme.content} /> 
         </div>
         <div>
         </div>
          {
            this.state.reply.map(function(item, index){
              return <div key={index} >
                <span>{item.lou}楼</span>
                <p>{item.content}</p>
                <p><span>{item.ups}</span><span>创建时间{new Date(item.create_at).toLocaleDateString()}</span></p>
              </div>
            })
          }
        </div>
      <Footer />
      </div> 
  
    )

  }

}
export default Theme;
