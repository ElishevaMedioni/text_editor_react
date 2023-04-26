// import React, { Component } from 'react';

// class KeyboardInput extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       userInput: ''
//     };
//     this.handleInput = this.handleInput.bind(this);
//   }

//   handleInput(event) {
//     this.setState({userInput: event.target.value});
//   }

//   render() {
//     return (
//       <div>
//          <input type="text" onChange={this.handleInput} value={this.state.userInput} />
//       <button onClick={() => this.setState({userInput: this.state.userInput + 'a'})}>A</button>

//         <p>{this.state.userInput}</p>
//       </div>
//     );
//   }
// }

// export default KeyboardInput;

import React, { Component } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw,ContentState, Modifier } from "draft-js";
//import 'react-simple-keyboard/build/css/index.css';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import '/Users/Elish_1/test3/src/App.js';

class TextEditor extends Component {

  state = {
    editorState: EditorState.createEmpty(),
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  getKeyboardProps = () => {
    return {
      editorState: this.state.editorState,
      inputNode: () => this.editor,
      onChange: (editorState) => {
        this.setState({ editorState });
      },
    };
  };

  handleButtonClick = (letter) => {
    const currentContent = this.state.editorState.getCurrentContent();
    const currentSelection = this.state.editorState.getSelection();
    const newContent = Modifier.insertText(
      currentContent,
      currentSelection,
      letter
    );
    const newEditorState = EditorState.push(
      this.state.editorState,
      newContent,
      'insert-characters'
    );
    this.setState({
      editorState: newEditorState,
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
          ref={(element) => { this.editor = element; }}
        />
        <EditorButtons handleClick={this.handleButtonClick} />
        
      </div>
    );

  }
}

class EditorButtons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEngKeyboard: true,
      isHebrewKeyboard: false,
    };
    this.handleSwitchKeyboard = this.handleSwitchKeyboard.bind(this);
    
  }

  handleBackspace = () => {
    let value = this.props.value;
    if (typeof value !== 'undefined') {
      value = value.slice(0, -1);
      this.props.handleClick(value);
    }
  };
  
  
  

  handleClick = (letter) => {
    const { value } = this.props;
    if(letter === 'space') {
      letter = ' ';
    }
    if(letter === 'backspace') {
      this.handleBackspace();
      return;
    }
    if(letter === 'enter') {
      letter = '\n';
    }
    this.props.handleClick(letter);
  };
  
  

  handleSwitchKeyboard() {
    if (this.state.isEngKeyboard) {
      this.setState({isEngKeyboard: false, isHebrewKeyboard: true});
    } else {
      this.setState({isEngKeyboard: true, isHebrewKeyboard: false});
    }
  }

  render() {
    const list_english_row1 =['1','2','3','4','5','6','7','8','9','0'];
    const list_english_row2 =['q','w','e','r','t','y','u','i','o','p'];
    const list_english_row3 =['a','s','d','f','g','h','j','k','l'];
    const list_english_row4 =['z','x','c','v','b','n','m'];
    const list_english_row5 =['space','backspace','enter'];
    const list_hebrew_row2 =['ק','ר','א','ט','ו','ן','ם','פ'];
    const list_hebrew_row3 =['ש','ד','ג','כ','ע','י','ח','ל'];
    const list_hebrew_row4 =['ז','ס','ב','ה','נ','מ','צ'];

  
    const row1 = list_english_row1.map((letter) => (
      <button key={letter} onClick={() => this.handleClick(letter)}>
        {letter}
      </button>
    ));

    const row2 = this.state.isEngKeyboard ? (
      list_english_row2.map((letter) => (
        <button key={letter} onClick={() => this.handleClick(letter)}>
          {letter}
        </button>
      ))
    ) : (
      list_hebrew_row2.map((letter) => (
        <button key={letter} onClick={() => this.handleClick(letter)}>
          {letter}
        </button>
      ))
    );
    const row3 = this.state.isEngKeyboard ? (
      list_english_row3.map((letter) => (
        <button key={letter} onClick={() => this.handleClick(letter)}>
          {letter}
        </button>
      ))
    ) : (
      list_hebrew_row3.map((letter) => (
        <button key={letter} onClick={() => this.handleClick(letter)}>
          {letter}
        </button>
      ))
    );
    const row4 = this.state.isEngKeyboard ? (
      list_english_row4.map((letter) => (
        <button key={letter} onClick={() => this.handleClick(letter)}>
          {letter}
        </button>
      ))
    ) : (
      list_hebrew_row4.map((letter) => (
        <button key={letter} onClick={() => this.handleClick(letter)}>
          {letter}
        </button>
      ))
    );
    
    const row5 = list_english_row5.map((letter) => (
      <button key={letter} onClick={() => this.handleClick(letter)}>
        {letter}
      </button>
    ));

    const switchButtonLabel = this.state.isEngKeyboard ? 'Switch to Hebrew' : 'Switch to English';
    
    return (
      <div>

        <div className="keyboard-row">{row1}</div>
        <div className="keyboard-row">{row2}</div>
        <div className="keyboard-row">{row3}</div>
        <div className="keyboard-row">{row4}</div>
        <div className="keyboard-row">{row5}</div>
        <button onClick={this.handleSwitchKeyboard}>{switchButtonLabel}</button>

      </div>
    );
  }
}

export default TextEditor;