import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { is, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import {baseConfig} from '../../config';
import API from '../../api/api';
class Home extends Component{
  constructor(props){
    super(props);
    this.state = {
      themeList: [],
      type: {},
      curType: 'all'
    };
  }
  handleClickType(e){
    if(this.state.curType !== e.target.name){
      this.clickType(e);
    }
  }
  clickType = async e => {
    let result = await API.getThemeList({type: e.target.name});
    this.setState({themeList:result.data,curType: e.target.name});
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

    let keys = Object.keys(this.state.type) || [];
    return (
      <div>
        <div> 
        {
          keys.map(function(item, index){
            return <span name={item} key={index} onClick={this.handleClickType.bind(this)}>{this.state.type[item]}</span>
          })
        }
        </div>
        <div>
          {
            this.themeList.map(function(item, index){
              return <div key={index} >
                <Link to={'theme/'+item.id}>{item.name}</Link>
                <span>{item.viewCount} / {item.commentCount}</span>
              </div>
            })
          }
        </div>
      </div> 
  
    )

  }

}
export default Home;
