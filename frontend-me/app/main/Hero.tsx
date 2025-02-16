import React, { useEffect, useRef, useState } from 'react'
import { bo } from '../page'
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
      <div className={` ${bo} caraousel flex gap-4 w-auto h-auto mt-[2%] items-center`}>
        <MdArrowLeft onClick={() => slidePrev()} className={`text-2xl cursor-pointer p-0 m-0`} />
        <div className={` ${bo} caraousel flex flex-col gap-1 items-center w-full h-[auto] overflow-x-auto `}>
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
    </>
  )
}

export default Hero

// #892DE1 