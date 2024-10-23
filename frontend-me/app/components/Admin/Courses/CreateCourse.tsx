import React, { useEffect, useState } from 'react'
import CourseStatusBar from './CourseStatusBar'
import '../../../css/css-admin/coursestatusbar.css'
import '../../../css/css-admin/createcourse.css'
import CourseInformation from './CourseInformation';
import CourseOptions from './CourseOptions';
import CourseContent from './CourseContent';
import CoursePreview from './CoursePreview';
import { z } from 'zod';
import { useCreateCourseMutation } from '../../../../redux/features/courses/courseApi';
import toast from 'react-hot-toast';
type Props = {}

const CreateCourse = (props: Props) => {
  const [active, setActive] = useState(0);
  const [createCourse, {isLoading,isSuccess,error}] = useCreateCourseMutation();

  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }])

  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "",
  });
  const [courseContentData, setCourseContentData] = useState([
    {
      videoSection: "Untitled Section",
      courseDataInside: [{
        videoUrl: "",
        title: "",
        description: "",
      }],
      suggestion: "",
    }
  ]);

  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    price: '',
    estimatedPrice: '',
    tags: '',
    thumbnail: '',
    level: '',
    demoUrl: '',
    totalVideos: '',
    benefits: [{ title: '' }],
    prerequisites: [{ title: '' }],
    courseData: [
      {
        videoSection: 'Untitled Section',
        courseDataInside: [
          {
            videoUrl: '',
            title: '',
            description: '',
          },
        ],
        suggestion: '',
      },
    ],
  });

  useEffect(()=>{
      if(isSuccess){
        toast.success("Course Created");
      }
      if(error){
        if('data' in error){
          const errorData = error as any;
          toast.error(errorData.data.message);
        }
      }
  },[isSuccess,error]);
  
  const handleSubmit = () => {
     const formattedBenefit  = benefits.map((benefit)=> ({title : benefit.title}));
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({title : prerequisite.title}))
    const formattedCourseContentData = courseContentData.map((courseContent)=> ({
      videoSection : courseContent.videoSection,
      courseDataInside : courseContent.courseDataInside.map((courseData) => ({
        videoUrl : courseData.videoUrl,
        title : courseData.title,
        description : courseData.description,
      })),
      suggestion : courseContent.suggestion,
    }));

    const data = {
      name : courseInfo.name,
      description : courseInfo.description,
      price : courseInfo.price,
      estimatedPrice : courseInfo.estimatedPrice,
      tags : courseInfo.tags,
      thumbnail : courseInfo.thumbnail,
      level : courseInfo.level,
      demoUrl : courseInfo.demoUrl,
      totalVideos : courseContentData.length.toString(),
      benefits : formattedBenefit,
      prerequisites : formattedPrerequisites,
      courseData : formattedCourseContentData,
    }
    setCourseData(data);
    console.log("formattedBenefit : ",formattedBenefit);
    console.log("formattedPrerequisites",formattedPrerequisites);
    console.log('formattedCourseContentData',formattedCourseContentData);
    console.log('courseInfo',courseInfo);
    console.log('courseData',courseData);
    console.log("courseData is :", courseData);

  }

  const createCourseFinal = async() => {
      if(!isLoading){
        const result =  await createCourse(courseData);
        console.log("result is : ",result);
      }
  }

  return (
    <>
      <div className='create-course-container'>
        <div className='coursestatus'>
          <CourseStatusBar active={active} setActive={setActive} />
        </div>
        <div className='create-course-container-secondary'>
          {active === 1 && <CourseInformation handleSubmit={handleSubmit} active={active} setActive={setActive}
            courseInfo={courseInfo} setCourseInfo={setCourseInfo} />}
          {active === 2 && <CourseOptions active={active} setActive={setActive}
            benefits={benefits} setBenefits={setBenefits}
            prerequisites={prerequisites} setPrerequisites={setPrerequisites} />}
          {active === 3 && <CourseContent handleSubmit={handleSubmit} 
            setCourseContentData={setCourseContentData} 
            courseContentData={courseContentData} 
            active={active} setActive={setActive} />}
          {active === 4 && <CoursePreview
            active={active} setActive={setActive} 
            courseData={courseData}
            handleSubmit={handleSubmit} createCourseFinal = {createCourseFinal} />}
        </div>
      </div>
    </>
  )
}

export default CreateCourse