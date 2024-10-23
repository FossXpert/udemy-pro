'use client'
import React, { useEffect, useState } from 'react'
import Header2 from './components/Header2';
import Hero from './main/Hero';

type Props = {
}

const Page = (props: Props) => {
  const [open,setOpen] = useState(false);
  const [route,setRoute] = useState('signin');
  
  return (
    <div>
      {/* <Heading/> */}
      <Header2
      open={open}
      setOpen={setOpen}
      route={route}
      setRoute={setRoute}
      />
      <Hero/>
    </div>
  )
}

export default Page