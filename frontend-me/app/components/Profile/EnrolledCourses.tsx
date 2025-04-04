import { CardLoader } from '../../../app/util/CardLoader'
import React, { useEffect } from 'react'
import CourseCard from '../All/CourseCard'
import { useLoadUserQuery } from '../../../redux/features/api/apiSlice'
import { useDeleteBoughtCourseByIdMutation } from '../../../redux/features/courses/courseApi'
import toast from 'react-hot-toast'

type Props = {}

const EnrolledCourses = (props: Props) => {

  const {data,isLoading,refetch}  = useLoadUserQuery({},{refetchOnMountOrArgChange:true});
  useEffect(() => {
    if(data){
      console.log('data',data);
    }
  }, [refetch]);

  const [deleteBoughtCourseById,{isSuccess:deleteSuccess,isLoading:deleteLoading,error:deleteError}] = useDeleteBoughtCourseByIdMutation();
  const onDelete = async (id:string) => {
    console.log("id",id);
    await deleteBoughtCourseById(id);
    refetch();
  }

  useEffect(() => {
    if(deleteSuccess){
      toast.success("Course deleted successfully");
      refetch();
    }
    if(deleteError){
      toast.error("Error deleting course");
    }
  }, [deleteSuccess, deleteError, refetch]);
  return (
    <>
    {isLoading && <CardLoader length={1} />}
        <div className={`flex items-center justify-center gap-6 flex-wrap w-full h-full mt-[8%] sm:mt-[1%]`}>
            {data?.user?.courses?.length > 0 ? (
              data?.user?.courses?.map((value: any, index: number) => (
                  <CourseCard
                    cartDisable={true}
                    key={index}
                    id={value.courseId}
                    name={value.courseName}
                    postedBy={value.coursePostedBy}
                    price={value.coursePrice}
                    estimatedPrice={value.courseEstimatedPrice}
                    tags={value.courseTags}
                    thumbnail={value.courseThumbnail}
                    level={value.courseLevel}
                    demoUrl={value.courseDemoUrl}
                    totalVideos={value.courseTotalVideos}
                    path={`all/courses`}
                    onDelete={() => onDelete(value.courseId)}
                    showDelete={true}
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