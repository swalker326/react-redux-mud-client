import React from 'react'
import Ansi from "ansi-to-react";
import MudOutputDecoder from './lib/MudOutputDecoder'

//Local Impots

const MapWindow = (props) => {
  const mapString = props.map;
return(
   <div className='MapWindow'>
     <ul>
       <li 
        dangerouslySetInnerHTML={{__html: MudOutputDecoder.mudOutputToHtml(props.map)}}>
       </li>
     </ul>
      {/* {map.map} */}
      {/* <Ansi>{map.map}</Ansi> */}
   </div>
 )
}

export default MapWindow

const Styles = {
    MapWindow: {border: "1px solid", minHeight: "40%"}
  }