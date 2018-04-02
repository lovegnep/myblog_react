import React, {Component} from 'react';
import {is, fromJS} from 'immutable';
import {NavLink, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import API from '../../../api/api';
import LinesEllipsis from 'react-lines-ellipsis';
import {Link} from 'react-router-dom';
import './block.scss';

class Block extends Component {
    static propTypes = {
        themeList: PropTypes.any,
        loginStatus:PropTypes.any
    }


    // css动画组件设置为目标组件
    FirstChild = props => {
        const childrenArray = React.Children.toArray(props.children);
        return childrenArray[0] || null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }

    render() {
        let self = this;
        let loginStatus = (!self.props.loginStatus) ? false : true;
        let items = this.props.themeList.map(function(item,index){                        return <Link key={index}  to={{pathname:'theme/' + item._id,state:{loginStatus:loginStatus}}}>
                                        <LinesEllipsis className="common-themelist" text={item.title} maxLine='1' ellipsis='...' trimRight
                                                       basedOn='letters'/>
                                    </Link>

                      });
         if(!this.props.themeList || this.props.themeList.length < 1){
            items = <p className="noans">无搜索结果</p>;
         }
        return (
               <div className="searchblock">
                
                  <ReactCSSTransitionGroup
                    transitionName="nav"
                    transitionEnterTimeout={1000}
                    transitionLeaveTimeout={1000}>
                    <p className="searchres">搜索结果</p>
                    {items}
                   </ReactCSSTransitionGroup>
               </div>
        );
    }
}

export default withRouter(Block)
