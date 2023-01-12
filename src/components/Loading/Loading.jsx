import React from 'react'
import style from './loading.module.scss'

const Loading = ({width}) => {
  width = width ?? 100
  return (
    <div className={style.container} style={{width: width}}>
        <div className={`${style.circle} ${style.circleFirst}`}></div>
        <div className={`${style.circle} ${style.circleSecond}`}></div>
        <div className={`${style.circle} ${style.circleThird}`}></div>
    </div>
  )
}

export default Loading