import React, { Component } from 'react';
import editor from './editorjs';
import marked from './marked';
import webuploadtemp from './webuploader.withoutimage.js';
import extf from './ext.js';
import markdowniitt from './markdownit.js';
import bootstrapp from './bootstrap.js';
import './bootstrap.css';
import './editor.css';
import './webuploader.css';
import './edit.scss';
class Editor extends Component{
  constructor(props){
    super(props);
    this.submit = props.cb;
    this.param1 = props.param;
    this.content = props.content;
    this.editorobj = null;
  }
  componentWillMount(){
    let textid = Date.now();
    textid = textid.toString();
    this.textid = textid;
  }  
  componentDidMount(){
    bootstrapp();
    markdowniitt();
    webuploadtemp();
    editor(window||global);
    extf();
    marked.call(window||global);
    let edit = global.Editor;
    this.editorobj = new edit({
       element: document.getElementById(this.textid)
    });
    this.editorobj.render();
  }

  handleSubmit(){
     let content = this.editorobj.codemirror.getValue();
     if(!content || content.length < 2){
       return alert('内容太短');
     }
     this.submit(content, this.param1);
  }
  render(){
    let self = this;
    return (
      <div className='editor-contain'>
        <textarea id={this.textid} defaultValue={this.content} />
        <div className='edit_buttons'>
           <span className="iconfont icon-send editbut" onClick={self.handleSubmit.bind(self)}></span>
        </div> 
      </div>
    )

  }

}
export default Editor;
