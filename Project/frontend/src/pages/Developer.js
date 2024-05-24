import React from 'react'

const Developer = ({id,name, title, picture, detail}) => {
  return (
    <div key={id}>
        <h1>hi</h1>
      <h2>{name}</h2>
      <h3>{title}</h3>
      <img src={picture} alt="" />
      <p>{detail}</p>
    </div>
  )
}

export default Developer;