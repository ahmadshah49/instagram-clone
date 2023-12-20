"use client"
import React, { useContext, useState } from 'react'
import Authentication from './components/authentication'
import Feed from './components/feed/feed'
import { GlobalContext } from './state/context/GlobalContext'

const Home = () => {
 const isAuthenticated = useContext(GlobalContext)
 console.log(isAuthenticated);
  return isAuthenticated ? <Feed/>:  <Authentication/>;
}

export default Home