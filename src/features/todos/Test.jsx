import React from 'react'

const Test = () => {
  return (
    <div style={{
        width: "100px",
        height: "100px",
        background: "red"
    }}
        onPointerDown={(e) => {
            e.target.addEventListener("pointermove", () => {
                console.log(123)
            })
        }}
    ></div>
  )
}

export default Test