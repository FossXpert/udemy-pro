import React, { FC, useEffect, useState } from 'react'
import CourseCard from './CourseCard'
import Header2 from '../Header2'
import { useGetallcourseQuery } from '../../../redux/features/courses/courseApi'
import toast from 'react-hot-toast'

type Props = {

}

const Course = () => {
  const [open,setOpen] = useState(false);
  const [route, setRoute] = useState('signin');

  const {data,error,isLoading} = useGetallcourseQuery({},{refetchOnMountOrArgChange:true});
  

  useEffect(()=>{
    if(isLoading){
      toast.success("isLoading");
    }
    if(data){
      toast.success("Data fetched successfully");
    }
    if(error){
      if('data' in error){
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  },[]);

  return (
    <>
      <div className={`flex flex-col`}>
        <Header2
          open={open}
          setOpen={setOpen}
          route={route}
          setRoute={setRoute}
        /> 
        {isLoading && <p className="text-gray-500">Loading Courses...</p> }
        <div className={`flex items-center justify-center gap-6 flex-wrap w-full h-full`}>
            {data?.Allcourses.length > 0 ? (
              data.Allcourses.map((value: any, index: number) => (
                  <CourseCard
                    key={index}
                    id={value._id}
                    name={value.name}
                    postedBy={value.postedBy}
                    price={value.price}
                    estimatedPrice={value.estimatedPrice}
                    tags={value.tags}
                    thumbnail={value.thumbnail}
                    level={value.level}
                    demoUrl={value.demoUrl}
                    totalVideos={value.totalVideos}
                  />
              ))
            ) : (
              !isLoading && <p className="text-gray-500">No courses available.</p>
            )}
        </div>
      </div>
    </>
  )
}

export default Course