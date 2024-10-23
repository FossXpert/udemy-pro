import React, { FC, useState } from 'react';
import { FaSquareMinus, FaSquarePlus } from 'react-icons/fa6';
import { IoMdArrowDropdown, IoMdArrowDropdownCircle } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';

type Props = {
  handleSubmit : any;
  active: number;
  setActive: (active: number) => void;
  courseContentData: {
    videoSection : string;
    courseDataInside : {
      videoUrl: string;
      title: string;
      description: string;
    }[],   
    suggestion: string;
  }[];
  setCourseContentData: (courseContentData: {
    videoSection : string;
    courseDataInside : {
      videoUrl: string;
      title: string;
      description: string;
    }[],   
    suggestion: string;
  }[]) => void;
};

const CourseContent: FC<Props> = ({handleSubmit : handleCourseSubmit, active, setActive, courseContentData, setCourseContentData }) => {

  const handleVideoSectionChange = (index:number,value:string) => {
    const newCourseContentData = [...courseContentData];
    newCourseContentData[index].videoSection = value;
    setCourseContentData(newCourseContentData);
  }
  const handleVideoSectionAdd = () => {
    const newCourseContentData = [...courseContentData];
    const courseDataInside = {
      videoUrl : "",
      title : "",
      description : "",
    }
    newCourseContentData.push({
      videoSection : "",
      courseDataInside : [courseDataInside],
      suggestion : "",
    });
    setCourseContentData(newCourseContentData);
  }

  const handleVideoSectionRemove = (sectionIndex : number) => {
    const newCourseContentData = [...courseContentData];
    newCourseContentData.splice(sectionIndex,1);
    setCourseContentData(newCourseContentData);
  }

  const handleVideoSectionContentDataAdd = (index:number) => {
      const courseDataInside = {
        videoUrl : "",
        title : "",
        description : "",
      }
      const newCourseContentData = [...courseContentData];
      newCourseContentData[index].courseDataInside.push(courseDataInside);
      setCourseContentData(newCourseContentData);
      console.log(courseContentData);
  }
  const handleVideoSectionContentDataRemove = (sectionIndex : number, videoIndex:number) => {
    const newVideoSectionContentData = [...courseContentData];
    newVideoSectionContentData[sectionIndex].courseDataInside.splice(videoIndex,1);
    setCourseContentData(newVideoSectionContentData)
  }

  const handleVideoTitleChange = (sectionIndex: number,videoIndex : number,value:string) => {
    const newCourseContentData = [...courseContentData];
    newCourseContentData[sectionIndex].courseDataInside[videoIndex].title = value;
    setCourseContentData(newCourseContentData);
  }
  const handleVideoUrlChange = (sectionIndex: number,videoIndex : number,value:string) => {
    const newCourseContentData = [...courseContentData];
    newCourseContentData[sectionIndex].courseDataInside[videoIndex].videoUrl = value;
    setCourseContentData(newCourseContentData);
  }
  const handleVideoDescriptionChange = (sectionIndex: number,videoIndex : number,value:string) => {
    const newCourseContentData = [...courseContentData];
    newCourseContentData[sectionIndex].courseDataInside[videoIndex].description = value;
    setCourseContentData(newCourseContentData);
  }

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // setActive(active+1);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
      <div className='flex w-full h-full
       items-center flex-col border border-solid border-blue-500'>
        <h1 className=''>Course Content</h1>
        <div className='flex w-3/4 flex-col h-auto border border-solid border-green-500'>
          {
            courseContentData.map((value,sectionIndex) => (
              <div key={sectionIndex} className='flex flex-col w-full h-full p-2 m-2 border border-solid border-orange-500 shadow-sm'>
                <div className='flex w-full h-full p-2 m-2 border border-solid border-black-500 shadow-sm'>
                  <input
                  type='text'
                  value={value.videoSection}
                  onChange={(e)=>handleVideoSectionChange(sectionIndex,e.target.value)}
                  className='w-[85%] text-xl font-semibold'/>
                  <div className='flex w-[15%] p-2 items-center h-auto flex-row border border-solid border-black-500 justify-between'>
                  <IoMdArrowDropdownCircle/>
                  <FaSquarePlus onClick={() => handleVideoSectionAdd()}/>
                  {sectionIndex > 0 && <MdDelete onClick={()=>handleVideoSectionRemove(sectionIndex)}/>}
                  </div>
                </div>
              <div className='flex flex-col w-full h-full p-2 m-2 border border-solid border-black-500 shadow-sm'>            
              {
                value.courseDataInside?.map((valuee,videoIndex) => (
                  <div key={videoIndex} className='flex flex-col p-2 gap-2 w-full h-auto mt-2 border border-solid border-violet-500'>
                    <div className='flex w-[100%] p-2 items-center h-auto flex-row border border-solid border-black-500 justify-between'>
                    <FaSquarePlus className='cursor-pointer' onClick={()=>handleVideoSectionContentDataAdd(sectionIndex)}/>
                    {videoIndex > 0 && <FaSquareMinus className='cursor-pointer' onClick={()=>handleVideoSectionContentDataRemove(sectionIndex,videoIndex)}/>}
                    </div>
                    <div className=' flex flex-col gap-2 w-full h-auto mt-2 border border-solid border-violet-500'>
                    <label className='text-[1rem]' htmlFor='title'>Video Title</label>
                    <input
                    type='text' 
                    placeholder='Enter Video title'
                    value={valuee.title}
                    onChange={(e) => handleVideoTitleChange(sectionIndex,videoIndex,e.target.value)}
                    className='w-full box-border p-[0.5rem] border border-solid border-[#ccc] text-[1rem] outline-none'/>
                    </div>
                    <div className=' flex flex-col gap-2 w-full h-auto mt-2 border border-solid border-violet-500'>
                    <label className='text-[1rem]' htmlFor='title'>Video URL</label>
                    <input
                    type='text' 
                    placeholder='Enter Video URL'
                    value={valuee.videoUrl}
                    onChange={(e) => handleVideoUrlChange(sectionIndex,videoIndex,e.target.value)}
                    className='w-full box-border p-[0.5rem] border border-solid border-[#ccc] text-[1rem] outline-none'/>
                    </div>
                    <div className=' flex flex-col gap-2 w-full h-auto mt-2 border border-solid border-violet-500'>
                    <label className='text-[1rem]' htmlFor='title'>Video Description</label>
                    <textarea 
                    rows={5}
                    cols={50}
                    placeholder='Enter Video Description'
                    value={valuee.description}
                    onChange={(e) => handleVideoDescriptionChange(sectionIndex,videoIndex,e.target.value)}
                    className='w-full box-border resize-none p-[0.5rem] border border-solid border-[#ccc] text-[1rem] outline-none'/>
                    </div>
                </div>
                ))
              }
              </div>
              </div>
            ))
          }
          <div className='flex justify-between pl-2 pr-2 h-[75px]'>
            <button className='button-global' onClick={()=>setActive(2)}>Prev</button>
            <button className='button-global' type='submit' onClick={()=>handleCourseSubmit()}>Next</button>
          </div>
        </div>
      </div>
      </form>
    </>
  );
};

export default CourseContent;
