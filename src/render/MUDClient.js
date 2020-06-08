import React, { Component, PropTypes, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { submitUserInput, setMapPosition } from '../state/actions'
import MudOutputDecoder from './lib/MudOutputDecoder'
import UserInputBar from './UserInputBar'
import OutputWindow from './OutputWindow';
import MapWindow from './MapWindow';
import PlayerStatus from './PlayerStatus';


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
  useEffect(() => {
    this.$HistoryWindow.scrollTop = 99999999999
  })
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
      ref={(ul) => { this.$HistoryWindow = ul }}
      onDoubleClick={this.handleDoubleClick}
    >
      {listEntries}
    </ul>
  )
}

// class HistoryWindow extends Component {
//   constructor(props) {
//     super(props)
//     this.handleDoubleClick = this.handleDoubleClick.bind(this)
//   }
//   componentDidUpdate() {
//     this.$HistoryWindow.scrollTop = 99999999999
//   }
//   componentDidMount() {
//     this.$HistoryWindow.scrollTop = 99999999999
//   }
//   shouldComponentUpdate(nextProps, nextState) {
//     if( this.props.historyEntries !== nextProps.historyEntries ) {
//       return true
//     } else {
//       return false
//     }
//   }  
//   handleDoubleClick(event) {
//     this.props.handleHistoryWindowDoubleClick()
//   }
//   render() {
//     const entries = this.props.historyEntries
//     const listEntries = entries.map( function(entry, i) {
//       return (
//         <HistoryEntry 
//           key={entry.id}
//           id={entry.id}
//           entry={entry}
//         />
//       )
//     } 

//     )
//     return (
//       <ul className='HistoryWindow'
//         ref={ (ul) => {this.$HistoryWindow = ul} }
//         onDoubleClick={this.handleDoubleClick}
//       >
//         {listEntries}
//       </ul> 
//     )
//   }
//}

const MUDClient = (props) => {
  const [CurrentMap, setCurrentMap] = useState('');
  const lastEntry = props.historyEntries.length - 1;

  const [tabOneContent, setTabOneContent] = useState(["Sample Text"]);
  const [tabTwoContent, setTabTwoContent] = useState(["Sample Text"]);
  const [tabThreeContent, setTabThreeContent] = useState(["Sample Text"]);
  const [tabFourContent, setTabFourContent] = useState(["Sample Text"]);

  
  const [maxHp, setMaxHp] = useState(null);
  const [maxMana, setMaxMana] = useState(null);
  const [maxSpirit, setMaxSpirit] = useState(null);
  const [maxEndu, setMaxEndu] = useState(null);
  const [currentHp, setCurrentHp] = useState(null);
  const [currentMana, setCurrentMana] = useState(null);
  const [currentSpirit, setCurrentSpirit] = useState(null);
  const [currentEndu, setCurrentEndu] = useState(null);

  const playerStatus = {
    maxHp: maxHp,
    maxMana: maxMana,
    maxSpirit: maxSpirit,
    maxEndu: maxEndu,
    currentHp: currentHp,
    currentMana: currentMana,
    currentSpirit: currentSpirit,
    currentEndu: currentEndu
  };
  const updatePools = (hp,mana,spirit,endu) => {
    setMaxHp(hp.max)
    setMaxMana(mana.max)
    setMaxSpirit(spirit.max)
    setMaxEndu(endu.max)
    
    setCurrentHp(hp.current)
    setCurrentMana(mana.current)
    setCurrentSpirit(spirit.current)
    setCurrentEndu(endu.current)
  }
  const parsePrompt = (str) => {
    const promptRegex = /\[2m\[7m\[2m\[37m\[0m\[L:\[1;37m(\d+)\[37m\[0m\] \[\[1;32m([A-Z|a-z]+)\[37m\[0m H:\[32m(\d+)\[37m\[0m\/\[32m(\d+)\[37m\[0m M:\[32m(\d+)\[37m\[0m\/\[32m(\d+)\[37m\[0m S:\[32m(\d+)\[37m\[0m\/\[32m(\d+)\[37m\[0m E:\[32m(\d+)\[37m\[0m\/\[32m(\d+)\[37m\[0m\] \[A:\[1;(\d+)m(\d+)\[37m\[0m\] \[\]/;
    str = str.toString();
    const match = str.match(promptRegex);
    if (match) {
      updatePools(
        {current:match[3],max:match[4]},
        {current:match[5],max:match[6]},
        {current:match[7],max:match[8]},
        {current:match[9],max:match[10]}
        )
    }
  }
  const getMap = (str) => {
    str = str.toString();
    const mapChar = /(\[2m\[4m\[2m\[37m\[0m\[0m([\s\S\n]+)\[0m\[4m\[2m\[4m\[37m\[0m)/g;
    if (mapChar.test(str)) {
      const map = str.match(mapChar);
      return setCurrentMap(map[0]);
    }
  }
  //#TODO this should be a generic method that can be used to capture anything and select which tab to add it to.
  const captureSay = (string) => {
    const regex = /\[0m\[30m\[7m\[30m\[37m\[0m\[1;36m\[1;37mYou say, \[1;31m'\[0m\[37m(\s+|\S+)\[1;31m'\[0m\[0m\[7m\[30m\[7m\[37m\[0m/;
    const match = string.toString().match(regex);
    console.log('match', match); // eslint-disable-line
    if(match) {
      return setTabOneContent(tabOneContent => [...tabOneContent, match[1]])
      console.log('tabOneContent', tabOneContent); // eslint-disable-line
    }
  }
  useEffect(() => {
    parsePrompt(props.historyEntries[lastEntry].data);
    captureSay(props.historyEntries[lastEntry].data);
    props.historyEntries.length ? getMap(props.historyEntries[lastEntry].data) : null;
  })
  const handleUserInputSubmit = (value) => {
    props.dispatch(submitUserInput(value))
  }
  return (
    <div className='MUDClient'>
      <div className='leftColumn'>
        <HistoryWindow
          historyEntries={props.historyEntries}
        // handleHistoryWindowDoubleClick={handleHistoryWindowDoubleClick}
        />
        <UserInputBar
          ref={props.$UserInputBar}
          handleUserInputSubmit={handleUserInputSubmit}
        />
      </div>
      <div className="rightColumn">
        <MapWindow map={CurrentMap} type={props.type} id={props.id} />
        <PlayerStatus playerStatus={playerStatus}/>
        <OutputWindow tabOneContent={tabOneContent} tabTwoContent={tabTwoContent} tabThreeContent={tabThreeContent} tabFourContent={tabFourContent}/>
      </div>
    </div>
  )
}

const createMarkup = (entry) => {
  const mapChar = /\[2m\[4m\[2m\[37m\[0m\[0m([\s\S]+)\[0m\[4m\[2m\[4m\[37m\[0m/g;
  const data = entry.data.toString();
  const containsMapString = mapChar.test(data);
  
  // console.log('entry.data', entry.data); // eslint-disable-line
  if (entry.type === 'MUD_OUTPUT_MSG') {
    if (containsMapString) {
      //ignore map in historyWindow
      const cleanString = data.replace(mapChar, "");
      return { __html: MudOutputDecoder.mudOutputToHtml(cleanString) };
    } else {
      return { __html: MudOutputDecoder.mudOutputToHtml(entry.data) }
    }
  } else {
    return { __html: entry.data }
  }
}

export default MUDClient