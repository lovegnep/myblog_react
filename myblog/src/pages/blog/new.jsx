import React, {Component} from 'react';
import {is, fromJS} from 'immutable';
import API from '../../api/api';
import {Head} from '../components/head';
import PublicHeader from '../components/header/header';
import Addtype from './addtype';
import './new.scss';
import Editor from '../editor/editor';
class NewTheme extends Component {
    constructor(props) {
        super(props);
    let state = this.props.location.state;
    let tmp = false;
    if(state && state.loginStatus){
      tmp = true;
    }else{
      tmp = false;
    }
        this.loginStatus = tmp;
        this.state = {
          typeList: [],
          isplay: false
        };
        this.title = '';
        this.tab = '';
    }

    getTypes = async ()=>{
      let result = await API.getTypeList();
      this.setState({typeList: result.data});
    }
    componentWillMount() {
        //this.getTypes();
    }

    componentDidMount() {
        this.getTypes();
    }


    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }

    handleTabChange(e) {
       let select = e.target;
       if(select.value == '新建分类'){
          this.setState({isplay: true});
       }else{
         this.tab = select.value;
       }
       
    }
    addType = async (obj)=>{
      let result = await API.addType(obj);
      this.setState({isplay: false});
      this.getTypes();
    }
    onAddType(obj){
       switch(obj.event){
           case 1:
                 this.setState({isplay: false});
                 break;
           case 2:
                 this.addType({tab:obj.typename});
                 break;
           default: break;
       }
    }
    onTitleChange(e){
      this.title = e.target.value;
    }
    addNewTheme = async (obj)=>{
      let result = await API.addNewTheme(obj);
      this.props.history.push({
            pathname:'/theme/'+result._id,
            state:{
                loginStatus:true
            },
        });
    }
    onSubmit(value){
      if(this.title == ''|| this.title.length < 5){
        return alert('标题不能少于5个字符');
      }
      if(this.tab == ''|| this.tab.length < 2){
        return alert('分类名称不能少于2个字符');
      }
      this.addNewTheme({tab:this.tab, title: this.title,t_content:value});
    }
    render() {
        let self = this;
        return (
            <div className="newtheme-container">
                <PublicHeader title='文章' loginStatus={true}/>
                <div className="newform">
                  <ul>
                    <li><span>标题</span>
                        <input onChange={self.onTitleChange.bind(self)} />
                    </li>
                    <li><span>分类</span>
                        <select name="tab"defaultValue="--请选择--" onChange={self.handleTabChange.bind(self)}>
                          <option>新建分类</option>
                          {
                             this.state.typeList.map(function(type, index){
                               return <option key={index}>{type}</option>
                              })
                           }
                        </select>
                    </li>                   
                  
                  </ul>
                  <div className="edit_draft">
                    <Editor cb={self.onSubmit.bind(self)} />
                  </div>
                </div>
              <Addtype isplay={this.state.isplay} cb={this.onAddType.bind(self)}  /> 
            </div>

        )

    }

}

export default NewTheme;
