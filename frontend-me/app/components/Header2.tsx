'use client'
import { FC, useEffect, useState } from "react"
import '../css/header2.css';
import { FaCartShopping, FaFacebook, FaInstagram, FaMagnifyingGlass, FaXTwitter } from "react-icons/fa6";
import zoom from '../assets/zoom.png';
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
import { useRouter } from "next/navigation";
import header from './header.json'
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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

  useEffect(() => {
    console.log(sSize, isMobile);
    if (isSuccess) {
      console.log(data);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error, data, sSize, isMobile]);

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
            <Image src={zoom} alt="" />
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
            <Image src={zoom} alt="" />
          </div>
          <div className="container3">
          {
            header.navigation.filter((item)=>item.hidden === false).map((value, index) => (
                <ul key={index}>
                  <Link className='no-underline text-black hover:text-purple-400' href={`${value.href}`}>
                    {value.label}
                  </Link>
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
                  ) : isSuccess && data?.user?.avatar ? ( // Ensure data exists and is successful
                    <Link href={'/profile'}>
                      <Image className={`rounded-full border-solid border-purple-300`} width={45} height={35} src={data.user.avatar.url} alt="Profile" />
                    </Link>
                  ) : (
                    <MdOutlineLogin onClick={() => handleIologin()} />
                  )
                }
            </div>
          </div>
          {
            <div className='icon-ham'>
              <MdOutlineMenuOpen className="icon-ham-icon" />
            </div>
          }
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