import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setMessage } from '../reducers/notificationReducer'



const AnecdoteList = () => {
  const anecdotes = useSelector(state => 
    state.anecdotes.filter(a => a.content.toLowerCase().includes(state.filter))
  )

  const dispatch = useDispatch()

  const vote = (id) => {
    const voted = anecdotes.find(a => a.id === id)
    dispatch(voteAnecdote(id))
    dispatch(setMessage(`You voted: '${voted.content}'`))
    setTimeout(() => { dispatch(setMessage(null)) }, 5000)
  }

  return(
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList