import React, {Component} from 'react';
import {is, fromJS} from 'immutable';
import API from '../../api/api';
import {Head} from '../components/head';
import ReactMarkdown from 'react-markdown';
//import {Editor, EditorState} from 'draft-js';
//import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
//import MarkdownEditor from 'react-markdown-editor';
import PublicHeader from '../components/header/header';
import Editor from '../editor/editor';
import './theme.scss';
//let MarkdownEditor = require('react-markdown-editor').MarkdownEditor;

/*let TestComponent = React.createClass({
    render: function() {
        return (
            <MarkdownEditor initialContent="Test" iconsSet="font-awesome"/>
        );
    }
});
class EditReactMD extends Component{
    render() {
        return (
            <MarkdownEditor initialContent="Test" iconsSet="font-awesome"/>
        );
    }
}*/
class Theme extends Component {
    constructor(props) {
        super(props);
        this._id = props.match.params.id;
        this.loginStatus = false;
        this.state = {
            theme: {},
            reply: [],
            ans: '呵呵'
        };
        console.log(global, window);
    }

    getTheme = async () => {
        let result = await API.getTheme({_id: this._id});
        this.setState({theme: result.data[0], reply: result.data[1]});
    }

    componentWillMount() {
        this.getTheme();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }

    handleAnsChange(value) {
        //this.setState({ans: value});
    }

    render() {
        let self = this;
        let toolbar = null;
        let createat = new Date(this.state.theme.create_at).toLocaleDateString();
        let updateat = new Date(this.state.theme.update_at).toLocaleDateString();
        if (this.loginStatus) {
            toolbar = <p><span>删除</span><span>编辑</span><span>{this.state.theme.secret ? '取消隐藏' : '隐藏'}</span></p>;
        }
        let modules = {
            toolbar: [
                [{'header': [1, 2, false]}],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image'],
                ['clean']
            ],
        };

        let formats = [
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image'
        ];
        return (
            <div className="theme-container">
                <PublicHeader title='文章'/>
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
                        <ReactQuill value={this.state.ans} modules={modules} formats={formats}
                                    onChange={this.handleAnsChange.bind(this)}>
                            <div className="my-editing-area"/>
                        </ReactQuill>
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
