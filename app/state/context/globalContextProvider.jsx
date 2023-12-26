"use client"
import React, { createContext, useEffect, useReducer } from 'react'
import { globalReducer } from '../reducer/globalReducer'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from '@/app/lib/db';
import fetchCurrentUser from '@/app/utils/fetchCurrentUser/fetchCurrentUser';

const intialState = {
  user: {},
  isAuthenticated: false,
  isOnboarded: false,
  isLoading: true,
  setIsUploadPostOpen:false,
}
export const GlobalContext = createContext(intialState)
export const GlobalContextDispatch = createContext(null)

const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, intialState)

  const { fetchUser } = fetchCurrentUser()

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth,async (user) => {
      if (user) {
        dispatch({
          type: "SET_IS_AUTHENTICATED",
          payload: {
            isAuthenticated: true,
          }
        })
        dispatch({
          type: "SET_LOADING",
          payload: {
            isLoading: true,
          }
        })
 const userData= await  fetchUser();
 if (userData) {
  dispatch({
    type: 'SET_USER',
    payload: {
      user: userData,
    },
  });
  dispatch({
    type: 'SET_IS_ONBOARDED',
    payload: {
      isOnboarded: true
    }
  });
  dispatch({
    type: "SET_LOADING",
    payload: {
      isLoading: false
    }
  })
 }
      }
    });
    return () => unsubcribe();
  }, [])


  return (
    <GlobalContext.Provider value={state}>
      <GlobalContextDispatch.Provider value={dispatch}>
        {children}
      </GlobalContextDispatch.Provider>
    </GlobalContext.Provider>
  )
}

export default GlobalContextProvider