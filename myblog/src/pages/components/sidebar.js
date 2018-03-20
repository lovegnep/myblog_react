import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { is, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import {baseConfig} from '../../config';
export class Footer extends Component{
  static propTypes = {
    count: PropTypes.number.isRequired,
    commentList: PropTypes.array.isRequired,
    viewList: PropTypes.array.isRequired,
    imgSrc:PropTypes.string.isRequired
  }
  componentDidMount(){
    if(!this.props.count){
      $.get(baseConfig.url+'count', function(result){
        this.props.count = result;
      });
      $.get(baseConfig.url+'commentList', function(result){
        this.props.commentList = result;
      });
      $.get(baseConfig.url+'viewList', function(result){
        this.props.viewList = result;
      });
      $.get(baseConfig.url+'imgSrc', function(result){
        this.props.imgSrc = result;
      });

    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
  }

  render(){
    return (
      <div>
        <div>
          <p>作者简介</p>
          {
            if(this.props.imgSrc){
              <img src={baseConfig.url+this.props.imgSrc} />
            }
          }
          <p>文章数量{this.props.count}</p>
        </div>

        <div>
          <p>浏览最多的主题</p>
          {
            this.props.viewList.length ? <ul>
                {
                  this.props.viewList.map((item, index) => {
                    return <li key={index}><Link to={"theme/"+item.id}></Link></li>
                  })
                }
              </ul>:''
          }
        </div>

        <div>
          <p>评论最多的主题</p>
          {
            this.props.commentList.length ? <ul>
                {
                  this.props.commentList.map((item, index) => {
                    return <li key={index}><Link to={"theme/"+item.id}></Link></li>
                  })
                }
              </ul>:''
          }
        </div>
      </div> 
  
    )

  }

}

