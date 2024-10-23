'use client'
import React, { FC } from 'react'
import Profile from '../components/Profile/Profile';


type Props = {
  open : boolean;
  setOpen : (open:boolean) => void;
  route : string;
  setRoute : (route:string) => void;
  isMobile :boolean;
  sSize : string;
}
const page =() => {
  return (
    <div>
     <Profile/>
    </div>
  )
}

export default page;