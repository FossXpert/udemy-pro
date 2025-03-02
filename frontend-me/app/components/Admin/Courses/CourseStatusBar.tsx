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
            <IoMdCheckmarkCircleOutline key={index+1} className={`status-icon ${active !== index+1 ? '':'text-violet-500'}`} onClick={()=>setActive(index+1)}/>
            <p className={`status-icon ${active !== index+1 ? '':'text-violet-500'}`}>{value}</p>
          </div>
        ))
      }
    </>
  )
}

export default CourseStatusBar;