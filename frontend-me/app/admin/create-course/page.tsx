'use client'

import AdminSidebar from '@/app/components/Admin/Sidebar/AdminSidebar'
import CreateCourse from '../../../app/components/Admin/Courses/CreateCourse'
import React from 'react'



const page = () => {
  return (
    <div className='flex'>
        <AdminSidebar/>
        <CreateCourse/>
    </div>
  )
}

export default page