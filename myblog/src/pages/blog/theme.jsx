import React, {Component} from 'react';
import {is, fromJS} from 'immutable';
import API from '../../api/api';
import {Head} from '../components/head';
import {Footer} from '../components/footer';
import ReactMarkdown from 'react-markdown';
import PublicHeader from '../components/header/header';
import './theme.scss';
import Editor from '../editor/editor';

class Theme extends Component {
    constructor(props) {
        super(props);
        let state = props.location.state;
        this._id = props.match.params.id;
        if(state && state.loginStatus){
            this.loginStatus = true;
        }else{
            this.loginStatus = false;
        }
        this.upstate = new Map();
        this.downstate = new Map();
        this.state = {
            theme: {},
            reply: [],
            ans: '呵呵',
            curreply:0,
            upstate:new Map(),
            downstate:new Map(),
            loginStatus:this.loginStatus,
            isComment:false
        };
    }

    getTheme = async () => {
        let result = await API.getTheme({_id: this._id});
        this.setState({theme: result.data[0], reply: result.data[1]});
    }
    getLoginStatus = async () => {
        let result = await API.getLoginStatus();
        this.setState({loginStatus: result.data});
    }
    componentDidMount() {
        this.getTheme();
        this.getLoginStatus();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }

    handleAnsChange(value) {
        //this.setState({ans: value});
    }
    deleteTheme = async ()=>{
        let result = await API.deleTheme({_id: this._id});
        this.props.history.push({
            pathname:'/',
        });
    }
    secretTheme = async ()=>{
        let result = await API.secretTheme({_id: this._id});
        let updatedTheme = {...this.state.theme};
        updatedTheme.secret = !updatedTheme.secret;
        this.setState({theme:updatedTheme});
    }
    unsecretTheme = async ()=>{
        let result = await API.unsecretTheme({_id: this._id});
        let updatedTheme = {...this.state.theme};
        updatedTheme.secret = !updatedTheme.secret;
        this.setState({theme:updatedTheme});
    }
    editTheme(){
        this.props.history.push({
            pathname:'/edittheme',
            state:{
                theme:this.state.theme,
                loginStatus:this.loginStatus
            }
        });
    }
    handleSecret(){
        if(this.state.theme.secret){
            this.unsecretTheme();
        }else{
            this.secretTheme();
        }
    }
    addreply = async(value,replyid,lou)=>{
        let result = await API.addReply({_id:this._id,t_content:value,reply_id:replyid,lou:lou});
        let newreply = [];
        this.state.reply.forEach(function(item){
            let obj = {...item};
            newreply.push(obj);
        });
        newreply.push(result.data);

        this.setState({reply:newreply,curreply:0});
    }
    onSubmit(value, param) {
        if(!param){//直接对文章回复
            if(!value || value.length < 2){
                return alert('评论内容太短');
            }
            this.addreply(value);
        }else{//对评论进行回复
            let replyid = param;
            let lou = 0;
            for(let i = 0; i < this.state.reply.length; i++){
                if(this.state.reply[i]._id === replyid){
                    lou = i+1;
                }
            }
            this.addreply(value, replyid, lou);
        }
    }
    optup = async(replyid)=>{//点击踩
        let flag = this.state.upstate.get(replyid);
        let result = null;
        if(!flag){
            flag = 0;
        }
        if(flag === 0){
            result = await API.optReply({_id:replyid,act:1,flag:1});
        }else{
            result = await API.optReply({_id:replyid,act:1,flag:0});
        }
        let newupstate = new Map();//更新upstate
        this.state.upstate.forEach(function(value, key){
            newupstate.set(key,value);
        });
        let newreply = [];
        this.state.reply.forEach(function(item){
            let obj = {...item};
            if(obj._id === replyid){
                obj.ups = obj.ups+(flag === 0?1:-1);
            }
            newreply.push(obj);
        });
        newupstate.set(replyid, flag === 0?1:0);

        this.setState({upstate:newupstate,reply:newreply});
    }
    optdown = async(replyid)=>{//点击赞
        let flag = this.state.downstate.get(replyid);
        let result = null;
        if(!flag){
            flag = 0;
        }
        if(flag === 0){
            result = await API.optReply({_id:replyid,act:2,flag:1});
        }else{
            result = await API.optReply({_id:replyid,act:2,flag:0});
        }
        let newdownstate = new Map();
        this.state.downstate.forEach(function(value, key){
            newdownstate.set(key,value);
        });
        newdownstate.set(replyid, flag === 0?1:0);
        let newreply = [];
        this.state.reply.forEach(function(item){
            let obj = {...item};
            if(obj._id === replyid){
                obj.downs = obj.downs+(flag === 0?1:-1);
            }
            newreply.push(obj);
        });
        this.setState({downstate:newdownstate,reply:newreply});
    }
    optans = function(replyid){//点击回复图标
        if(this.state.curreply === replyid){
            this.setState({curreply:0});
        }else{
            this.setState({curreply:replyid});
        }
    }
    onoptreply(type,replyid){
        console.log("onoptreply:", type, replyid);
        switch(type){
            case 1:
                this.optup(replyid);
                break;
            case 2:
                this.optdown(replyid);
                break;
            case 3:
                this.optans(replyid);
                break;
            default:
                break;
        }
    }
    handleLoginout(){
        this.setState({loginStatus:false});
    }
    onClickComment(){
        let flag = this.state.isComment;
        this.setState({isComment:!flag});
        let $ = window.jquery;
        $('html,body').animate({scrollTop:$('.footer').offset().top}, 800);
    }
    render() {
        let self = this;
        let toolbar = null;
        let createat = new Date(this.state.theme.create_at).toLocaleDateString();
        let updateat = new Date(this.state.theme.update_at).toLocaleDateString();
        if (this.state.loginStatus) {
            toolbar = <p className="tttt">
                <span onClick={self.deleteTheme.bind(self)} className="iconfont dele"></span>
                <span onClick={self.editTheme.bind(self)} className="iconfont editt"></span>
                <span onClick={self.handleSecret.bind(self)} className={this.state.theme.secret ? "iconfont unsecret" : "iconfont secret"}>
                </span></p>;
        }

        return (
            <div className="theme-container">
                <PublicHeader title='文章' loginStatus={this.state.loginStatus} cb={this.handleLoginout.bind(this)} />
                <div>
                    <div>
                        <p className="title">{this.state.theme.title}</p>
                        {toolbar}
                        <div className="tips">
                            <span>创建时间{createat}</span><span>更新时间{updateat}</span>
                            <span>浏览次数{this.state.theme.visit_count}</span><span>回复次数{this.state.theme.reply_count}</span>
                        </div>

                    </div>
                    <div className="theme">
                        <ReactMarkdown source={this.state.theme.content}/>
                    </div>
                    <div className="comment">
                        <p className="commentHead">文章点评</p>
                        {
                            this.state.reply.map(function (item, index) {
                                let tmpp = null;
                                let uptmp = self.state.upstate.get(item._id);
                                if(!uptmp){
                                    uptmp = 0;
                                }
                                let downtmp = self.state.downstate.get(item._id);
                                if(!downtmp){
                                    downtmp = 0;
                                }
                                if(self.state.curreply === item._id){
                                    tmpp = <Editor cb={self.onSubmit.bind(self)} param={item._id}/>
                                }
                                return <div className="commentItem" key={index}>
                                    <span className="lou">{index+1}楼</span><span
                                    className="createTime">创建时间{new Date(item.create_at).toLocaleDateString()}</span>
                                    {
                                        item.lou&&<span className="atlou">{"@"+item.lou+'楼'}</span>
                                    }
                                    <p className="content">{item.content}</p>
                                    <div className="interaction">
                                        <a><span className={"iconfont "+ (uptmp === 0 ? "noup" : "hasup")} onClick={self.onoptreply.bind(self,1,item._id)}>{item.ups > 0 ? item.ups : ''}</span></a>
                                        <a><span className={"iconfont " + (downtmp === 0 ? "nodown" : 'hasdown')} onClick={self.onoptreply.bind(self,2,item._id)}>{item.downs > 0 ? item.downs : ''}</span></a>
                                        <a><span className={"iconfont " + (self.state.curreply === item._id ? "hasans" : "ans")} onClick={self.onoptreply.bind(self,3,item._id)}></span></a>
                                    </div>
                                    {
                                        tmpp
                                    }
                                </div>
                            })
                        }
                    </div>

                    {
                        this.state.isComment &&  <div>
                            <div>
                                <p className="ansHead">添加回复</p>
                            </div>
                            <div className="edit_draft">
                            <Editor cb={self.onSubmit.bind(self)} param={0}/>
                        </div></div>
                    }

                    <div className="answer">
                        <span onClick={this.onClickComment.bind(this)}
                              className={"iconfont " + (this.state.isComment ? "hascommentans" : "commentans")  + " pos"}></span>
                    </div>
                </div>
                <Footer/>
            </div>

        )

    }

}

/*
<EditReactMD initialContent={this.state.ans} iconsSet="font-awesome" onContentChange={this.handleAnsChange.bind(this)} />
*/
export default Theme;
