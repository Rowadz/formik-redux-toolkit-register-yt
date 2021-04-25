import { configureStore } from '@reduxjs/toolkit'
import { RegisterReducer } from '../features'
export const store = configureStore({
  reducer: {
    register: RegisterReducer,
  },
})
