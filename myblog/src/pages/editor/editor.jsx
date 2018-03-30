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
    this.editorobj = null;
  }
  
  componentDidMount(){
    bootstrapp();
    markdowniitt();
    webuploadtemp();
    editor(window||global);
    extf();
    marked.call(window||global);
    let edit = global.Editor;
    this.editorobj = new edit();
    this.editorobj.render();
  }

  handleSubmit(){
     let content = this.editorobj.codemirror.getValue();
     if(!content || content.length < 2){
       return alert('内容太短');
     }
     this.submit(content);
  }
  render(){
    let self = this;
    return (
      <div className='editor-contain'>
        <textarea></textarea> 
        <div className='edit_buttons'>
           <span className="iconfont icon-send editbut" onClick={self.handleSubmit.bind(self)}></span>
        </div> 
      </div>
    )

  }

}
export default Editor;
