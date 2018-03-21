import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { is, fromJS } from 'immutable';
import {config} from '../../config';
import Api from '../../api/api';
export class Sidebar extends Component{
  constructor(props){
    super(props);
    this.state = {
      themeCount: 0,
      commentList: [],
      viewList: [],
      imgSrc: ''
    };
  }
  async initGetData(){
    let promises = [Api.getThemeCount(), Api.getCommentMost(), Api.getViewMost(), Api.getIconSrc()];
    let result = await Promise.all(promises);
    this.setState({
      themeCount: result[0].data,
      commentList: result[1].data,
      viewList: result[2].data,
      imgSrc: result[3].data
    });
  }
  componentWillMount(){
    this.initGetData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
  }

  render(){
    let img = null;
    if(this.state.imgSrc){
      img = <img src={config.url+this.state.imgSrc}  alt='头像' />;
    }
    return (
      <div>
        <div>
          <p>作者简介</p>
          {img }
          <p>文章数量{this.state.count}</p>
        </div>

        <div>
          <p>浏览最多的主题</p>
          {
            this.state.viewList.length ? <ul>
                {
                  this.state.viewList.map((item, index) => {
                    return <li key={index}><Link to={"/theme/"+item._id}>{item.title}</Link></li>
                  })
                }
              </ul>:''
          }
        </div>

        <div>
          <p>评论最多的主题</p>
          {
            this.state.commentList.length ? <ul>
                {
                  this.state.commentList.map((item, index) => {
                    return <li key={index}><Link to={"/theme/"+item._id}>{item.title}</Link></li>
                  })
                }
              </ul>:''
          }
        </div>
      </div> 
  
    )

  }

}

