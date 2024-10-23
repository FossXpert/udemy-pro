'use client'
import Header2 from '../../../../app/components/Header2';
import CoursePreview from '../../../../app/components/All/CoursePreview';
import React, { useState } from 'react'
import toast from 'react-hot-toast';


const Page = ({params}:any) => {

  const [open,setOpen] = useState(false);
  const [route, setRoute] = useState('signin');
  const id = params.id;
  return (
    <div className='flex flex-col'>
      <Header2
          open={open}
          setOpen={setOpen}
          route={route}
          setRoute={setRoute}
        /> 
        <CoursePreview id={id}/>
    </div>
  )
}

export default Page;