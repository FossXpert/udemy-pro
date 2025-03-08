'use client'
import React, { useState } from 'react'
import SideBarProfile from './SideBarProfile'
import '../../css/css-profile/profile.css'
import MyAccount from './MyAccount'
import EnrolledCourses from './EnrolledCourses'
import ChangePassword from './ChangePassword'
import Link from 'next/link'
import Header2 from '../Header2'
type Props = {}

const Profile = (props: Props) => {
    const [active,setActive] = useState(0);
    const [open,setOpen] = useState(false);
    const [route,setRoute] = useState('signin');

  return (
    <>
    <Header2
      open={open}
      setOpen={setOpen}
      route={route}
      setRoute={setRoute}
      />
    <div className='profile-container-main'>
    <SideBarProfile active={active} setActive={setActive}/>
    <div className='profile-container'>
        <div className='profile-container-mini'>
            {
                active === 1 && <MyAccount/>
            }
            {
                active === 2 && <EnrolledCourses/>
            }
            {
                active === 3 && <ChangePassword/>
            }
            {
                active === 4 && (
                    <Link href={'/admin'}>Admin Dashboard</Link>
                )
            }
        </div>
    </div>
    </div>
    </>
    
  )
}

export default Profile