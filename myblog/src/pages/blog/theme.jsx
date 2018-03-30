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
        this.state = {
            theme: {},
            reply: [],
            ans: '呵呵'
        };
    }

    getTheme = async () => {
        let result = await API.getTheme({_id: this._id});
        this.setState({theme: result.data[0], reply: result.data[1]});
    }

    componentDidMount() {
        this.getTheme();
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
    render() {
        let self = this;
        let toolbar = null;
        let createat = new Date(this.state.theme.create_at).toLocaleDateString();
        let updateat = new Date(this.state.theme.update_at).toLocaleDateString();
        if (this.loginStatus) {
            toolbar = <p className="tttt">
                <span onClick={self.deleteTheme.bind(self)} className="iconfont dele"></span>
                <span onClick={self.editTheme.bind(self)} className="iconfont editt"></span>
                <span onClick={self.handleSecret.bind(self)} className={this.state.theme.secret ? "iconfont unsecret" : "iconfont secret"}>
                </span></p>;
        }

        return (
            <div className="theme-container">
                <PublicHeader title='文章' loginStatus={this.loginStatus} />
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
                                return <div className="commentItem" key={index}>
                                    <span className="lou">{item.lou}楼</span><span
                                    className="createTime">创建时间{new Date(item.create_at).toLocaleDateString()}</span>
                                    <p className="content">{item.content}</p>
                                    <div className="interaction">
                                        <a><span className="iconfont noup">{item.ups}</span></a>
                                        <a><span className="iconfont nodown"></span></a>
                                        <a><span className="iconfont ans"></span></a>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <div>
                        <p className="ansHead">添加回复</p>
                    </div>
                    <div className="edit_draft">
                      <Editor />
                    </div>
                    <div className="answer">
                        <span className="iconfont commentans pos"></span>
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
