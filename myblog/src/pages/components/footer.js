import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { is, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import {baseConfig} from '../../config';
export class Footer extends Component{
  state = {
    viewCount: PropTypes.number.isRequired
  }
  componentDidMount(){
    if(!this.state.viewCount){
      $.get(baseConfig.url+'viewCount', function(result){
        this.setState({viewCount: result});
      });
    }
  }
  render(){
    return (
      <div>
        <p>访问量{this.state.viewCount} 沪ICP备17047617号</p>
      </div> 
  
    )

  }

}

