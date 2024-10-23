import React, { useEffect, useState } from 'react'
import {DataGrid} from '@mui/x-data-grid'
import { Box, Modal } from '@mui/material'
import { format, render, cancel, register } from 'timeago.js';
import { AiFillDelete } from "react-icons/ai";
import { useDeleteSingleCourseMutation, useGetallcourseQuery } from '../../../../redux/features/courses/courseApi'
import { MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';
import { FaEdit } from 'react-icons/fa';
import Link from 'next/link';
type Props = {}

const border = 'border border-solid border-black-600'
const AllCourses = (props: Props) => {

  const {isLoading,data,refetch}  = useGetallcourseQuery({},{refetchOnMountOrArgChange : true});
  const [open,setOpen] = useState(false);
  const [courseId,setCourseId] = useState("");
  const [deleteSingleCourse,{isLoading:deleteLoading,isSuccess,error}] = useDeleteSingleCourseMutation({});


  useEffect(()=>{
    if(isSuccess){
      refetch();
      toast.success('Course Deleted Successfully');
    }
    if(error){
      if("data" in error){
          const errorMesage = error as any;
          toast.error(errorMesage.data.message)
      }
  }
  },[isSuccess,error])

  const handleDelete = async () => {
    const id = courseId;
    await deleteSingleCourse(id);
    toast.success('Course Deleted Successfully');
    setOpen(!open);
  }

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "price", headerName: "Price", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
      {
      field : "delete",
      headerName : 'Delete',
      flex : 0.3,
      renderCell : (params:any) => {
        return (
          <button className='border-none text-[1rem] cursor-pointer' onClick={()=>{
            setOpen(!open);
            setCourseId(params.row.id);
          }}><AiFillDelete/></button>
        )
      }
      },
      {
        field : "edit",
        headerName : 'Edit',
        flex : 0.3,
        renderCell : (params:any) => {
          return (
            <Link href={`/admin/edit-course/${params.row.id}`} className='border-none text-[1rem] text-black cursor-pointer'
            ><FaEdit/></Link>
          )
        }
      }
    ]
  const rows:any = [];
  {
    data && data.Allcourses.forEach((item:any) => {
      rows.push({
        id: item._id,
        title: item.name,
        ratings: item.ratings,
        price: item.price,
        created_at: format(item.createdAt),
      })
    })
  }
  return (
    <>
    <div className={`flex w-full h-full ${border}`}>
      <div className={`flex w-full h-full p-2 ${border}`}>
        <Box sx={{ height: '100vh', width: '100%' }}>
          <DataGrid checkboxSelection rows={rows} columns={columns} />
        </Box>
        {
          open && (
            <Modal className='flex justify-center items-center'
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className=' justify-center items-center bg-gray-200 p-2 rounded-[8px] shadow-lg w-[280px] h-[40%]'>
                <h2 className={`flex mt-8 ml-4`}>
                  Are You Sure You want to delete this user ?
                </h2>
                <div className='flex justify-between pl-4 pr-4 mt-16 h-[75px]'>
                    <button className='button-global' onClick={handleDelete}>Delete</button>
                    <button className='button-global' type='submit' onClick={()=>setOpen(!open)}>Cancel</button>
                </div>
              </Box>
            </Modal>
          )
        }
      </div>
    </div>
    </>
  )
}

export default AllCourses