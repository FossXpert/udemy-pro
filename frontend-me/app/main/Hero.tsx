import React, { useEffect, useRef, useState } from 'react'
import carousel from './carousel.json'
import Image from 'next/image'
import { MdArrowLeft, MdArrowRight } from 'react-icons/md'
import { GoDotFill } from 'react-icons/go'

type Props = {}

const Hero = (props: Props) => {
  const [current, setCurrent] = useState<number>(0);
  const images = carousel.carousel.filter((item) => item.active === true);

  const slideNext = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const slidePrev = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="flex gap-4 w-auto h-auto mt-[2%] items-center">
      <MdArrowLeft 
        onClick={slidePrev} 
        className="text-2xl cursor-pointer p-0 m-0" 
      />
      <div className="relative w-[90vw] h-[auto] overflow-hidden flex items-center justify-center">
        <div 
          className="flex transition-transform duration-800 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((value, index) => (
            <div key={index} className="min-w-full flex-shrink-0">
              <Image 
                className="w-full h-auto"
                src={value.imageLink} 
                alt={value.imageName} 
                width={1280} 
                height={720} 
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-2 flex gap-1">
          {images.map((_, index) => (
            <GoDotFill 
              key={index} 
              className={`text-xl ${index === current ? 'text-gray-900' : 'text-gray-300'}`} 
            />
          ))}
        </div>
      </div>
      <MdArrowRight 
        onClick={slideNext} 
        className="text-2xl cursor-pointer p-0 m-0" 
      />
    </div>
  )
}

export default Hero;
