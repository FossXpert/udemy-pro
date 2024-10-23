import React, { FC, useEffect, useState } from 'react'
import CourseCard from './CourseCard'
import Header2 from '../Header2'
import { useCreateCourseMutation, useGetallcourseQuery, useGetSingleCourseQuery } from '../../../redux/features/courses/courseApi'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useAddToCartMutation, useGetCartStatusQuery, useRemoveFromCartMutation } from '../../../redux/features/cart/cartApi'
import { useCreateOrderMutation } from '../../../redux/features/order/order'

type Props = {
    productId : string;
}

const hehegreen= '';
const heheblack = '';

const Cart = () => {
  const [open,setOpen] = useState(false);
  const [route, setRoute] = useState('signin');

  const {data,isLoading,isSuccess,error,refetch} = useGetCartStatusQuery({},{refetchOnMountOrArgChange:true});
  const {data:courseData,isSuccess:courseSuccess,error:courseError,refetch:refetchCourse} = useGetallcourseQuery({},{refetchOnMountOrArgChange:true});
  const [removeFromCart,{isSuccess:removeSuccess,error:removeError}] = useRemoveFromCartMutation();
  const [createOrder,{isSuccess:createSuccess,error:createError}] = useCreateOrderMutation();

  useEffect(()=>{
    if(isSuccess){
        console.log(data);
        toast.success("Cart Items fetched successfully");
    }
    if(courseSuccess){
      refetch();
      console.log(courseData);
      // toast.success("Course Data fetched successfully");
  }
    if(error){
      if('data' in error){
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
    if(courseError){
      if('data' in courseError){
        const errorMessage = courseError as any;
        toast.error(errorMessage.data.message);
      }
    }

    if(removeSuccess){
      refetch();
      toast.success("Item removed from cart");
    }
    if(removeError){
      if('data' in removeError){
        const errorMessage = removeError as any;
        toast.error(errorMessage.data.message);
      }
    }
    if(createSuccess){
      refetch();
      toast.success("Order created successfully");
    }
    if(createError){
      if('data' in createError){
        const errorMessage = createError as any;
        toast.error(errorMessage.data.message);
      }
    }
  },[isSuccess,courseSuccess,removeSuccess,createSuccess]);


  const handleRemoveItem = async(productId:any) => {
    console.log(productId);
    const data1 = await removeFromCart(productId);
  }

  const handleBuyNow = async(productId:any) => {
   const cOrder =  await createOrder(productId);
   if(cOrder?.data?.success){
     await handleRemoveItem(productId);
   }
  }

  return (
    <>
      <div className={`flex flex-col`}>
        <Header2
          open={open}
          setOpen={setOpen}
          route={route}
          setRoute={setRoute}
        />
        <div className={`flex flex-col items-center w-full h-[100vh] ${heheblack}`}>
          <h1 className={`flex m-0 p-0 flex-col items-center w-full h-auto ${hehegreen}`}>
            Shopping Cart
          </h1>
          {
            data?.cart.items.map((value : any,index:number) => {

              const course =  courseData?.Allcourses.find((course:any) => course._id === value.product);
              console.log(course);
              return (
                <div key={index} className={`flex w-[90%] mt-2 h-auto ${hehegreen} border border-solid  border-gray-300`}>
                <Image src={course?.thumbnail?.url}
                  alt='text' width={125} height={90} />
                <div className='flex flex-col w-[40%] h-auto rounded-sm p-2 '>
                    <h4 className='m-0 p-0 text-[1.1rem] font-semibold'>{course?.name}</h4>
                    <button className='mt-6 w-[65px]' onClick={()=>handleRemoveItem(value.product)}>Remove</button>
                </div>
                <div className='flex flex-col justify-center items-center border border-solid  border-gray-300 w-[10%] h-auto rounded-sm p-2 '>
                    <p>{value.price}</p>
                </div>
                <div className='flex flex-col justify-center items-center border border-solid  border-gray-300 w-[10%] h-auto rounded-sm p-2 '>
                    <p>{value.quantity}</p>
                </div>
                <div className='flex flex-col justify-center items-center border border-solid  border-gray-300 w-[20%] h-auto rounded-sm p-2 '>
                    <p>{value.totalPrice}</p>
                </div>
                <div className='flex flex-col justify-center items-center w-[20%] h-auto rounded-sm p-2 '>
                    <button onClick={()=>handleBuyNow(value.product)}>Buy Now</button>
                </div>
              </div>
              )
            })
          }

         {
           data?.cart.items.length !==0 &&(
          <div className={`flex w-[90%] mt-2 h-auto ${hehegreen}`}>
            <div className={`flex flex-col h-auto w-[80%] ${heheblack} border border-solid  border-gray-300`}>
                <div className={`flex justify-around items-center h-[60px] w-full ${hehegreen} border border-solid  border-gray-300`}>
                    <h4>Subtotal</h4>
                    <h4>{data?.cart.subTotal}</h4>
                </div>
                <div className={`flex justify-end items-center h-[60px] w-auto ${heheblack}`}>
                    <div className={`flex justify-around items-center h-[60px] w-[30%] ${hehegreen}`}>
                        <button className='flex gap-2'>
                          <FaArrowLeftLong/>
                          Continue Shopping
                        </button>
                    </div>
                    <div className={`flex justify-around items-center h-[60px] w-[30%] ${hehegreen}`}>
                        <button>Checkout</button>
                    </div>
                </div>
            </div>
          </div>)
          }
          {
            data?.cart.items.length ===0 &&(
              <div className={`flex w-[90%] justify-center mt-2 h-auto ${hehegreen}`}>
                <h4>Your Cart is Empty</h4>
                    <div className={`flex justify-around items-center h-[60px] w-[30%] ${hehegreen}`}>
                        <button className='flex gap-2'>
                          <FaArrowLeftLong/>
                          Continue Shopping
                        </button>
                    </div>
              </div>
            )
          }
        </div>
      </div>

    </>
  )
}

export default Cart