import { useState } from 'react'

// Function to generate a random index based on the number of anecdotes
const randomAnecdote = (length) => {
  console.log(length) // for debugging
  return Math.floor(Math.random() * length) // random index between 0 and (length - 1)
}

const App = () => {
  // Array of anecdote strings
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  // State to track which anecdote is currently selected
  const [selected, setSelected] = useState(0)

  // State to track the number of votes each anecdote has
  // Starts with an array of 8 zeroes (same length as anecdotes)
  const [votes, setVotes] = useState(Array(8).fill(0))

  // Picks a random anecdote by updating the selected index
  const handleRandom = () => setSelected(randomAnecdote(anecdotes.length))

  // Handles voting for the currently selected anecdote
  const handleVote = () => {
    const copy = [...votes]       // make a copy of the current votes array
    copy[selected] += 1           // increment the vote for the selected anecdote
    setVotes(copy)                // update the state with the new votes array
    console.log(copy)             // log the updated votes array for debugging
  }

  // Find the highest number of votes
  const maxVotes = Math.max(...votes)

  // Find the index of the anecdote with the most votes
  const topAnecdote = votes.indexOf(maxVotes)

  return (
    <div>
      <h1>Anecdote of the day</h1>

      {/* Show the currently selected anecdote and its vote count */}
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>

      {/* Voting and random anecdote buttons */}
      <button onClick={handleVote}>vote</button>
      <button onClick={handleRandom}>next anecdote</button>

      <h1>Anecdote with the most votes</h1>

      {/* Show the anecdote that currently has the most votes */}
      <p>{anecdotes[topAnecdote]}</p>
      <p>has {votes[topAnecdote]} votes</p>
    </div>
  )
}

export default App
