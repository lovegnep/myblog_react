import React, { Component } from 'react';
import editor from './editorjs';
import marked from './marked';
import './editor.css';

class Editor extends Component{
  constructor(props){
    super(props);
  }
  
  componentDidMount(){
    editor(window||global);
    marked.call(window||global);
    let edit = global.Editor;
    let editorobj = new edit();
    editorobj.render();
  }
  render(){
    return (
      <div className="editor_contain">
        <textarea></textarea>  
      </div>
    )

  }

}
export default Editor;
