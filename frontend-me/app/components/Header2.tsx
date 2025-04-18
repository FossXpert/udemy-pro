'use client'
import { FC, useEffect, useState } from "react"
import '../css/header2.css';
import { FaCartShopping, FaFacebook, FaInstagram, FaMagnifyingGlass, FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice";
import toast from "react-hot-toast";
import LoginModal from "./Auth/LoginModal";
import { MdOutlineLogin, MdOutlineMenuOpen, MdSearch, MdShoppingCartCheckout } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import useScreenSize from "../../redux/features/screenSize/hook/useScreenSize";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import header from './header.json'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdMenu, MdClose } from 'react-icons/md';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  route: string;
  setRoute: (route: string) => void;
}

const Header2: FC<Props> = ({ open, setOpen, route, setRoute }) => {

  useScreenSize();
  const { isSuccess, data, isLoading, error } = useLoadUserQuery({});
  const [openProfile, setOpenProfile] = useState(false);
  const { sSize, isMobile } = useSelector((state: any) => state.screen);
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    console.log(sSize, isMobile);
  }, [sSize, isMobile]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Data fetched successfully", {
        duration: 2000,
        id: 'headerDataSuccess'
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message, {
          duration: 3000,
          id: 'headerError'
        });
      }
    }
  }, [error]);

  const handleProfile = () => {
    setOpenProfile(true);
  }
  const handleIologin = () => {
    setOpen(true);
  }

  const handleCart = () => {
    router.push('/all/cart')
  }

  return (
    <>
      <div className="header">
        <div className="container">
          <div className="container2">
          <Image className='cursor-pointer' onClick={()=>router.push('/')} src="https://frontends.udemycdn.com/frontends-homepage/staticx/udemy/images/v7/logo-udemy.svg" alt="Udemy" width="91" height="34" loading="lazy"/>
          </div>
          <div className="container1">
            <div className='icon'>
              <FaXTwitter />
            </div>
            <div className='icon'>
              <FaInstagram />
            </div>
            <div className='icon'>
              <FaFacebook />
            </div>
          </div>
          <div className="container2-mobile">
          <Image className='cursor-pointer' onClick={()=>router.push('/')} src="https://frontends.udemycdn.com/frontends-homepage/staticx/udemy/images/v7/logo-udemy.svg" alt="Udemy" width="91" height="34" loading="lazy"/>
          </div>
          <div className="container3">
          {
            header.navigation.filter((item)=>item.hidden === false).map((value, index) => (
                <ul key={index}>
                  <button 
                    className={`no-underline text-black text-[1.1rem] hover:text-purple-400 bg-transparent border-none cursor-pointer ${pathname === value.href ? 'text-purple-600 font-bold' : ''}`}
                    onClick={() => router.push(value.href)}
                  >
                    {value.label}
                  </button>
                </ul>
            ))
          }
          </div>
          <div className="container4">
            <div className='icon-1'>
              <IoMdSearch />
            </div>
            <div className='icon-1'>
              <MdShoppingCartCheckout onClick={()=>handleCart()} />
            </div>
            <div className='icon-1'>
              { 
                  isLoading ? ( // While loading, show a skeleton or spinner
                    <div className="loader">
                      <Image width={45} height={45} src='/loaders/login-loader.gif' alt="" />
                    </div>
                  ) : isSuccess && data?.user ? ( // Ensure data exists and is successful
                    <div 
                      className="cursor-pointer"
                      onClick={() => router.push('/profile')}
                    >
                      <Image 
                        className="rounded-full" 
                        width={23} 
                        height={23} 
                        src={data?.user?.avatar?.url || 'https://img.icons8.com/fluency-systems-filled/48/view-as-different-user.png'} 
                        alt="Profile" 
                      />
                    </div>
                  ) : (
                    <MdOutlineLogin onClick={() => handleIologin()} />
                  )
                }
            </div>
          </div>
          {/* {
            <div className='icon-ham'>
              <MdOutlineMenuOpen className="icon-ham-icon" />
            </div>
          } */}
        </div>
      </div>
      <div>
        {
          open && <LoginModal
            open={open}
            setOpen={setOpen}
            route={route}
            setRoute={setRoute} />
        }
      </div>
    </>
  )
}

export default Header2