import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    // add reducers here
  },
})

store.subscribe(() => {
  console.log('store updated: ', store.getState())
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
