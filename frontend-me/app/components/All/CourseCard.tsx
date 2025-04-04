import Image from 'next/image';
import React, { FC, useEffect } from 'react'
import Rating from '@mui/material/Rating';
import { useAddToCartMutation, useGetCartStatusQuery } from '../../../redux/features/cart/cartApi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useDeleteBoughtCourseByIdMutation, useDeleteSingleCourseMutation } from '../../../redux/features/courses/courseApi';



type Props = {
    id: string;
    name : string;
    postedBy : {
      userId : string;
      email : string;
      name : string;
    };
    price : string;
    estimatedPrice : string;
    tags : string;
    thumbnail : {
      url: string;
    };
    level : string;
    demoUrl : string;
    totalVideos : string;
    cartDisable : boolean;
    path : string;
    showDelete?: boolean;
    onDelete?: () => void;
}
const border = '';
const CourseCard:FC<Props> = ({id,name,postedBy,price,estimatedPrice,tags,thumbnail,level,demoUrl,totalVideos,cartDisable,path, showDelete = false, onDelete}) => {
  
  const [addToCart,{isSuccess,isLoading,error}] = useAddToCartMutation();
  const {refetch} = useGetCartStatusQuery({},{refetchOnMountOrArgChange:true});
  const [deleteBoughtCourseById,{isSuccess:deleteSuccess,isLoading:deleteLoading,error:deleteError}] = useDeleteBoughtCourseByIdMutation();
  const router = useRouter();

  useEffect(() => {
    if(isSuccess){
        toast.success("Added to cart", {
            duration: 2000,
            id: `addToCart-${id}`,
            position: 'top-center'
        });
        refetch();
    }
  }, [isSuccess, id, refetch]);

  useEffect(() => {
    if(error){
        if('data' in error){
            const errorData = error as any;
            toast.error(errorData.message, {
                duration: 3000,
                id: `addToCartError-${id}`,
                position: 'top-center'
            });
        }
    }
  }, [error, id]);

  const handleOnClick = () => {
    console.log("Clicked");
    console.log("id is : ",id);
  } 
    const handleAddToCart = async() => {
        try {
            await addToCart(id);
        } catch (err) {
            console.error("Error adding to cart:", err);
        }
    }
  
  
    const handleDelete = async () => {
      await deleteBoughtCourseById(id);
    };

  return (
    <>
        <div onClick={handleOnClick} className={`flex flex-col bg-[rgb(249,250,251)] w-[250px] h-[310px] p-2 ${border} border-[1px] border-solid border-gray-300 rounded-sm shadow-md shadow-grey-700`}>
            <div className={`flex flex-col w-full h-[185px] ${border}`}>
            <div 
              onClick={() => router.push(`${path}/${id}`)} 
              className='no-underline text-black cursor-pointer'
            >
              <Image src={thumbnail?.url || ''} alt='text' width={250} height={185} loading='lazy' />
            </div>
            </div>
            <div className={`flex flex-col w-full h-[125px] ${border} !border-red-500`}>
              <div className={`flex w-full h-[45px] overflow-hidden ${border}`}>
                <p className={`m-0 text-[1.1rem] font-semibold`}>{name}</p>
              </div>
              <div className={`flex w-full h-[20px] items-center ${border}`}>
                <p className={`m-0 text-[0.7rem] font-[400] text-[rgb(82,82,82)]`}>{postedBy?.name}</p>
              </div>
              <div className={`flex w-full h-[25px] mt-1 justify-between items-center ${border}`}>
                  <div className={`flex w-[full] h-[auto] bg-[rgb(225,244,232)] justify-center leading-5 rounded-[9999px] ${border}`}>
                    <p className={`text-[.85rem] px-1 text-[rgb(21,168,61)] font-semibold`}>{level}</p>
                  </div>
                  <div className={`flex w-auto h-[22px] justify-center ${border}`}>
                  <Rating
                    size='small'
                    name="simple-controlled"
                    value={3}
                    precision={0.5}
                    readOnly
                  />
                  </div>
              </div>
              <div className={`flex w-full h-[25px] mt-1 justify-between items-center ${border}`}>
                <div className='flex'>
                  {price === estimatedPrice ? (
                    <p className={`m-0 text-[0.8rem] font-semibold text-[rgb(82,82,82)]`}>${price}</p>
                  ) : (
                    <p className={`flex m-0 text-[0.8rem] gap-2 font-semibold text-[rgb(82,82,82)]`}> 
                    ${price}
                     {estimatedPrice && <span className={`text-[rgb(82,82,82)] line-through`}>${estimatedPrice}
                     </span>}
                    </p>
                  )}
                </div>
                <div className='flex gap-2'>
                  {cartDisable ? (
                    <span className="text-green-600 font-medium">Enrolled</span>
                  ) : (
                    <button 
                      className='button-global !h-[1.5rem]' 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart();
                      }}
                    >
                      {isLoading ? "Adding..." : "Add to Cart"}
                    </button>
                  )}
                  
                  {showDelete && (
                    <button 
                      className='bg-red-500 hover:bg-red-600 text-white rounded-md px-2 !h-[1.5rem] text-sm'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
        </div>
    </>
  )
}

export default CourseCard