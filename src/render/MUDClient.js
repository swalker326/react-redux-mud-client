import React, {useEffect, useState } from 'react'
import { submitUserInput } from '../state/actions'
import MudOutputDecoder from './lib/MudOutputDecoder'
import UserInputBar from './UserInputBar'
import OutputWindow from './OutputWindow';
import MapWindow from './MapWindow';
import PlayerStatus from './PlayerStatus';
import HistoryWindow from './HistoryWindow';

const MUDClient = (props) => {
  const [CurrentMap, setCurrentMap] = useState('');
  const [playerAffects, setPlayerAffects] = useState(false);
  
  const lastEntry = props.historyEntries.length - 1;

  const [tabOneContent, setTabOneContent] = useState([]);
  const [tabTwoContent, setTabTwoContent] = useState([]);
  const [tabThreeContent, setTabThreeContent] = useState([]);
  const [tabFourContent, setTabFourContent] = useState([]);
  const [tabFiveContent, setTabFiveContent] = useState([]);


  const [maxHp, setMaxHp] = useState(null);
  const [maxMana, setMaxMana] = useState(null);
  const [maxSpirit, setMaxSpirit] = useState(null);
  const [maxEndu, setMaxEndu] = useState(null);
  const [currentHp, setCurrentHp] = useState(null);
  const [currentMana, setCurrentMana] = useState(null);
  const [currentSpirit, setCurrentSpirit] = useState(null);
  const [currentEndu, setCurrentEndu] = useState(null);

  const channelObjects = [
    {tab: setTabOneContent, channel: 'say', regex: /\[1;36m\[1;37m([\s|\S]+ say[s]?), \[1;31m'\[0m\[37m([\s|\S]+)\[1;31m'\[0m/ },
    {tab: setTabThreeContent, channel: 'tell', regex: /\[1;36m\[1;33m([You tell]?[\S|\s]+[tells you]?)\[0m, '\[0m\[37m([\s|\S]+)\[0m'/},
    {tab: setTabOneContent, channel: 'gossip', regex:/\[1;37m([\s|\S]+ gossip[s]?) \[1;33m\]\[1;37m: \[1;33m'\[0m\[37m([\s|\S]+)\[1;33m'/},
  ]

  const processChat = (string) => {
    channelObjects.forEach((channel) => {
      const match = string.match(channel.regex);
      if (match){
        const messageObject = {person: match[1], content: match[2], channel}
        channel.tab(tabOneContent => [...tabOneContent, messageObject])
      }
    })
  }
  const captureAffects = (string) => {
    // const affectsRegex = /\[1;32m\[\[0m\[37m Personal affects: \[1;37mall \[1;32m\]\[0m: \[1;37m[\s|\S]+\[0m[\n]+([\s|\S]+)\n\n\n/;
    const affectsRegex = /\[1;32m\[\[0m\[37m Personal affects: \[1;37mall \[1;32m\]\[0m: \[1;37m(Fabula)\[0m([\s|\S]+)\[2m\[7m\[2m\[37m\[0m\[L:/; 
    const match = string.match(affectsRegex);
    if (match){
      setTabFiveContent(match[2]);
    }
  }

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
  const updatePools = (hp, mana, spirit, endu) => {
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
        { current: match[3], max: match[4] },
        { current: match[5], max: match[6] },
        { current: match[7], max: match[8] },
        { current: match[9], max: match[10] }
      )
    }
  }
  const getMap = (str) => {
    str = str.toString();
    const mapChar = /(\[2m\[4m\[2m\[37m\[0m\[0m([\s\S\n]+?)\[0m\[4m\[2m\[4m\[37m\[0m)/;
    if (mapChar.test(str)) {
      const map = str.match(mapChar);
      return setCurrentMap(map[2]);
    }
  }
  const checkInputString = (inputString) => {
    parsePrompt(inputString);
    getMap(inputString);
    processChat(inputString);
    captureAffects(inputString);
  }
  useEffect(() => {
    props.historyEntries.length ? checkInputString(props.historyEntries[lastEntry].data) : null;
  }, [props])
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
        <PlayerStatus playerStatus={playerStatus} />
        <OutputWindow tabOneContent={tabOneContent} tabTwoContent={tabTwoContent} tabThreeContent={tabThreeContent} tabFourContent={tabFourContent} tabFiveContent={tabFiveContent} />
      </div>
    </div>
  )
}

const createMarkup = (entry) => {
  const mapChar = /\[2m\[4m\[2m\[37m\[0m\[0m([\s\S]+?)\[0m\[4m\[2m\[4m\[37m\[0m/g;
  const sayRegex = /\[1;36m\[1;37m([\s|\S]+ say[s]?), \[1;31m'\[0m\[37m([\s|\S]+)\[1;31m'\[0m/
  const data = entry.data.toString();
  const containsMapString = mapChar.test(data);
  const containsSayString = sayRegex.test(data);

  // console.log('entry.data', entry.data); // eslint-disable-line
  if (entry.type === 'MUD_OUTPUT_MSG') {
    // console.log('entry.data', entry.data); // eslint-disable-line
    if (containsMapString || containsSayString) {
      //ignore map in historyWindow
      let cleanString = data.replace(mapChar, "");
      cleanString = cleanString.replace(sayRegex, "");
      return { __html: MudOutputDecoder.mudOutputToHtml(cleanString) };
    } else {
      return { __html: MudOutputDecoder.mudOutputToHtml(entry.data) }
    }
  } else {
    return { __html: entry.data }
  }
}

export  {MUDClient, createMarkup}