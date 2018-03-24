import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { is, fromJS } from 'immutable';
import API from '../../api/api';
import {Sidebar} from '../components/sidebar';
import {Head} from '../components/head';
import {Footer} from '../components/footer';
import PublicHeader from '../components/header/header';
import mixin, { padStr } from '../utils/mixin';
import LinesEllipsis from 'react-lines-ellipsis';
import './home.scss';

class Home extends Component{
  constructor(props){
    super(props);
    this.state = {
      themeList: [],
      type: [],
      curType: 'all'
    };
    let state = this.props.location.state;
    if(state && state.loginStatus){
      this.loginStatus = true;
    }else{
      this.loginStatus = false;
    }
    console.log('loginStatus:',this.loginStatus);
  }
  handleClickType(e){
    if(this.state.curType !== e.target.innerText){
      this.clickType(e);
    }
  }
  clickType = async e => {
    let result = await API.getThemeList({type: e.target.innerText});
    this.setState({themeList:result.data,curType: e.target.innerText});
  }
  getThemeList = async () => {
    let result = await API.getThemeList({type: this.state.curType});
    this.setState({themeList:result.data});
  }
  getTypes = async ()=>{
    let result = await API.getTypeList();
    this.setState({type: result.data});
  }

  componentWillMount(){
    let keys = Object.keys(this.state.type) || [];
    if(keys.length < 1){
      this.getTypes();
    }
    if(this.state.themeList.length < 1){
      this.getThemeList();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
  }

  render(){
    let self = this;
    return (
      <main className="home-container">
        <PublicHeader title="首页" loginStatus={this.loginStatus} />
        <div> 
        {
          this.state.type.map(function(item, index){
            return <span className="common-tab" name={item} key={index} onClick={self.handleClickType.bind(self)}>{item}</span>
          })
        }
        </div>
        <div>
          {
            this.state.themeList.map(function(item, index){
              return <div className="themelist" key={index} >
                <div className="tips">
                 <a className="common-num">阅读：{item.visit_count}   评论：{item.reply_count}</a> 
                </div>
                <div className="title">         
                <Link className="common-themelist" to={'theme/'+item._id}>
                 <LinesEllipsis text={item.title} maxLine='1' ellipsis='...' trimRight basedOn='letters' />
                </Link>
                </div> 
              </div>
            })
          }
        </div>
      <Footer />
      </main> 
  
    )

  }

}
export default Home;
