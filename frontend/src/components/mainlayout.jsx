// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './navbar'

const Mainlayout = () => {
  return (
    <div>
      <Navbar/>
      <div><Outlet/></div>
    </div>
  )
}

export default Mainlayout
