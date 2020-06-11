import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import MudOutputDecoder from './lib/MudOutputDecoder'
import { animateScroll } from "react-scroll";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

//Local Impots
const OutputWindow = (props) => {
  const tabList = ['react-tabs-1', 'react-tabs-2', 'react-tabs-3', 'react-tabs-4', 'react-tabs-5',]
  const scrollToBottom = (containerId) => {
    animateScroll.scrollToBottom({
      containerId
    }, { smooth: "linear" });
  }
  const scrollTabsToBottom = () => {
    tabList.forEach(tab => scrollToBottom(tab))
  }
  useEffect(() => scrollTabsToBottom, [props]);
  return (
    <div className='OutputWindow' >
      <Tabs className='outputWindow' >
        <TabList>
          <Tab>General</Tab>
          <Tab>Combat</Tab>
          <Tab>Tells</Tab>
          <Tab>Spells</Tab>
          <Tab>Affects</Tab>
        </TabList>
        <TabPanel>
          {props.tabOneContent.map((chat, index) => <div key={index}>{chat.person} <span style={{ color: 'red' }}>'</span>{chat.content}<span style={{ color: 'red' }}>'</span></div>)}
        </TabPanel>
        <TabPanel>
          {props.tabTwoContent.map((chat, index) => <div key={index}>{chat.person} <span style={{ color: 'red' }}>'</span>{chat.content}<span style={{ color: 'red' }}>'</span></div>)}
        </TabPanel>
        <TabPanel>
          {props.tabThreeContent.map((chat, index) => <div key={index}><span style={{ color: 'yellow' }}>{chat.person}</span>, '{chat.content}'</div>)}
        </TabPanel>
        <TabPanel>
          {props.tabFourContent.map((chat, index) => <div key={index}>{chat.person} <span style={{ color: 'red' }}>'</span>{chat.content}<span style={{ color: 'red' }}>'</span></div>)}
        </TabPanel>
        <TabPanel>
          <div className='affect_tab'>
            <ul>
              <li
                dangerouslySetInnerHTML={{ __html: MudOutputDecoder.mudOutputToHtml(props.tabFiveContent) }}>
              </li>
            </ul>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default OutputWindow

{/* styles  */ }