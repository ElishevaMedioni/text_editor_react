import React, { Component } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

class TextEditor extends Component {
    //this.MyKeyboard = this.MyKeyboard.bind(this);
  state = {
    editorState: EditorState.createEmpty(),
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    //console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    return (
      <div>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={this.onEditorStateChange}
        />
        <MyKeyboard />
      </div>
    );

  }
}

class MyKeyboard extends Component {
    onChange = (input) => {
        console.log("Input changed", input);
      }
    
      onKeyPress = (button) => {
        console.log("Button pressed", button);
      }
    
      render(){
        return (
          <Keyboard
            onChange={this.onChange}
            onKeyPress={this.onKeyPress}
          />
        );
      }    
}

export default TextEditor;