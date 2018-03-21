import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { is, fromJS } from 'immutable';
import API from '../../api/api';
import {Sidebar} from '../components/sidebar';
import {Head} from '../components/head';
import {Footer} from '../components/footer';

class Home extends Component{
  constructor(props){
    super(props);
    this.state = {
      themeList: [],
      type: [],
      curType: 'all'
    };
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
      <div>
        <Head />
        <Sidebar />
        <div> 
        {
          this.state.type.map(function(item, index){
            return <span name={item} key={index} onClick={self.handleClickType.bind(self)}>{item}</span>
          })
        }
        </div>
        <div>
          {
            this.state.themeList.map(function(item, index){
              return <div key={index} >
                <Link to={'theme/'+item._id}>{item.title}</Link>
                <span>{item.visit_count} / {item.reply_count}</span>
              </div>
            })
          }
        </div>
      <Footer />
      </div> 
  
    )

  }

}
export default Home;
