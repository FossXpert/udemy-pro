import React, { useEffect, useRef, useState } from 'react'
import caraousel from './carousel.json'
import Image from 'next/image'
import { MdArrowLeft, MdArrowRight } from 'react-icons/md'
import { GoDotFill } from 'react-icons/go'
type Props = {}

const Hero = (props: Props) => {

  const [current, setCurrent] = useState<any>(0);
  const images = caraousel.carousel.filter((item) => item.active === true)

  // useEffect(()=>{
  //   setTimeout(()=>slideNext(),3000)
  // })

  const slideNext = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  }
  const slidePrev = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  }

  return (
    <>
      <div className={`flex gap-4 w-auto h-auto mt-[2%] items-center`}>
        <MdArrowLeft onClick={() => slidePrev()} className={`text-2xl cursor-pointer p-0 m-0`} />
        <div className={`flex flex-col gap-1 items-center w-[90vw] h-[auto] overflow-x-auto transition-transform duration-500 ease-in-out`}>
          {
            images.map((value, index) => (
              <>
                {(index === current) && <Image className={`w-full h-auto`} key={index} src={value.imageLink} alt={value.imageName} width={1280} height={720} />}
              </>
            ))
          }
          <div>
          {
            images.map((value, index) => (
              <>
                <GoDotFill key={index} className={`${index === current ? 'text-gray-900':'text-gray-300'} text-xl bg-transparent `}/>
              </>
            ))
          }
          </div>
        </div>
        <MdArrowRight onClick={() => slideNext()} className={`text-2xl cursor-pointer p-0 m-0`} />
      </div>
      <div className='text-center text-gray-500 text-md'>Please refresh this website whenever error occurs or website is not responding,it results in jsonwebtoken refresh </div>
      <div className='text-center text-gray-500 text-sm'>Every website has some issues, this website is not an exception, we are working on it </div>
      <div className='text-center text-gray-800 text-sm mt-6'>In case if on vercel, if you are getting CORS error, please clone this repository,navigate inside fontend-me folder, install dependencies and run it locally, that&apos;s it, then it will run smoothly</div>
      <div className='text-center text-gray-800 text-sm mt-6'>No need to run backend, just run frontend-me on port 3000</div>
    </>
  )
}

export default Hero

// #892DE1 