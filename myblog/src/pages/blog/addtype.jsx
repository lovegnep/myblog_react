import React, {Component} from 'react';
import {is, fromJS} from 'immutable';
import API from '../../api/api';
import './addtype.scss';
class Addtype extends Component {
    constructor(props) {
        super(props);
        this.cb = props.cb;
        this.typename = '';
    }

    getTypes = async ()=>{
      let result = await API.getTypeList();
      this.setState({typeList: result.data});
    }
    componentWillMount() {
    }

    componentDidMount() {
    }


    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }

    handleClickButton(type) {
       if(type === 2){
         if(this.typename.length < 2){
            return alert('名称太短');
         }
       }
       this.cb({event:type,typename:this.typename});
    }
    handleInput(e){
      this.typename = e.target.value;
    }
    render() {
        let obj = null;
        let self = this;
        if(this.props.isplay){
          obj = <div><div className="backpanel">
                     </div>
                     <div className="entity">
                <span className="typename">类别</span>
                <input type="text"  onChange={this.handleInput.bind(self)} />
                <p><button type="button" onClick={this.handleClickButton.bind(self,1)}>取消</button>
                <button type="button" onClick={this.handleClickButton.bind(self,2)}>新建</button></p>
              </div>
                </div>
        }
        return (<div className="addtype-contain">{obj}</div>)

    }

}

export default Addtype;
