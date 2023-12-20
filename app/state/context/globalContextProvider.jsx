"use client"
import React, { createContext,useReducer } from 'react'
import { globalReducer } from '../reducer/globalReducer'
const intialState={
    user:{},
    isAuthenticated:false,
    isOnboarded:false,
    isLoading:false
}
export const GlobalContext=createContext(intialState)
export const GlobalContextDispatch=createContext(null)

const GlobalContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(globalReducer, intialState)
  return (
    <GlobalContext.Provider value={state}>
        <GlobalContextDispatch.Provider value={dispatch}>
{children}
        </GlobalContextDispatch.Provider>
    </GlobalContext.Provider>
  )
}

export default GlobalContextProvider