import { createSlice } from '@reduxjs/toolkit'


const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
      setMessage(state, action) {
        return action.payload
      }
    }
})

const { setMessage } = notificationSlice.actions

export const setNotification = (message, time) => {
  return (dispatch) => {
    dispatch(setMessage(message))
    setTimeout(() => { dispatch(setMessage(null)) }, time * 1000)
  }
}


export default notificationSlice.reducer
