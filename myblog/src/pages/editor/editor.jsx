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
class Editor extends Component{
  constructor(props){
    super(props);
  }
  
  componentDidMount(){
    bootstrapp();
    markdowniitt();
    webuploadtemp();
    editor(window||global);
    extf();
    marked.call(window||global);
    let edit = global.Editor;
    let editorobj = new edit();
    editorobj.render();
  }
  render(){
    return (
      <div className='editor-contain'>
        <textarea></textarea> 
        <div className='editor_buttons'>
                            <input type="submit" className='span-primary submit_btn' data-loading-text="提交中"
                                   value="提交"/>
                        </div> 
      </div>
    )

  }

}
export default Editor;
