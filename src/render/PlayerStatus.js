import React from 'react'

//Local Impots

const PlayerStatus = (props) => {
  console.log('props', props); // eslint-disable-line
  return (
    <div className='PlayerStatus' >
      <div className='PlayerStatus-Monitors' style={{display: "flex", flexWrap: "wrap"}}>
        <StatusBar label="HP" current={props.playerStatus.currentHp} max={props.playerStatus.maxHp} />
        <StatusBar label="Mana" current={props.playerStatus.currentMana} max={props.playerStatus.maxMana} />
        <StatusBar label="Spirit" current={props.playerStatus.currentSpirit} max={props.playerStatus.maxSpirit} />
        <StatusBar label="End" current={props.playerStatus.currentEndu} max={props.playerStatus.maxEndu} />
      </div>

    </div>
  )
}

const StatusBar = (props) => {
  const fontColor = "white"
  const bgColor = "#4d4e4f"
  const label = props.label;
  const max = props.max;
  const current = props.current;
  const currentPercent = current / max * 100 + "%";

  const setStatus = () => {

  }
  const updateStatus = (statusBar) => {

  }
  return (
    <div className={`StatusBar-${label}`} style={{marginRight: "3px",marginTop: "3px"}}>
      <div className={`StatusBar-${label}-font`} style={{ display: "inline-flex", alignItems: "center", borderRadius: "4px", padding: "8px", backgroundColor: bgColor, color: fontColor }}>
        <span>{label}:</span>
        <div className={`StatusBar-${label}-current`} style={{ border: "1px solid black", borderRadius: "4px", padding: "4px", backgroundColor: "green", width: currentPercent }}>
        <span>{current}/{max}</span>
        </div>
      </div>
    </div>
  )
}

export default PlayerStatus

{/* styles  */ }