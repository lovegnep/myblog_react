import React, {Component} from 'react';
import {is, fromJS} from 'immutable';
import API from '../../api/api';
import {Sidebar} from '../components/sidebar';
import {Head} from '../components/head';
import {Footer} from '../components/footer';
import PublicHeader from '../components/header/header';
import './login.scss';

class Login extends Component {
    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            name: '',
            passwd: '',
            code: '',
            imgSrc: ''
        };
    }

    handleClickImg(e) {
        this.clickImg(e);
    }

    clickImg = async e => {
        let result = await API.getValidImg();
        this.setState({imgSrc: result.data});
    }

    componentWillMount() {
        this.clickImg();
    }

    login = async params => {
        let res = await API.login(params);
        //alert('登陆成功');
        this.props.history.push({
            pathname:'/',
            state:{
                loginStatus:true
            },
        });
    }
    submit = () => {
        let name = this.state.name;
        let passwd = this.state.passwd;
        let code = this.state.code;
        if (!name || name.length < 1) {
            return alert('用户名非法');
        }
        if (!passwd || name.length < 1) {
            return alert('密码非法');
        }
        if (!code || code.length < 4) {
            return alert('验证码非法');
        }
        let params = {name, pass: passwd, code};
        this.login(params);
    }

    handleInput = (type, e) => {
        let value = e.target.value;
        value = value.trim();
        switch (type) {
            case 'name':
                this.setState({name: value});
                break;
            case 'passwd':
                this.setState({passwd: value});
                break;
            case 'code':
                this.setState({code: value});
                break;
            default:
                ;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }

    render() {
        let self = this;
        return (
            <div className="login-container">
                <PublicHeader title="登陆"/>
                <div className="content">
                    <div className="mem">
                        <span className="iconfont member mm"></span>
                    </div>
                    <div>
                        <div>
                            <ul className="gul">
                                <li className="gli">
                                    <div className="nouse"><span className="nospan"></span></div>
                                    <input autoComplete="off" className="gin" onChange={this.handleInput.bind(this, 'name')}
                                           placeholder="帐号"/>
                                </li>
                                <li className="gli">
                                    <div className="nouse"><span className="nospan"></span></div>
                                    <input maxLength="16" type="password" className="gin" onChange={this.handleInput.bind(this, 'passwd')}
                                           autoCorrect="off" placeholder="密码"/>
                                </li>
                                <li className="gli">
                                    <div className="nouse"><span className="nospan"></span></div>
                                    <input maxLength="16" type="password" className="gin" onChange={this.handleInput.bind(this, 'code')}
                                           autoCorrect="off" placeholder="验证码"/>
                                    <img className="imgs" src={this.state.imgSrc} onClick={this.handleClickImg.bind(this)} alt='验证码'/>
                                </li>
                            </ul>
                            <div className="go" onClick={this.submit.bind(this)} > 登 录</div>
                        </div>

                    </div>
                </div>
            </div>

        )

    }

}
export default Login;
