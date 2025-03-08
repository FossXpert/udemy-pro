import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import '../../css/css-profile/myaccount.css'
import { CiCamera } from 'react-icons/ci'
import { useUpdateProfilePictureMutation, useUpdateUserInfoMutation } from '../../../redux/features/auth/authApi'
import toast from 'react-hot-toast'
import { useLoadUserQuery } from '../../../redux/features/api/apiSlice'

type Props = {}

const MyAccount = (props: Props) => {
    const {user} = useSelector((state:any) => state.auth);
    const [loadUser,setLoadUser] = useState(false);
    const [updateUserInfo,{isSuccess,error,data,isLoading}] = useUpdateUserInfoMutation();
    const [name,setName] = useState(user?.name || '');
    const { data:isData, isLoading: loadUserLoading, error: loadUserError, refetch } = useLoadUserQuery({}, {
        refetchOnMountOrArgChange: true
    });

    const [updateProfilePicture, {isSuccess:pSuccess,error:perror,isLoading:ploading}] = useUpdateProfilePictureMutation();

    useEffect(()=>{
        if(isSuccess){
            toast.success("Name updated successfully", {duration: 2000});
            refetch();
        }
        if(error){
            if('data' in error){
                const errorData = error as any;
                toast.error(errorData.data.message,{duration:2000});
            }
        }
        if(ploading){
            toast.loading("Uploading image...",{id: 'uploadImage'});
        }
        if(pSuccess){
            toast.success("Profile picture updated",{duration:2000});
            toast.dismiss('uploadImage');
            setLoadUser(true);
        }
        if(perror){
            if('data' in perror){
                const errorData = perror as any;
                toast.error(errorData.data.message,{duration:2000});
                toast.dismiss('uploadImage');
            } 
        }
    },[isSuccess, error, pSuccess, perror, ploading, refetch]);

    const imageHandle = async(e:any) => {
        const file = e.target.files[0];
        if (!file) return;
        const fileReader = new FileReader();
        fileReader.onload = async() => {
            if(fileReader.readyState === 2){
                const avatar = fileReader.result as string;
                try {
                    await updateProfilePicture({
                        avatar
                    });
                    await refetch();
                } catch (error) {
                    toast.error("Failed to update profile picture");
                    console.error("Profile picture error:", error);
                }
            }
        };
        fileReader.readAsDataURL(file);
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        try {
            await updateUserInfo({
                name: name.trim()
            });
        } catch (error) {
            toast.error("Failed to update name");
            console.error(error);
        }
    }

    const handleEmailClick = () => {
        toast.error("Email cannot be changed!", {
            icon: '⚠️',
            style: {
                borderRadius: '10px',
                background: '#fff',
                color: '#ff0000',
            },
            duration: 3000,
        });
    };

    return (
    <div className='myaccount-container'>
        <div className="image-container">
            <Image
             className='myaccount-image' 
             src={user?.avatar?.url} 
             width={64} height={64} alt='No'/>
             <input 
             type='file'
             name=''
             id='avatar'
             className='file-input'
             onChange={imageHandle}
             accept='image/png,image/jpeg,image/jpg,image/webp'
             />
             <div className="camera-icon" onClick={() => console.log("hi")}>
                    <CiCamera />
             </div>
        </div>
        <div className='myaccount-text'>
            <form onSubmit={handleSubmit}>
            <div className='myaccount-text-1'>
                <label htmlFor="fullname">Full Name</label>
                <input type='text'
                className='input-field'
                value={name}
                name='fullname'
                onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className='myaccount-text-1'>
                <label htmlFor="email">Email Address</label>
                <input 
                    type='text'
                    readOnly
                    className='input-field cursor-not-allowed'
                    value={user?.email}
                    name='email'
                    onClick={handleEmailClick}
                    title="Email cannot be changed"
                />
            </div>
                <button type='submit' disabled={isLoading} className='button-global'>{isLoading ? <div>Updating...</div>:<div>Submit</div>}</button>
            </form>  
        </div>
    </div>
  )
}

export default MyAccount