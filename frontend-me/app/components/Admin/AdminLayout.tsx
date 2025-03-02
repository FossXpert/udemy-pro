// components/Layout/AdminLayout.js

import AdminSidebar from "./Sidebar/AdminSidebar";
import '../../css/css-admin/admin.css'
import { useState } from "react";
import AllCourses from "./Courses/AllCourses";
import CreateCourse from "./Courses/CreateCourse";
import AdminHeader from "./AdminHeader";
import { IoMdNotifications } from "react-icons/io";
const AdminLayout = () => {

  const [active, setActive] = useState(0);
  console.log("value of active", active);

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
          {active === 1 && <AllCourses/>}
          {active === 2 && <CreateCourse/>}
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminLayout;
