import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {is, fromJS} from 'immutable';
import API from '../../api/api';
import {Sidebar} from '../components/sidebar';
import {Head} from '../components/head';
import {Footer} from '../components/footer';
import PublicHeader from '../components/header/header';
import mixin, {padStr} from '../utils/mixin';
import LinesEllipsis from 'react-lines-ellipsis';
import './home.scss';
import Editor from '../editor/editor';
class Home extends Component {
    constructor(props) {
        super(props);
        this.handleScroll = this.scrollHandler.bind(this)
        let state = this.props.location.state;
        let tmp = false;
        if (state && state.loginStatus) {
            tmp = true;
        } else {
            tmp = false;
        }
        this.state = {
            themeList: [],
            type: [],
            curType: '',
            loginStatus: tmp
        };
        this.loadflag = false;//动态加载标志
    }

    handleLoginOut() {
        this.initData();
        this.setState({loginStatus: false});
    }

    handleClickType(e) {
        if (this.state.curType !== e.target.innerText) {
            this.clickType(e);
        }
    }

    clickType = async e => {
        let result = await API.getThemeList({type: e.target.innerText});
        this.setState({themeList: result.data, curType: e.target.innerText});
    }
    getThemeList = async (obj) => {
        let result = await API.getThemeList(obj);
        this.setState({themeList: result.data});
    }
    mergeThemeList = async(obj)=>{
      let result = await API.getThemeList(obj);
      if(result.data.length < 1){
        this.loadflag = false;
        return;
      }
      let newthemelist = [];
      this.state.themeList.forEach(function(theme){
        let tmpobj = {...theme};
        newthemelist.push(tmpobj);
      });
      result.data.forEach(function(theme){
        let tmpobj = {...theme};
        newthemelist.push(tmpobj);
      });        
      this.setState({themeList:newthemelist});
      this.loadflag = false;
    }
    getTypes = async () => {
        let result = await API.getTypeList();
        this.setState({type: result.data});
    }

    initData() {
        this.getTypes();
        this.getThemeList();
        this.getLoginStatus();
    }
    scrollHandler(e){
        let $ = window.jquery;
        //滚动条所在位置的高度
        let totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
        //当前文档高度   小于或等于   滚动条所在位置高度  则是页面底部
        if(($(document).height()) <= totalheight+2) {
            //页面到达底部
            if(this.loadflag){
               return;
            }
            this.loadflag = true;
            this.mergeThemeList({tab:this.state.curtype, skip:this.state.themeList.length});
        }
    }
    componentDidMount() {
        this.initData();
        window.addEventListener('scroll', this.handleScroll);
    }
    componentWillUnmount(){
        window.removeEventListener('scroll',this.handleScroll);
    }
    getLoginStatus = async () => {
        let result = await API.getLoginStatus();
        this.setState({loginStatus: result.data});
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    updateTL(tab){//根据tab更新主题列表
        this.getThemeList({tab:tab});
        this.setState({curtype:tab});
    }
    render() {
        let self = this;
        return (
            <main className="home-container">
                <PublicHeader title="首页" typeobj={{curtype:this.state.curtype,typeList:this.state.type, updateTL:this.updateTL.bind(this)}} loginStatus={this.state.loginStatus} cb={this.handleLoginOut.bind(this)}/>
                <div>
                    {
                        this.state.themeList.map(function (item, index) {
                            return <div className="themelist" key={index}>
                                <div className="tips">
                                    <a className="common-num">阅读：{item.visit_count} 评论：{item.reply_count}</a>
                                </div>
                                <div className="title">
                                    <Link className="common-themelist" to={{pathname:'theme/' + item._id,state:{loginStatus:self.state.loginStatus}}}>
                                        <LinesEllipsis text={item.title} maxLine='1' ellipsis='...' trimRight
                                                       basedOn='letters'/>
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
