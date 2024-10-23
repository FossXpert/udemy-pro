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
      <div className={`flex items-center gap-6 flex-wrap w-full h-full`}>

        <div className={`flex items-center justify-center gap-6 flex-wrap w-full h-full`}>
          {
            data?.Allcourses.map((value:any,index:number)=>(
              <CourseCard
              id={value._id} 
              key={index}
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
          }
        </div>
      </div>
      </div>

    </>
  )
}

export default Course