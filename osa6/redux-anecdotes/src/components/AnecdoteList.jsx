import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { vote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => 
    state.anecdotes.filter(a => a.content.toLowerCase().includes(state.filter))
  )

  const dispatch = useDispatch()

  const voteAnecdote = (anecdote) => {
    const voted = anecdotes.find(a => a.id === anecdote.id)
    dispatch(vote(anecdote))
    dispatch(setNotification(`You voted: '${voted.content}'`, 5))
  }

  return(
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteAnecdote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList