'use client'

import AdminSidebar from '../../../../app/components/Admin/Sidebar/AdminSidebar';
import AdminHeader from '../../../../app/components/Admin/AdminHeader';
import React from 'react'
import { IoMdNotifications } from 'react-icons/io';
import EditCourse from '../../../../app/components/Admin/Courses/EditCourse';



const page = ({params}:any) => {
    const id = params?.id;

  return (
      <>
     <div className="admin-container">
      <AdminSidebar/>
      <div className='admin-container-mini'> 
        <div className='admin-header'>
          <AdminHeader/>
          <div className="admin-header-notification">
            <IoMdNotifications/>
          </div>
        </div>
        <div className='admin-content'>
            <EditCourse id={id}/>
        </div>
      </div>
    </div>
    </>
  )
}

export default page