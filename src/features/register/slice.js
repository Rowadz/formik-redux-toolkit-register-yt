import { createSlice } from '@reduxjs/toolkit'

const register = createSlice({
  name: 'register',
  initialState: {
    email: 'test@gmail.com',
    password: 'secret',
    passwordConfirmation: '',
    username: '',
  },
  reducers: {
    updateVal(state, { payload: { key, val } }) {
      state[key] = val
    },
  },
})

export const { updateVal } = register.actions

export default register.reducer
