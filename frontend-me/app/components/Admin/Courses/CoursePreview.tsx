import React, { FC, useState } from 'react'
import toast from 'react-hot-toast';
import { FaChevronDown, FaChevronUp, FaRupeeSign } from 'react-icons/fa6';
import { TbArrowBadgeRight } from "react-icons/tb";
import { LuDot } from "react-icons/lu";
import { MdOndemandVideo } from 'react-icons/md';

const border = 'border border-solid'

type Props = {
  active:number;
  setActive : (active:number) => void;
  handleSubmit : any;
  createCourseFinal : any;
  courseData:{
    name : string;
    description : string;
    price : string;
    estimatedPrice : string;
    tags : string;
    thumbnail : string;
    level : string;
    demoUrl : string;
    totalVideos : string;
    benefits : {title : string}[];
    prerequisites : {title : string}[];
    courseData : {
      videoSection : string;
      courseDataInside : {
        videoUrl : string;
        title : string;
        description : string;
      }[],
      suggestion : string;
    }[];
  };
}

const CoursePreview:FC<Props> = ({active,setActive,handleSubmit,createCourseFinal,courseData}) => {

  const courseSectionCount = courseData.courseData.length;
  const [courseSectionCountDropDown,setCourseSectionCountDropDown] = useState(Array(courseSectionCount).fill(false));
  toast.success("Course Section Count : "+courseSectionCount);


  const [videoSectionExtend,setVideoSectionExtend] = useState(false);
  const [isExpanded,setIsExpanded] = useState(false);

  const handleTextExpansion = (text:string,limit:number) => {
    if(text.length <=limit) return text;

    return text.substring(0,limit)+ '...';
  }

  const [selectedVideoUrl,setSelectedVideoUrl] = useState<string>("https://www.youtube.com/embed/4VSUrwbd0Jw?si=2spqWH3AgFbb32Jq")
  toast.success(selectedVideoUrl);
  console.log(selectedVideoUrl)
  return (
    <>
    <div className='flex flex-col h-full w-full items-center 
      '>
      <h1 className=''>Course Preview</h1>
      <div className='flex w-[97%] items-center flex-col h-full  '>
      <div className='flex w-[97%] h-auto flex-col  '>
        <div className='flex w-[100%] h-full mt-2 mb-2 flex-col  '>
          {
            
            <iframe width="560" height="315" 
            src={selectedVideoUrl} 
            title="YouTube video player" 
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen>
            </iframe>
          }
        </div>
        <div className='flex flex-col w-auto h-auto  '>
          <h2>{courseData.name}</h2>
          <br/>
          <div className='flex w-auto gap-2 items-center   '>
            <FaRupeeSign className='ml-2'/>
            <h3>{courseData.price}</h3>
            <h3 className='text-[#ccc]'><s>{courseData.estimatedPrice}</s></h3>
          </div>
          <div className='flex p-2 '>
            <input className='input-box-1 !w-[30%]' placeholder='Discount Code...'/>
            <button className='button-global ml-2 !bg-black !p-2'>
              Apply 
            </button>
          </div>
          <button className='button-global mt-2 ml-2 mb-2'>
            Buy Now
          </button>
        </div>
        <div className='flex flex-col p-2 w-auto h-auto  '>
          <h3>
            What&apos;s Included
          </h3>
          <ul className='flex flex-col list-none text-[0.9rem] mt-2'>
            <li className='flex items-center gap-1'><TbArrowBadgeRight/> Source Code Included</li>
            <li className='flex items-center gap-1'><TbArrowBadgeRight/> Full Lifetime Access</li>
            <li className='flex items-center gap-1'><TbArrowBadgeRight/> Certification Of Completion</li>
            <li className='flex items-center gap-1'><TbArrowBadgeRight/> Premium Support</li>
          </ul>
        </div>
        <div className='flex flex-col p-2 w-auto h-auto  '>
          <h3>Description</h3>
          <p>
            {isExpanded ? courseData.description : handleTextExpansion(courseData.description,100)}
            <span className='cursor-pointer text-[0.9rem] text-blue-400' onClick={()=>setIsExpanded(!isExpanded)}>
            {isExpanded ? "(Read Less)" : "(Read More)"}
            </span>
          </p>
        </div>
        <div className={`flex p-2 gap-2 justify-between w-auto h-full m-2 ${border} border-gray-400`}>
          <div className='flex flex-col w-[100%] h-full '>
          <div className='flex flex-col w-full h-full gap-4'>
            <h3>Course Content</h3>
            <div className='flex justify-between items-center w-auto h-auto'>
              <div className='flex items-center w-auto h-auto'>
              <p className='text-gray-700 text-[0.9rem] p-2'>{courseData.courseData.length} sections</p>
              <LuDot/>
              <p className='text-gray-700 text-[0.9rem] p-2'>{courseData.courseData.length} sections</p>
              <LuDot/>
              <p className='text-gray-700 text-[0.9rem] p-2'>{courseData.courseData.length} sections</p>
              </div>
              <h4 className='p-2  text-[.9rem] pl-4 text-[#7F56D9] hover:text-blue-600'>Expand All Sections</h4>
            </div>
          </div>
          <div className={`flex w-auto h-full p-2 flex-col ${border} border-gray-300`}>
            {courseData.courseData.map((value,index)=>(
              <div key={index} className='flex flex-col w-auto h-full border  '>
                  <div className='flex w-full h-full border  '>
                    <div className='flex flex-col w-[72%] h-full cursor-pointer'>
                      <div onClick={()=>setCourseSectionCountDropDown(prev=>({...prev,[index]:!prev[index]}))} className='flex items-center p-2 gap-2.5 w-auto cursor-pointer border  '>
                      {courseSectionCountDropDown[index] ? <FaChevronUp className='text-[0.8rem] border  '/>:
                       <FaChevronDown className='text-[0.8rem] border  '/> }
                      <h4 className='w-[95%]'>{value.videoSection}</h4>
                      </div>
                    </div>                
                    <div className='flex justify-between items-center w-[28%]  '>
                      <div className='flex items-center w-auto  '>
                      <p className='text-gray-700 text-[0.7rem] p-2'>{courseData.courseData.length} Lectures</p>
                      <LuDot/>
                      <p className='text-gray-700 text-[0.7rem] p-2'>{courseData.courseData.length} sections</p>
                      </div>
                    </div>
                  </div>
                  {
                      courseSectionCountDropDown[index] &&
                      value.courseDataInside.map((value1,index1)=>(
                          <div onClick={()=>setSelectedVideoUrl(value1.videoUrl)} key={index1} className={`flex text-[0.8rem] p-2 gap-2.5 items-center w-auto h-auto ${border} border-gray-200`}>
                            <MdOndemandVideo/>
                            <p>{value1.title}</p>
                          </div>
                      ))
                  }
              </div>
            ))}
          </div>
          </div>
          <div className='flex w-[30%] h-full border  '>
           
          </div>
        </div>
      </div>
          <div className='flex justify-between pl-2 pr-2 w-[90%] h-[75px]'>
            <button className='button-global' onClick={()=>setActive(3)}>Prev</button>
            <button className='button-global' onClick={()=>createCourseFinal()}>Create</button>
          </div>
      </div>
    </div>
    </>
  )
}

export default CoursePreview;
