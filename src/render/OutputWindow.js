import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

//Local Impots

const OutputWindow = (props) => {
return(
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
        <h2>General</h2>
          {props.tabOneContent.map((chat) => <div>{chat}</div>)}
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
      </Tabs>
    </div>
 )
}

export default OutputWindow

{/* styles  */}