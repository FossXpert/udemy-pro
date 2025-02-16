import React, { useEffect, useRef, useState } from 'react'
import { bo } from '../page'
import caraousel from './carousel.json'
import Image from 'next/image'
import { MdArrowLeft, MdArrowRight } from 'react-icons/md'

type Props = {}

const Hero = (props: Props) => {

  const [current, setCurrent] = useState<any>(0);
  const images = caraousel.carousel.filter((item) => item.active === true)

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
        <div className={` ${bo} caraousel flex w-full h-[auto] overflow-x-auto `}>
          {
            images.map((value, index) => (
              <>
                {(index === current) && <Image className={`w-full h-auto`} key={index} src={value.imageLink} alt={value.imageName} width={1280} height={720} />}
              </>
            ))
          }
        </div>
        <MdArrowRight onClick={() => slideNext()} className={`text-2xl cursor-pointer p-0 m-0`} />
      </div>
    </>
  )
}

export default Hero

// #892DE1 