import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'


const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {      
      return [...state, action.payload].sort((a, b) => b.votes - a.votes)
    },
    voteAnecdote(state, action) {
      const changedAnecdote = action.payload

      return state.map(a => (a.id !== changedAnecdote.id ? a : changedAnecdote)).sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      return action.payload.sort((a, b) => b.votes - a.votes)
    }
  }
})

const { createAnecdote, setAnecdotes, voteAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const vote = (anecdote) => {
  return async (dispatch) => {
    const changedAnecdote = await anecdoteService.voteAnecdote(anecdote)
    dispatch(voteAnecdote(changedAnecdote))
  }
}


export default anecdoteSlice.reducer
