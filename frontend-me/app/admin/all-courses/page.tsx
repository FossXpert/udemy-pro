'use client'

import AdminSidebar from '../../../app/components/Admin/Sidebar/AdminSidebar';
import AllCourses from '../../components/Admin/Courses/AllCourses'
import React, { FC } from 'react'
import '../../css/css-admin/admin.css'
import AdminHeader from '../../../app/components/Admin/AdminHeader';
import { IoMdNotifications } from 'react-icons/io';
import CreateCourse from '../../../app/components/Admin/Courses/CreateCourse';


const page = () => {
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
            <AllCourses/>
        </div>
      </div>
    </div>
    </>
  )
}

export default page