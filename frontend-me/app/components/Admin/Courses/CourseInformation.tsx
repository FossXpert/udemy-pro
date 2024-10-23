import React, { FC, useState } from 'react'
import '../../../css/css-admin/courseinformation.css'
import { TextareaAutosize } from '@mui/material'

type Props = {
  handleSubmit:any
  active : number;
  setActive : (active : number) => void;
  courseInfo : {
    name : string;
    description : string;
    price : string;
    estimatedPrice : string;
    tags : string;
    level : string;
    demoUrl : string;
    thumbnail : string;
  },
  setCourseInfo : (courseInfo : {
    name : string;
    description : string;
    price : string;
    estimatedPrice : string;
    tags : string;
    level : string;
    demoUrl : string;
    thumbnail : string;
  }) => void;
}

const CourseInformation:FC<Props> = ({handleSubmit:handleSubmit1,active,setActive,courseInfo,setCourseInfo}) => {


  const [dragged,setDragged]  = useState(false);

  const handleFormSubmit = () => {
    console.log("Clicked form")
  }
  const handleDragOver = () => {
    setDragged(true)
  }

  const handleDragLeave = () => {
    setDragged(false)
  }
  const handleDrop = (e:any) => {
    console.log("handle Drop");
    e.preventDefault();

    const fileReader = new FileReader();
    fileReader.onload = () => {
      if(fileReader.readyState === 2) {
        const avatar = fileReader.result as string;
        console.log(avatar);
      }
    }
    fileReader.readAsDataURL(e.target.files[0])
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    console.log("Inside CourseInformation")
    console.log("CourseInfo is :",courseInfo);
    console.log("CourseData is : ",await handleSubmit1());
  }

  return (
    <form onSubmit={handleSubmit}>
    <div className='course-information-container'>
        <h2>Course Information</h2>
        <div className='form'>
          <div className='group-1'>
            <label htmlFor=''>Course Name</label>
            <input
              className='input-box-1'
              type='text' 
              name='course-name' 
              placeholder='Please Enter Course Name' 
              value={courseInfo.name}
              onChange={(e)=>setCourseInfo({...courseInfo,name:e.target.value})}
            />
          </div>
          <div className='group-2'>
            <label htmlFor=''>Course Description</label>
            <textarea 
              name='course-description' 
              placeholder='Please Enter Course Description' 
              rows={10} 
              cols={117} 
              value={courseInfo.description}
              onChange={(e)=>setCourseInfo({...courseInfo,description:e.target.value})}
              className='input-textarea-1'
            />
          </div>
          <div className='group-3'>
            <div className='group-3-1'>
              <label htmlFor=''>Course Price</label>
              <input
              className='input-box-1'
              type='text' 
              name='course-price' 
              placeholder='Please Enter Course Price' 
              value={courseInfo.price}
              onChange={(e)=>setCourseInfo({...courseInfo,price:e.target.value})}
            />
            </div>
            <div className='group-3-2'>
              <label htmlFor=''>Est. Price (optional)</label>
              <input
              className='input-box-1'
              type='text' 
              name='course-estimated-price' 
              placeholder='Please Enter Estimated Course Price' 
              value={courseInfo.estimatedPrice}
              onChange={(e)=>setCourseInfo({...courseInfo,estimatedPrice:e.target.value})}
            />
            </div>
          </div>
          <div className='group-4'>
          <label htmlFor=''>Course Tags</label>
            <textarea
              name='course-tags' 
              placeholder='Please Enter Tags' 
              rows={6} 
              cols={117} 
              className='input-textarea-2'
              value={courseInfo.tags}
              onChange={(e)=>setCourseInfo({...courseInfo,tags:e.target.value})}
            />
          </div>
          <div className='group-3'>
            <div className='group-3-1'>
              <label htmlFor=''>Course Level</label>
              <input
              className='input-box-1'
              type='text' 
              name='course-level' 
              placeholder='Enter Course Level' 
              value={courseInfo.level}
              onChange={(e)=>setCourseInfo({...courseInfo,level:e.target.value})}
            />
            </div>
            <div className='group-3-2'>
              <label htmlFor=''>Demo Url</label>
              <input
              className='input-box-1'
              type='text' 
              name='course-demo-url' 
              placeholder='Enter Demo Url' 
              value={courseInfo.demoUrl}
              onChange={(e)=>setCourseInfo({...courseInfo,demoUrl:e.target.value})}
            />
            </div>
          </div>
          <div draggable={true} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className='group-5'>
          <input className='' name='file' type='file' accept='image/*' id=''/>
          <label className={`${dragged ? "bg-blue-500" : "bg-transparent"}`} htmlFor='file'>
            <span>Drag and drop an image here</span>
          </label>
          </div>
          <div className='create-course-buttons'>
            <button type='submit' value ='next' className='button-global' onClick={()=>setActive(2)}>Next</button>
          </div>
        </div>
    </div>
    </form>
  )
}

export default CourseInformation