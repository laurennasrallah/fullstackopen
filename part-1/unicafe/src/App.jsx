import { useState } from 'react'

// Reusable button component — takes in an onClick function and label text as props
const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

// Displays one row of a table: a label (text) and a value (value)
const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

// Component for all the statistics, shown in a table using multiple StatisticLine components
const Statistics = (props) => {
  console.log(props); // helpful for debugging what props are coming in
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={props.good}/>
        <StatisticLine text="bad" value={props.bad}/>
        <StatisticLine text="neutral" value={props.neutral}/>
        <StatisticLine text="total" value={props.total}/>
        <StatisticLine text="average" value={props.average}/>
        <StatisticLine text="positive" value={props.positivePercentage}/>
      </tbody>
    </table>
  )
}

const App = () => {
  // State for each type of feedback
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // Event handlers that update the state
  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  // Helper functions to calculate total, average, and % positive feedback
  const total = () => good + neutral + bad

  const average = () => {
    // Scoring: good = +1, neutral = 0, bad = -1
    return total() === 0 ? 0 : (good * 1 + bad * -1) / total()
  }

  const positivePercentage = () => {
    return total() === 0 ? 0 : (good / total()) * 100
  }

  return (
    <div>
      <h1>give feedback</h1>

      {/* Buttons to collect feedback */}
      <Button handleClick={handleGood} text="Good"/>
      <Button handleClick={handleBad} text="Bad"/>
      <Button handleClick={handleNeutral} text="Neutral"/>

      <h1>statistics</h1>

      {/* Show statistics only if feedback has been given */}
      {total() > 0
        ? <Statistics 
            good={good}
            bad={bad}
            neutral={neutral}
            total={total()}
            average={average()}
            positivePercentage={positivePercentage()}
          />
        : <p>No feedback given</p>}
    </div>
  )
}

export default App
