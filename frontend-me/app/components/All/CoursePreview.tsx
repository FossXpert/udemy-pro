import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaChevronDown, FaChevronUp, FaRupeeSign } from 'react-icons/fa6';
import { TbArrowBadgeRight } from "react-icons/tb";
import { LuDot } from "react-icons/lu";
import { MdOndemandVideo } from 'react-icons/md';
import { useGetSingleCourseQuery } from '../../../redux/features/courses/courseApi';
import { useSelector } from 'react-redux';

type Props = {
  id: string;
};

const hehegreen= 'border border-solid border-green-500';
const heheblack = 'border border-solid border-black';

const CoursePreview: FC<Props> = ({id}) => {




  const { refetch, data, error, isLoading } = useGetSingleCourseQuery({id}, {
    refetchOnMountOrArgChange: true,
  });

  const [courseSectionCountDropDown, setCourseSectionCountDropDown] = useState<boolean[]>([]);
  const [isExpanded,setIsExpanded] = useState(false);
  const [selectedVideoUrl,setSelectedVideoUrl] = useState<string>("https://www.youtube.com/embed/4VSUrwbd0Jw?si=2spqWH3AgFbb32Jq")
  const [courseData,setCourseData]=useState<any>(null);
  const { sSize, isMobile } = useSelector((state: any) => state.screen);

  useEffect(() => {
    if(data){
      setCourseData(data.course)
    }
    if (data?.course?.courseData) {
      const sectionCount = data.course.courseData.length;
      toast.success("Course Section Count: " + sectionCount);
      setCourseSectionCountDropDown(new Array(sectionCount).fill(false));
    }
  }, [data]);

  useEffect(() => {
    if(error){
      if('data' in error){
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
      if ('status' in error && error.status === 400) {
        console.log("Session expired, refreshing token...");
        refetch();
      }
    }
  }, [error]);

  const handleTextExpansion = (text:string,limit:number) => {
    if(text.length <=limit) return text;

    return text.substring(0,limit)+ '...';
  }
  return (
    <>
    {isLoading && <p>Loading...</p>}
    {courseData && <div className='flex flex-col h-full w-full items-center 
      heheblack'>
      <h1 className=''>Course Preview</h1>
      <div className='flex w-[97%] items-center flex-col h-full hehegreen'>
      <div className='flex w-[97%] h-auto flex-col hehegreen'>
        <div className='flex w-[100%] h-full mt-2 mb-2 flex-col hehegreen'>
          {
            <iframe width={isMobile ? "100%" : "700"} height={isMobile ? "300" : "400"} 
            src={selectedVideoUrl? selectedVideoUrl : "https://www.youtube.com/embed/4VSUrwbd0Jw?si=2spqWH3AgFbb32Jq"} 
            title="YouTube video player" 
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen>
            </iframe>
          }
        </div>
        <div className='flex flex-col w-auto h-auto border border-solid border-gray-300'>
          <p className='font-semibold text-[1.5rem]'>{courseData.name}</p>
          <div className='flex w-auto gap-2 items-center hehegreen'>
            <FaRupeeSign className='ml-2'/>
            <h3>{courseData.price}</h3>
            <h3 className='text-[#ccc]'><s>{courseData.estimatedPrice}</s></h3>
          </div>
          <div className='flex p-2 heheblack'>
            <input className='input-box-1 !w-[30%]' placeholder='Discount Code...'/>
            <button className='button-global ml-2 !bg-black !p-2'>
              Apply 
            </button>
          </div>
          <button className='button-global mt-2 ml-2 mb-2'>
            Buy Now
          </button>
        </div>
        <div className='flex flex-col p-2 w-auto h-auto hehegreen'>
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
        <div className='flex flex-col p-2 w-auto h-auto hehegreen'>
          <h3>Description</h3>
          <p>
            {isExpanded ? courseData.description : handleTextExpansion(courseData.description,100)}
            <span className='cursor-pointer text-[0.9rem] text-blue-400' onClick={()=>setIsExpanded(!isExpanded)}>
            {isExpanded ? "(Read Less)" : "(Read More)"}
            </span>
          </p>
        </div>
        <div className='flex p-2 gap-2 justify-between w-auto h-full border border-solid  border-gray-300 m-2'>
          <div className='flex flex-col w-[100%] h-full heheyellow'>
          <div className='flex flex-col w-full h-full gap-4 heheblack'>
            <h3>Course Content</h3>
            <div className='flex justify-between items-center w-auto h-auto heheblack'>
              <div className='flex items-center w-auto h-auto heheblack'>
              <p className='text-gray-700 text-[0.9rem] p-2'>{courseData.courseData.length} sections</p>
              <LuDot/>
              {/* <p className='text-gray-700 text-[0.9rem] p-2'>{courseData.courseData.length} sections</p>
              <LuDot/>
              <p className='text-gray-700 text-[0.9rem] p-2'>{courseData.courseData.length} sections</p> */}
              </div>
              <h4 className='p-2 heheblack text-[.9rem] pl-4 text-[#7F56D9] hover:text-blue-600'>Expand All Sections</h4>
            </div>
          </div>
          <div className='flex w-auto h-full p-2 flex-col heheblack'>
            {courseData.courseData.map((value:any,index:any)=>(
              <div key={index} className='flex flex-col w-auto h-full border border-solid border-gray-300'>
                  <div className='flex w-full h-full border border-solid border-gray-300'>
                    <div className='flex flex-col w-[72%] h-full cursor-pointer'>
                      <div onClick={()=>setCourseSectionCountDropDown(prev=>({...prev,[index]:!prev[index]}))} className='flex items-center p-2 gap-2.5 w-auto cursor-pointer heheblack'>
                      {courseSectionCountDropDown[index] ? <FaChevronUp className='text-[0.8rem] heheblack'/>:
                       <FaChevronDown className='text-[0.8rem] heheblack'/> }
                      <h4 className='w-[95%]'>{value.videoSection}</h4>
                      </div>
                    </div>                
                    {!isMobile && <div className='flex justify-between items-center w-[28%] heheblack'>
                      <div className='flex items-center w-auto heheblack'>
                      <p className='text-gray-700 text-[0.7rem] p-2'>{courseData.courseData.length} Lectures</p>
                      <LuDot/>
                      <p className='text-gray-700 text-[0.7rem] p-2'>{courseData.courseData.length} sections</p>
                      </div>
                    </div>}
                  </div>
                  {
                      courseSectionCountDropDown[index] &&
                      value.courseDataInside.map((value1:any,index1:any)=>(
                          <div onClick={()=>setSelectedVideoUrl(value1.videoUrl)} key={index1} className='flex text-[0.8rem] p-2 gap-2.5 items-center w-auto h-auto heheblack'>
                            <MdOndemandVideo/>
                            <p>{value1.title}</p>
                          </div>
                      ))
                  }
              </div>
            ))}
          </div>
          </div>
          <div className='flex w-[30%] h-full heheblack'>
\         </div>
        </div>
      </div>
      </div>
    </div>}
    </>
  );
};

export default CoursePreview;
