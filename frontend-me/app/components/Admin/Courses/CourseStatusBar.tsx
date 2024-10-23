import React, { FC } from 'react'
import '../../../css/css-admin/coursestatusbar.css'
import { IoMdCheckmark, IoMdCheckmarkCircleOutline } from 'react-icons/io';
import Link from 'next/link';
type Props = {
  active : number;
  setActive : (active : number) => void;
}

const CourseStatusBar:FC<Props> = ({active,setActive}) => {

  const options = [
    "Course Information",
    "Course Options",
    "Course Content",
    "Course Preview",
  ]
  return (
    <>
      {
        options.map((value,index)=>(
          <div key={index} className='status-box'>
            <IoMdCheckmarkCircleOutline className='status-icon' onClick={()=>setActive(index+1)}/>
            <p>{value}</p>
          </div>
        ))
      }
    </>
  )
}

export default CourseStatusBar;