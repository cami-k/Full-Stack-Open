import { useState } from 'react'

const Header = ( {name} ) => <h1>{name}</h1>

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
)

const StatisticLine = ({ text, value }) => {
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ( {good, neutral, bad, all, sum, positive} ) => {
  if (all === 0) {
    return(
      <div>
        No Feedback Given
      </div>
    )
  }
  return(
    <table>
      <tbody>
        <StatisticLine text={'good'} value={good}/>
        <StatisticLine text={'neutral'} value={neutral}/>
        <StatisticLine text={'bad'} value={bad}/>
        <StatisticLine text={'all'} value={all}/>
        <StatisticLine text={'average'} value={sum / all}/>
        <StatisticLine text={'positive'} value={positive + ' %'}/>
      </tbody>
    </table>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [sum, setSum] = useState(0)
  const [positive, setPositive] = useState(0)


  const handleGood = () => {
    const updated = good + 1
    const updatedAll = neutral + bad + updated
    setGood(updated)
    setAll(updatedAll)
    setSum(sum + 1)
    setPositive((updated / updatedAll) * 100)
  }

  const handleNeutral = () => {
    const updated = neutral + 1
    const updatedAll = updated + bad + good
    setNeutral(updated)
    setAll(updatedAll)
    setPositive((good / updatedAll) * 100)
  }

  const handleBad = () => {
    const updated = bad + 1
    const updatedAll = updated + neutral + good
    setBad(updated)
    setAll(updatedAll)
    setSum(sum - 1)
    setPositive((good / updatedAll) * 100)
  }

  return (
    <div>
      <Header name={'Give Feedback'} />
      <Button handleClick={handleGood} text='good'/>
      <Button handleClick={handleNeutral} text='neutral'/>
      <Button handleClick={handleBad} text='bad'/>
      <Header name={'Statistics'} />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} sum={sum} positive={positive} />
    </div>
  )
}

export default App