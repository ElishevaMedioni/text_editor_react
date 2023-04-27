
import React, { Component } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw,ContentState, Modifier } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './styles.css';

class TextEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    this.editor = React.createRef();
  }

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

  getContent = () => {
    return this.state.editorState.getCurrentContent().getPlainText();
  };

  handleClear = () => {
    this.setState({ editorState: EditorState.createEmpty() });
  };

  onChange = (newEditorState) => {
    this.setState({
      editorState: newEditorState
    });
  }
  

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
        <EditorButtons handleClick={this.handleButtonClick} handleClear={this.handleClear} getContent={this.getContent} editorState={this.state.editorState} onChange={this.onChange}/>
        
      </div>
    );
  }
}

class EditorButtons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEngKeyboard: true,
      isLowerCase: true,
      isUpperCase: false,
      isHebrewKeyboard: false,
    };
    this.handleSwitchKeyboard = this.handleSwitchKeyboard.bind(this);
    this.handleSwitchCase = this.handleSwitchCase.bind(this);
    this.handleClear = this.handleClear.bind(this);
    
  }

  handleBackspace = () => {
    const editorState = this.props.editorState;
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    // if there is not selected text, we remove the caracter before the cursor
    if (selection.isCollapsed()) {
      const blockKey = selection.getStartKey();
      const block = content.getBlockForKey(blockKey);
      const text = block.getText();
      const start = selection.getStartOffset();
      const end = selection.getEndOffset();
      if (start === 0 && end === 0) {
        // Do nothing if cursor is at the beginning of the editor
        return;
      }
      const textBefore = text.slice(0, start - 1);
      const textAfter = text.slice(end);
      //getting the text before the cursor and the text after the cursor
      const newContent = content.merge({
        blockMap: content.getBlockMap().set(
          blockKey,
          block.merge({
            text: textBefore + textAfter
          })
        ),
        selectionAfter: selection.merge({
          anchorOffset: start - 1,
          focusOffset: start - 1
        })
      });
      const newEditorState = EditorState.push(editorState, newContent, 'remove-range');
      this.props.onChange(newEditorState);
    } else {
      const newEditorState = EditorState.push(
        editorState,
        Modifier.removeRange(content, selection),
        'remove-range'
      );
      this.props.onChange(newEditorState);
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

  handleSwitchCase() {
    if (this.state.isLowerCase) {
      this.setState({isLowerCase: false, isUpperCase: true});
    } else {
      this.setState({isLowerCase: true, isUpperCase: false});
    } 
  }

  handleClear() {
    this.props.handleClear();
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
    const list_english_uppercase_row1 =['!','@','#','$','%','^','&','*','(',')'];
    const list_english_uppercase_row2 =['Q','W','E','R','T','Y','U','I','O','P'];
    const list_english_uppercase_row3 =['A','S','D','F','G','H','J','K','L'];
    const list_english_uppercase_row4 =['Z','X','C','V','B','N','M'];


    // check if the keyboard is english or hebrew and if is upper or lower case
    const row1 = this.state.isEngKeyboard ? (
      this.state.isLowerCase ? (
        list_english_row1.map((letter) => (
          <button key={letter} onClick={() => this.handleClick(letter)}>
            {letter}
          </button>
        ))
      ) : (
        list_english_uppercase_row1.map((letter) => (
          <button key={letter} onClick={() => this.handleClick(letter)}>
            {letter}
          </button>
        ))
      )
    ) : (
      list_english_row1.map((letter) => (
        <button key={letter} onClick={() => this.handleClick(letter)}>
          {letter}
        </button>
      ))
    );

    const row2 = this.state.isEngKeyboard ? (
      this.state.isLowerCase ? (
        list_english_row2.map((letter) => (
          <button key={letter} onClick={() => this.handleClick(letter)}>
            {letter}
          </button>
        ))
      ) : (
        list_english_uppercase_row2.map((letter) => (
          <button key={letter} onClick={() => this.handleClick(letter)}>
            {letter}
          </button>
        ))
      )
    ) : (
      list_hebrew_row2.map((letter) => (
        <button key={letter} onClick={() => this.handleClick(letter)}>
          {letter}
        </button>
      ))
    );

    const row3 = this.state.isEngKeyboard ? (
      this.state.isLowerCase ? (
        list_english_row3.map((letter) => (
          <button key={letter} onClick={() => this.handleClick(letter)}>
            {letter}
          </button>
        ))
      ) : (
        list_english_uppercase_row3.map((letter) => (
          <button key={letter} onClick={() => this.handleClick(letter)}>
            {letter}
          </button>
        ))
      )
    ) : (
      list_hebrew_row3.map((letter) => (
        <button key={letter} onClick={() => this.handleClick(letter)}>
          {letter}
        </button>
      ))
    );

    const row4 = this.state.isEngKeyboard ? (
      this.state.isLowerCase ? (
        list_english_row4.map((letter) => (
          <button key={letter} onClick={() => this.handleClick(letter)}>
            {letter}
          </button>
        ))
      ) : (
        list_english_uppercase_row4.map((letter) => (
          <button key={letter} onClick={() => this.handleClick(letter)}>
            {letter}
          </button>
        ))
      )
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
    const switchCaseLabel = this.state.isLowerCase ? 'Switch to Uppercase' : 'Switch to Lowercase';
    
    return (
      <div className="keyboard">
        <div className="keyboard-row">{row1}</div>
        <div className="keyboard-row">{row2}</div>
        <div className="keyboard-row">{row3}</div>
        <div className="keyboard-row">{row4}</div>
        <div className="keyboard-row">{row5}</div>
        <div className="toolbar">
          <button id="key-he" onClick={this.handleSwitchKeyboard}>{switchButtonLabel}</button>
          <button id="key-cap" onClick={this.handleSwitchCase}>{switchCaseLabel}</button>
          <button onClick={this.props.handleClear}>Clear All</button>
        </div>
      </div>
    );
  }
}

export default TextEditor;