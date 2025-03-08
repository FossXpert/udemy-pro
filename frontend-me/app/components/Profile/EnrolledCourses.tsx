import { CardLoader } from '@/app/util/CardLoader'
import React, { useEffect } from 'react'
import CourseCard from '../All/CourseCard'
import { useLoadUserQuery } from '@/redux/features/api/apiSlice'

type Props = {}

const EnrolledCourses = (props: Props) => {

  const {data,isLoading,refetch}  = useLoadUserQuery({},{refetchOnMountOrArgChange:true});
  useEffect(() => {
    if(data){
      console.log('data',data);
    }
  }, [refetch]);
  return (
    <>
    {isLoading && <CardLoader length={12} />}
        <div className={`flex items-center justify-center gap-6 flex-wrap w-full h-full mt-[8%] sm:mt-[1%]`}>
            {data?.user?.courses?.length > 0 ? (
              data?.user?.courses?.map((value: any, index: number) => (
                  <CourseCard
                    cartDisable={false}
                    key={index}
                    id={value._id}
                    name={value.courseName}
                    postedBy={value.coursePostedBy}
                    price={value.coursePrice}
                    estimatedPrice={value.courseEstimatedPrice}
                    tags={value.courseTags}
                    thumbnail={value.courseThumbnail}
                    level={value.courseLevel}
                    demoUrl={value.courseDemoUrl}
                    totalVideos={value.courseTotalVideos}
                  />
              ))
            ) : (
              !isLoading && <p className="text-gray-500">No courses available.</p>
            )}
        </div>
    </>
  )
}

export default EnrolledCourses