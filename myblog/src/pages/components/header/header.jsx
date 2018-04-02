import React, {Component} from 'react';
import {is, fromJS} from 'immutable';
import {NavLink, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import API from '../../../api/api';
import Block from './block';
import './header.scss';

class PublicHeader extends Component {
    static propTypes = {
        record: PropTypes.any,
        title: PropTypes.string.isRequired,
        //loginStatus: PropTypes.bool.isRequired,
        confirm: PropTypes.any,
    }

    state = {
        navState: false, //导航栏是否显示
        searchflag:false,
        blockStatus:false
    };

    // 切换左侧导航栏状态
    toggleNav = () => {
        this.setState({navState: !this.state.navState, blockStatus:false});
    }
    // css动画组件设置为目标组件
    FirstChild = props => {
        const childrenArray = React.Children.toArray(props.children);
        return childrenArray[0] || null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }

    loginout = async () => {
        let result = await API.loginout();
        this.props.cb();
    }

    handleTypeChange(e) {//选择tab时会调用父组件的cb
        let tab = e.target.value;
        this.props.typeobj.updateTL(tab);
        this.toggleNav();
    }
    handleClickSelect(e){
        e.stopPropagation();
    }
    handleClickSearch(type, e){
        e.stopPropagation();
        if(!type){
          this.setState({searchflag:true});
        }
    }
    handleClickCan(e){
        e.stopPropagation();
        this.setState({searchflag:false,blockStatus:false});
    }

    getSearchRes = async (obj)=>{
       let result = await API.search(obj);
       if(!result.data || result.data.length < 1){
         this.themeList = [];
       }else{
          this.themeList = result.data;
       }
       this.setState({blockStatus:true});
       
    }
    handleKeyup(e){
      if(e.keyCode === 13){//敲回车了
         if(!e.target.value || e.target.value.length < 1){
           return;
         }
         this.setState({blockStatus:false});
         this.getSearchRes({source:e.target.value});
      }
    }
    render() {
        let tar = this.props.loginStatus ? '/loginout' : '/login';
        let rat = this.props.loginStatus ? '登出' : '登陆';
        let tt = null;
        let self = this;
        let newtheme = null;
        let typeselect = null;
        let plselect = null;
        let searchdiv = null;

        if(this.state.searchflag){
           searchdiv = <div className="nav-link iconfont searchh" onClick={this.handleClickSearch.bind(this, true)}>
              <input onKeyUp={this.handleKeyup.bind(this)} className="searchinp" placeholder="输入标题或内容" />
              <a onClick={this.handleClickCan.bind(this)} className="searchbut">取消</a> 
           </div>
        }else{
               searchdiv = <div onClick={this.handleClickSearch.bind(this, false)} className="nav-link iconfont searchh">
                  搜索
           </div>
        }

        if (this.props.typeobj && this.props.typeobj.typeList && this.props.typeobj.typeList.length > 0) {
            if (!this.props.typeobj.curtype || this.props.typeobj.curtype == '') {
                plselect = <option selected disabled>{"--请选择--"}</option>
            }
            typeselect = <div className="nav-link iconfont typeicon" onClick={this.handleClickSelect.bind(this)}>
                <span>分类</span>
                <select className="nav-sel" onChange={this.handleTypeChange.bind(this)}>
                    { plselect}
                    <option>全部</option>
                    {
                        this.props.typeobj.typeList.map(function (item, index) {
                            if (item === self.props.typeobj.curtype) {
                                return <option selected key={index}>{item}</option>
                            } else {
                                return <option key={index}>{item}</option>
                            }

                        })
                    }
                </select>
            </div>
        }
        if (!this.props.loginStatus) {
            tt = <NavLink to={tar} exact className="nav-link iconfont loginin">
                { rat }
            </NavLink>
        } else {
            tt = <a className="nav-link iconfont loginout" onClick={this.loginout.bind(self)}>登出</a>
            newtheme = <NavLink to="/newtheme" exact className="nav-link iconfont newtheme">新建文章</NavLink>
        }
        return (
            <header className="header-container">
                <span className="header-slide-icon iconfont opt" onClick={this.toggleNav}></span>
                <span className="header-title">{this.props.title}</span>
                <ReactCSSTransitionGroup
                    component={this.FirstChild}
                    transitionName="nav"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}>
                    {
                        this.state.navState &&
                            <aside key='nav-slide' className="nav-slide-list" onClick={this.toggleNav}>
                                <NavLink to="/" exact className="nav-link iconfont homee">首页</NavLink>
                                {tt}
                                {searchdiv}
                                {newtheme}
                                {typeselect}
                            </aside>


                    }
                </ReactCSSTransitionGroup>
                {
                   this.state.blockStatus && <Block loginStatus={this.props.loginStatus} themeList={this.themeList} />
                }
            </header>
        );
    }
}

export default withRouter(PublicHeader)
