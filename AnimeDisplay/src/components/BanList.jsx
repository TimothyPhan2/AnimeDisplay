import React from 'react'

const BanList = ({banList, handleRemove}) => {
  return (
    <div>
        <h3>Ban List:</h3>
        <ul>
      {Object.entries(banList).map(([key, values], index) => (
        <li key={index}>
          <h4>{key}</h4>
          <ul>
            {values.map((value, idx) => (
              <li key={idx} style={{
                display: 'inline-block',
                margin: '5px',
                padding: '10px 20px',
                borderRadius: '5px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
              }}
              onClick={() => handleRemove(key, value)}
              >
                {value}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
      </div>
  )
}

export default BanList