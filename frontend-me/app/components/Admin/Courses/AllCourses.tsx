import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Modal } from '@mui/material';
import { format } from 'timeago.js';
import { AiFillDelete } from 'react-icons/ai';
import { useDeleteSingleCourseMutation, useGetallcourseQuery } from '../../../../redux/features/courses/courseApi';
import { FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

type Props = {};

const border = 'border border-solid border-black-600';

const AllCourses = (props: Props) => {
  const { isLoading, data, refetch } = useGetallcourseQuery({}, { refetchOnMountOrArgChange: true });
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [deleteSingleCourse, { isLoading: deleteLoading, isSuccess, error }] = useDeleteSingleCourseMutation({});

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success('Course Deleted Successfully');
    }

    if (error && "data" in error) {
      const errorMessage = error as any;
      toast.error(errorMessage.data.message || "Something went wrong");
    }

    if (error && 'status' in error && error.status === 400) {
      refetch();
    }
  }, [isSuccess, error, refetch]);

  const handleDelete = async () => {
    await deleteSingleCourse(courseId);
    setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "price", headerName: "Price", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.3,
      renderCell: (params: any) => (
        <button
          className="border-none text-[1rem] cursor-pointer"
          onClick={() => {
            setOpen(true);
            setCourseId(params.row.id);
          }}
        >
          <AiFillDelete />
        </button>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.3,
      renderCell: (params: any) => (
        <Link href={`/admin/edit-course/${params.row.id}`} className="border-none text-[1rem] text-black cursor-pointer">
          <FaEdit />
        </Link>
      ),
    },
  ];

  const rows: any = [];
  if (data && data.Allcourses) {
    data.Allcourses.forEach((item: any) => {
      rows.push({
        id: item._id,
        title: item.name,
        ratings: item.ratings,
        price: item.price,
        created_at: format(item.createdAt),
      });
    });
  }

  return (
    <>
      <div className={`flex w-full h-full ${border}`}>
        <div className={`flex w-full h-full p-2 ${border}`}>
          <Box sx={{ height: '100vh', width: '100%' }}>
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>

          {/* Modal for Deleting Confirmation */}
          <Modal
            className="flex justify-center items-center"
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="flex flex-col justify-center items-center bg-gray-200 p-4 rounded-[8px] shadow-lg w-[280px] h-[35%]">
              <p className="text-center text-[1.5rem] w-full font-semibold">
                Are you sure you want to delete this course?
              </p>
              <div className="flex justify-between w-full px-4 mt-8">
                <button className="button-global" onClick={handleDelete}>
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
                <button className="button-global" onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default AllCourses;
