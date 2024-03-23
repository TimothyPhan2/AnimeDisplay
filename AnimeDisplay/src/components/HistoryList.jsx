import React from 'react'

const HistoryList = ({history}) => {
  return (
    <div style={{ height: '80vh', overflowY: 'auto' }}>
    <h3>History</h3>
    <ul>
      {history.map((item, index) => (
        <li key={index}>
          {item.title.romaji}
          <img src={item.coverImage.large} alt={item.title.romaji} style={{width: '50px', height: 'auto', display: 'block', margin: '10px auto' }} />
        </li>
      ))}
    </ul>
 </div>
  )
}

export default HistoryList