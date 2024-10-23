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
            <ul><Link className='no-underline text-black' href={'#'}>Home</Link></ul>
            <ul><Link className='no-underline text-black' href={'/all/courses'}>Course</Link></ul>
            <ul><Link className='no-underline text-black' href={'#'}>About</Link></ul>
            <ul><Link className='no-underline text-black' href={'#'}>Policy</Link></ul>
            <ul><Link className='no-underline text-black' href={'#'}>FAQ</Link></ul>
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
                data ? (data.user.avatar ? <Link href={'/profile'}>
                    <Image width={20} height={20} src={data.user.avatar.url} alt="No"/>
                </Link>: <CgProfile onClick={() => handleProfile()} /> ):
                <MdOutlineLogin onClick={() => handleIologin()} />
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