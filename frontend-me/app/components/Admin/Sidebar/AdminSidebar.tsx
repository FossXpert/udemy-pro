import Image from 'next/image';
import React, { FC, useState } from 'react'
import { JSX } from 'react';
import profileImage from '../../../assets/thumnail.png'
import '../../../css/css-admin/adminSidebar.css'
import { MdDashboard } from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { FaBullseye } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// type Props = {
//     active : number;
//     setActive : (active:number) => void; 
// }

interface MenuItems {
    menuTitle: string;
    menuIcon: JSX.Element;
    link: string;
    subMenu: SubMenuItems[];
    active: boolean;
    open: boolean;
    dropDownIcon: JSX.Element;
}
interface SubMenuItems {
    subMenuTitle: string;
    subMenuIcon: JSX.Element;
    subMenuLink: string;
    subMenuActive: boolean;
    subMenuNumber : number;
}
const AdminSidebar = () => {
    const [active, setActive] = useState(0);
    const { user } = useSelector((state: any) => state.auth);
    const [menuItems, setMenuItems] = useState<MenuItems[]>([
        {
            menuTitle: 'Dashboard',
            menuIcon: <MdDashboard className='icon' />,
            link: '#',
            active: true,
            open: false,
            dropDownIcon: <IoIosArrowDown />,
            subMenu: [],
        },
        {
            menuTitle: 'Courses',
            menuIcon: <MdDashboard className='icon' />,
            link: '#',
            active: true,
            open: false,
            dropDownIcon: <IoIosArrowDown />,
            subMenu: [
                {
                    subMenuTitle: 'All Course',
                    subMenuActive: true,
                    subMenuIcon: <MdDashboard className='icon' />,
                    subMenuLink: 'admin/all-courses',
                    subMenuNumber: 1,
                },
                {
                    subMenuTitle: 'Create Course',
                    subMenuActive: true,
                    subMenuIcon: <MdDashboard className='icon' />,
                    subMenuLink: 'admin/create-course',
                    subMenuNumber: 2,

                },
                
            ],
        },
        {
            menuTitle: 'Dashboard-1',
            menuIcon: <MdDashboard className='icon' />,
            link: '#',
            active: true,
            open: false,
            dropDownIcon: <IoIosArrowDown />,
            subMenu: [
                {
                    subMenuTitle: 'sub1',
                    subMenuActive: true,
                    subMenuIcon: <MdDashboard className='icon' />,
                    subMenuLink: '#',
                    subMenuNumber : 3,
                },
                {
                    subMenuTitle: 'sub2',
                    subMenuActive: true,
                    subMenuIcon: <MdDashboard className='icon' />,
                    subMenuLink: '#',
                    subMenuNumber : 4,
                },
                {
                    subMenuTitle: 'sub3',
                    subMenuActive: true,
                    subMenuIcon: <MdDashboard className='icon' />,
                    subMenuLink: '#',
                    subMenuNumber : 5,
                }
            ],
        },
        {
            menuTitle: 'Dashboard-1',
            menuIcon: <MdDashboard className='icon' />,
            link: '#',
            active: true,
            open: false,
            dropDownIcon: <IoIosArrowDown />,
            subMenu: [
                {
                    subMenuTitle: 'sub1',
                    subMenuActive: true,
                    subMenuIcon: <MdDashboard className='icon' />,
                    subMenuLink: '#',
                    subMenuNumber : 0,
                },
                {
                    subMenuTitle: 'sub2',
                    subMenuActive: true,
                    subMenuIcon: <MdDashboard className='icon' />,
                    subMenuLink: '#',
                    subMenuNumber : 0,
                },
                {
                    subMenuTitle: 'sub3',
                    subMenuActive: true,
                    subMenuIcon: <MdDashboard className='icon' />,
                    subMenuLink: '#',
                    subMenuNumber : 0,
                }
            ],
        }
    ]);

    // This approach allow us to open multiple dropdowns
    const handleToggle = (index: number) => {
        const newMenuItems = [...menuItems];
        newMenuItems[index].open = !newMenuItems[index].open;
        setMenuItems(newMenuItems);
    };

    const handleOnClick = (index:number) => {

    }

    // const router = useRouter()
    //This approach allow us to open only one dropdown
    // const handleToggle = (index:number) => {
    //   setMenuItems((prevMenuItems) =>
    //     prevMenuItems.map((value,i)=>
    //       i===index ? {...value,open : !value.open} : {...value, open : false}
    //     ))
    //   } 


    return (
        <>
            <div className="assidebar">
                <div className="ashead">
                    <div className="asuser-image">
                        <Image width={35} src={profileImage} alt='No' />
                    </div>
                    <div className="asuser-details">
                        <p className='astitle'>Senior Admin</p>
                        <p className='asname'>{user.name}</p>
                    </div>
                </div>
                <div className="asnav">
                    <div className="asmenu">
                        {
                            menuItems.map((value, index) => (
                                <ul key={index}>
                                    <li className={value.active ? 'active' : 'disabled'} >
                                        <Link href={value.link}>
                                            {value.menuIcon}
                                            {<span className='as-span-text' onClick={() => handleToggle(index)} >{value.menuTitle}</span>}
                                            {value.subMenu.length > 0 &&
                                                (value.open ?
                                                    (<IoIosArrowUp className='arrow' onClick={() => handleToggle(index)} />)
                                                    : (<IoIosArrowDown className='arrow' onClick={() => handleToggle(index)} />)
                                                )}
                                        </Link>
                                        {value.subMenu.length > 0 && <ul className={value.open ? 'assub-menu' : 'disabled'}>
                                            {
                                                value.subMenu.map((value, index) => (
                                                    <li key={index}>
                                                        <Link href={value.subMenuLink} onClick={() => setActive(value.subMenuNumber)}>
                                                            {value.subMenuIcon}
                                                            <span className='as-span-text'>{value.subMenuTitle}</span>
                                                        </Link>
                                                    </li>
                                                ))
                                            }
                                        </ul>}
                                    </li>
                                </ul>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}


export default AdminSidebar;