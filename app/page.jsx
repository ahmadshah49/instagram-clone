"use client"
import React, { useContext } from 'react'
import Authentication from './components/authentication'
import Feed from './components/feed/feed'
import { GlobalContext } from './state/context/globalContextProvider'
const Home = () => {
 const {isAuthenticated,isOnboarded} = useContext(GlobalContext)
 
  return isAuthenticated && isOnboarded ? <Feed/>:  <Authentication/>;
}

export default Home