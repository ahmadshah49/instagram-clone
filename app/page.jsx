"use client"
import React, { useContext } from 'react'
import Authentication from './components/authentication'
import Feed from './components/feed/feed'
import { GlobalContext } from './state/context/globalContextProvider'
const Home = () => {
 const {isAuthenticated} = useContext(GlobalContext)
 
  return isAuthenticated ? <Feed/>:  <Authentication/>;
}

export default Home