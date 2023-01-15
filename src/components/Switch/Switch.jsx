import style from './switch.module.scss'

import React, { useState } from 'react'
import { useEffect } from 'react'

const Switch = ({width, enabled, setEnabled}) => {
  return (
    <div
    style={{width}} 
      className={`${style.block} ${enabled ? style.enabled : ""}`}
      onClick={() =>setEnabled(!enabled)}
    >
        <div 
          className={`${style.circle} ${enabled ? style.enabled : ""}`}
        ></div>
    </div>
  )
}

export default React.memo(Switch)