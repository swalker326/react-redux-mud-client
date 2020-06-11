import React, {useEffect, useState} from 'react'
import {createMarkup} from './MUDClient';
import { animateScroll } from "react-scroll";

const HistoryEntry = (props) => {
  return (
    <li
      data-id={props.id}
      data-type={props.entry.type}
      dangerouslySetInnerHTML={createMarkup(props.entry)}
    ></li>
  )
}

const HistoryWindow = (props) => {
  const [showScrollToBottom, setShowScrollToBottom] = useState(true);
  
  const scrollToBottom = (containerId) => {
    animateScroll.scrollToBottom({
      containerId
    }, { smooth: "linear" });
    setShowScrollToBottom(false);
  }
  const checkScrollPosition = () => {
    const scrollDiff = this.$HistoryWindow.scrollHeight - this.$HistoryWindow.scrollTop;
    scrollDiff >= 1500 ? setShowScrollToBottom(true) : setShowScrollToBottom(false);
  }
  const scrollButton = () => {
    return <button onClick={() => scrollToBottom('HistoryWindow')} style={{position: 'absolute', alignSelf: 'center'}}>Scroll To Bottom</button>
  }
  useEffect(() => {
    this.$HistoryWindow.scrollTop = 500000
    checkScrollPosition();
  },[props,showScrollToBottom])
  const entries = props.historyEntries
  const listEntries = entries.map(function (entry, i) {
    return (
      <HistoryEntry
        key={entry.id}
        id={entry.id}
        entry={entry}
      />
    )
  }

  )
  return (
    <ul className='HistoryWindow' 
      id='HistoryWindow'
      ref={(ul) => { this.$HistoryWindow = ul }}
      onDoubleClick={this.handleDoubleClick}
    >
      {showScrollToBottom ? scrollButton() : "null"}
      {listEntries}
    </ul>
  )
}

export default HistoryWindow;