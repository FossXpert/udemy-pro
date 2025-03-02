import Image from 'next/image';
import React, { useState } from 'react';
import { MdDashboard } from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import profileImage from '../../../assets/thumnail.png';
import '../../../css/css-admin/adminSidebar.css';

interface SubMenuItems {
    subMenuTitle: string;
    subMenuIcon: JSX.Element;
    subMenuLink: string;
    subMenuNumber: number;
}

interface MenuItems {
    menuTitle: string;
    menuIcon: JSX.Element;
    link?: string;
    subMenu?: SubMenuItems[];
    active?: boolean;
    open?: boolean;
}

const AdminSidebar = () => {
    const { user } = useSelector((state: any) => state.auth);
    const router = useRouter();
    const [active, setActive] = useState<number | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItems[]>([
        {
            menuTitle: 'Dashboard',
            menuIcon: <MdDashboard className='icon' />,
            link: '/admin/dashboard',
            active: false,
            open: false,
            subMenu: [],
        },
        {
            menuTitle: 'Courses',
            menuIcon: <MdDashboard className='icon' />,
            subMenu: [
                {
                    subMenuTitle: 'All Courses',
                    subMenuIcon: <MdDashboard className='icon' />,
                    subMenuLink: '/admin/all-courses',
                    subMenuNumber: 1,
                },
                {
                    subMenuTitle: 'Create Course',
                    subMenuIcon: <MdDashboard className='icon' />,
                    subMenuLink: '/admin/create-course',
                    subMenuNumber: 2,
                },
            ],
            open: false,
        },
    ]);

    // Toggle Menu & Submenus
    const handleToggle = (index: number) => {
        setMenuItems((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, open: !item.open } : { ...item, open: false }
            )
        );
    };

    // Handle Navigation
    const handleNavigation = (link?: string, subMenuNumber?: number) => {
        if (link) {
            router.push(link);
            setActive(subMenuNumber || null);
        }
    };

    return (
        <aside className="assidebar">
            <div className="ashead">
                <div className="asuser-image">
                    <Image width={35} src={profileImage} alt="Profile" />
                </div>
                <div className="asuser-details">
                    <p className="astitle">Senior Admin</p>
                    <p className="asname">{user?.name}</p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="asnav">
                <div className="asmenu">
                    {menuItems.map((item, index) => (
                        <ul key={index}>
                            <li className={item.active ? 'active' : ''}>
                                {/* Main Menu  */}
                                <div className="asmenu" onClick={() => handleNavigation(item.link)}>
                                    {item.menuIcon}
                                    <span className="as-span-text">{item.menuTitle}</span>
                                    {item.subMenu && (
                                        <span onClick={(e) => { e.stopPropagation(); handleToggle(index); }}>
                                            {item.open ? <IoIosArrowUp className="arrow" /> : <IoIosArrowDown className="arrow" />}
                                        </span>
                                    )}
                                </div>

                                {/* Submenu Items */}
                                {item.subMenu && item.open && (
                                    <ul className="assub-menu">
                                        {item.subMenu.map((subItem, subIndex) => (
                                            <li key={subIndex} onClick={() => handleNavigation(subItem.subMenuLink, subItem.subMenuNumber)}>
                                                {subItem.subMenuIcon}
                                                <span className="as-span-text">{subItem.subMenuTitle}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        </ul>
                    ))}
                </div>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
