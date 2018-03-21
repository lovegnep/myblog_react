import React, { Component } from 'react';
import Api from '../../api/api';
import './footer.css';
export class Footer extends Component{
  constructor(props){
    super(props);
    this.state = {
      viewCount: 0
    };

  }
  getViewCount = async() => {
    let result = await Api.getViewCount();
    this.setState({viewCount: result.data});
  }
  componentWillMount(){
    if(!this.state.viewCount){
      this.getViewCount();
    }
  }
  render(){
    return (
      <div className="footer">
        <p>访问量{this.state.viewCount} 沪ICP备17047617号</p>
      </div> 
  
    )

  }

}

