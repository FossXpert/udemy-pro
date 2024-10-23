import { title } from 'process';
import React, { FC, useState } from 'react'
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { FaSquareMinus, FaSquarePlus } from 'react-icons/fa6';
import { MdOutlinePlusOne, MdPlusOne } from 'react-icons/md';

type Props = {

  active : number;
  setActive : (active : number) => void;
  benefits : {title : string}[];
  setBenefits : (benefits : {title : string}[]) => void;
  prerequisites : {title : string}[];
  setPrerequisites : (prerequisites : {title : string}[]) => void;
}

const CourseOptions:FC<Props> = ({active,setActive,benefits,setBenefits,prerequisites,setPrerequisites}) => {

  const handleSetBenefit = () => {
    setBenefits([...benefits , {title : ""}]);
  }
  const handleSetBenefitMinus = (index : number) => {
    const updatedBenefit = benefits.filter((value,i) => index !== i);
    setBenefits(updatedBenefit);
  }
  const handleBenefitChange = (value:any,index:number) =>{
    const updatedBenefit = benefits.map((valuee,i) =>
      i === index ? {...valuee, title:value}: valuee
    );
    setBenefits(updatedBenefit);
  }

  const handleSetPrerequisites = () => {
    setPrerequisites([...prerequisites , {title : ""}]);
  }
  const handleSetPrerequisitesMinus = (index : number) => {
    const updatedPrerequisites = prerequisites.filter((value,i) => index !== i);
    setPrerequisites(updatedPrerequisites);
  }
  const handlePrerequisitesChange = (value:any,index:number) =>{
    const updatedPrerequisites = prerequisites.map((valuee,i) =>
      i === index ? {...valuee, title:value}: valuee
    );
    setPrerequisites(updatedPrerequisites);
  }
  return (
    <div className='flex w-full h-full
       items-center flex-col border border-solid border-blue-500'>
      <h1 className=''>Course Options</h1>
      {/* class for form */}
      <div className='flex w-3/4 flex-col h-auto border border-solid border-green-500'>
        <div className='flex p-[0.5rem] gap-[0.5rem] border border-solid border-violet-300 w-full h-full
          justify-start items-center flex-col'>
          <label className='text-[1rem]' htmlFor=''>What are the benefits for the student in this course</label>
          {
            benefits.map((value,index) => (
              <div className='w-full flex gap-2 items-center' key={index}>
              <input value={value.title} onChange={(e)=>handleBenefitChange(e.target.value,index)} type='text' placeholder={`Enter Benefit : ${index+1}`} className='w-full box-border p-[0.5rem] border border-solid border-[#ccc] text-[1rem] outline-none '/>
              <FaSquareMinus onClick={()=>handleSetBenefitMinus(index)}/>
              </div>
            ))
          }
          <div className='flex justify-center w-full border border-solid border-green-500'>
          <FaSquarePlus onClick={handleSetBenefit}/>
          </div>
        </div>
        <div className='flex p-[0.5rem] gap-[0.5rem] border border-solid border-violet-300 w-full h-full
          justify-start items-center flex-col'>
          <label className='text-[1rem]' htmlFor=''>What are the prerequisites for the student in this course</label>
          {
            prerequisites.map((value,index) => (
              <div className='w-full flex gap-2 items-center' key={index}>
              <input value={value.title} onChange={(e)=>handlePrerequisitesChange(e.target.value,index)} type='text' placeholder={`Enter Prerequisite : ${index+1}`} className='w-full box-border p-[0.5rem] border border-solid border-[#ccc] text-[1rem] outline-none '/>
              <FaSquareMinus onClick={()=>handleSetPrerequisitesMinus(index)}/>
              </div>
            ))
          }
          <div className='flex justify-center w-full border border-solid border-green-500'>
          <FaSquarePlus onClick={handleSetPrerequisites}/>
          </div>
        </div>
          <div className='flex justify-between pl-2 pr-2 h-[75px]'>
            <button className='button-global' onClick={()=>setActive(1)}>Prev</button>
            <button className='button-global' onClick={()=>setActive(3)}>Next</button>
          </div>
      </div>
    </div>
  )
}

export default CourseOptions