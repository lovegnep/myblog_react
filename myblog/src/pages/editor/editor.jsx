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
        <div className='edit_buttons'>
                            <input type="submit" className="subbut" data-loading-text="提交中"
                                   value="提交"/>
                        </div> 
      </div>
    )

  }

}
export default Editor;
