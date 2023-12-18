"use client"
import React, { useState } from 'react'
import Authentication from './components/authentication'
import Feed from './components/feed/feed'

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  return isAuthenticated ? <Feed/>:  <Authentication/>;
}

export default Home