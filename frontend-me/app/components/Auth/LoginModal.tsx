'use client'
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import '../../css/loginModal.css';
import { FaRegWindowClose } from 'react-icons/fa';
import { FaApple, FaGithub, FaGoogle } from 'react-icons/fa6';
import Link from 'next/link';
// import { useRouter } from 'next/router';


import { z } from 'zod';
import { useFormik } from 'formik';
import { useLoginMutation, 
  useSignupMutation, 
  useVerificationMutation 
} from '../../../redux/features/auth/authApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useLoadUserQuery } from '../../../redux/features/api/apiSlice';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  route: string;
  setRoute: (route: string) => void;
};

const LoginModal: FC<Props> = ({ open, setOpen, route, setRoute }) => {


  const [login, { data ,isSuccess : loginSuccess,error:loginError}] = useLoginMutation();
  const [signup, { isLoading, data: signupData, error,isSuccess }] = useSignupMutation();
  const [verification,{isSuccess : verifySuccess, data : verifyData, error: verifyError}] = useVerificationMutation();
  const token = useSelector((state:any) => state.auth.token);
  const [num,setNum]=useState(true);
  const {data:userData,isSuccess:userSuccess,error:userError} = useLoadUserQuery({});

  useEffect(()=>{
    if(isSuccess){
      num ? toast.success("Otp sent on Email"):toast.success("Correct Otp has been sent- on Email");
      setNum(false);
    }
    if(error){
      if("data" in error){
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
    if(loginSuccess){
      toast.success("Logged In");
      // router.push("/")
      handleClose();
    }
    if(loginError){
      if("data" in loginError){
        const errorData = loginError as any;
        toast.error(errorData.data.message);
      }
    }
    // if(userSuccess){
    //   toast.success("User fetched successfully");
    // }
    // if(userError){
    //   if("data" in userError){
    //     const errorData = userError as any;
    //     toast.error(errorData.data.message);
    //   }
    // }
    if(verifySuccess){
      toast.success("Otp verified,PLease Login");
      setRoute('signin')
    }
    if(verifyError){
      if("data" in verifyError){
        const errorData = verifyError as any;
        toast.error(errorData.data.message);
      }
    }
  },[isSuccess,error,verifySuccess,verifyError,loginSuccess,loginError]);

  
  
  
  // Schema validation for signup
  const signupSchema = z.object({
    name: z.string().min(1, { message: `Name must not be empty` }),
    email: z.string().email({ message: 'Enter valid email' }),
    password: z.string().min(6, { message: 'Enter valid password' }),
  });

  // Schema validation for signin
  const signinSchema = z.object({
    email: z.string().email({ message: 'Enter valid email' }),
    password: z.string().min(6, { message: 'Enter valid password' }),
  });

  const otpSchema = z.object({
    otp : z.string().length(4,{message : 'Otp Must be 4 Digits'}).regex(/^\d{4}$/,{message: 'Otp must contain digits only'}),
    authToken : z.string()
  })
  // Formik instance for signup
  const signupFormik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validate: (values) => {
      try {
        signupSchema.parse(values);
        return {};
      } catch (e: any) {
        return e.formErrors.fieldErrors;
      }
    },
    onSubmit: async (values) => {
      try {
        const result = await signup(values).unwrap();
        if (result) {
          console.log(result);
          setRoute('verification')
        }
      } catch (error) {
        console.log(error);
        toast.error("Error Occured");
      }
    },
  });

  // Formik instance for signin
  const signinFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      try {
        signinSchema.parse(values);
        return {};
      } catch (e: any) {
        return e.formErrors.fieldErrors;
      }
    },
    onSubmit: async (values) => {
      try {
        const result = await login(values).unwrap();
        console.log('signin values', values);
        console.log('Login Successfull', result)
        if (result) {
          toast.success("Logged In Successfully");
        }
      } catch (error: any) {
        console.log('Login failed', error)
        throw error;
      }
    },
  });

  const otpFormik = useFormik({
    initialValues: {
      otp : '',
      authToken : ''
    },
    validate: (values) =>{
      try {
        console.log(values)
        otpSchema.parse(values);
        return {};
      } catch (e:any) {
        console.log("In Catch");
        console.log("token is",token);
        console.log(e.errors[0].message);
        toast.error(e.errors[0].message)
        return e.errors[0].message
      }
    },
    onSubmit: async ({otp,authToken}) => {
      console.log('clicked')
      // console.log(otp,authToken);
      try {
        authToken = token;
        await verification({otp,authToken})
      } catch (e:any) {
        console.log(e.errors[0].message);
        toast.error(e.errors[0].message)
        return e.errors[0].message;
      }
    }
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div>
        <Modal open={open} onClose={handleClose}>
          <Box>
            {route === 'signup' && (
              <Box className="signup">
                <div className="signup-wrapper-1">
                  <FaRegWindowClose className="icon1" onClick={handleClose} />
                  <h2>Sign up</h2>
                </div>
                <form onSubmit={signupFormik.handleSubmit}>
                  <div className="signup-wrapper-2">
                    <div className="text-box-label">
                      <label htmlFor="name">Name</label>
                      <input
                        className="text-1"
                        type="text"
                        placeholder="Enter Your Name"
                        name="name"
                        id="name"
                        value={signupFormik.values.name}
                        onChange={signupFormik.handleChange}
                      />
                      {signupFormik.errors.name && (
                        <div>{signupFormik.errors.name}</div>
                      )}
                    </div>
                    <div className="text-box-label">
                      <label htmlFor="email">Email</label>
                      <input
                        className="text-1"
                        type="email"
                        placeholder="Enter Your Email"
                        name="email"
                        id="email"
                        value={signupFormik.values.email}
                        onChange={signupFormik.handleChange}
                      />
                      {signupFormik.errors.email && (
                        <div>{signupFormik.errors.email}</div>
                      )}
                    </div>
                    <div className="text-box-label">
                      <label htmlFor="password">Password</label>
                      <input
                        className="text-1"
                        type="password"
                        placeholder="Enter Your Password"
                        name="password"
                        id="password"
                        value={signupFormik.values.password}
                        onChange={signupFormik.handleChange}
                      />
                      {signupFormik.errors.password && (
                        <div>{signupFormik.errors.password}</div>
                      )}
                    </div>
                    <div className="text-box-label">
                      <label htmlFor="cpassword">Confirm Password</label>
                      <input
                        className="text-1"
                        type="password"
                        placeholder="Enter Confirm Password"
                        name="cpassword"
                        id="cpassword"
                        value={signupFormik.values.password}
                        onChange={signupFormik.handleChange}
                      />
                      {signupFormik.errors.password && (
                        <div>{signupFormik.errors.password}</div>
                      )}
                    </div>
                    <div className="button">
                      <button type="submit" className="submit">
                        Confirm
                      </button>
                      <button
                        type="button"
                        className="cancel"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
                <div className="signup-wrapper-3-big">
                  Or, Sign Up With
                  <div className="signup-wrapper-3">
                    <FaApple className="icon2" />
                    <FaGoogle className="icon2" />
                    <FaGithub className="icon2" />
                  </div>
                  <div className="signup-wrapper-4">
                    Sign In?
                    <Link
                      href="#"
                      onClick={() => setRoute('signin')}
                      className="link"
                    >
                      Click Me
                    </Link>
                  </div>
                </div>
              </Box>
            )}
            {route === 'signin' && (
              <Box className="signup">
                <div className="signup-wrapper-1">
                  <FaRegWindowClose className="icon1" onClick={handleClose} />
                  <h2>Sign In</h2>
                </div>
                <form onSubmit={signinFormik.handleSubmit}>
                  <div className="signup-wrapper-2">
                    <div className="text-box-label">
                      <label htmlFor="email">Email</label>
                      <input
                        className="text-1"
                        type="email"
                        placeholder="Enter Your Email"
                        name="email"
                        id="email"
                        value={signinFormik.values.email}
                        onChange={signinFormik.handleChange}
                      />
                      {signinFormik.errors.email && (
                        <div>{signinFormik.errors.email}</div>
                      )}
                    </div>
                    <div className="text-box-label">
                      <label htmlFor="password">Password</label>
                      <input
                        className="text-1"
                        type="password"
                        placeholder="Enter Your Password"
                        name="password"
                        id="password"
                        value={signinFormik.values.password}
                        onChange={signinFormik.handleChange}
                      />
                      {signinFormik.errors.password && (
                        <div>{signinFormik.errors.password}</div>
                      )}
                    </div>
                    <div className="button">
                      <button type="submit" className="submit">
                        Confirm
                      </button>
                      <button
                        type="button"
                        className="cancel"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
                <div className="signup-wrapper-3-big">
                  Or, Sign In With
                  <div className="signup-wrapper-3">
                    <FaApple className="icon2" />
                    <FaGoogle className="icon2" />
                    <FaGithub className="icon2" />
                  </div>
                  <div className="signup-wrapper-4">
                    Sign Up?
                    <Link
                      href="#"
                      onClick={() => setRoute('signup')}
                      className="link"
                    >
                      Click Me
                    </Link>
                  </div>
                </div>
              </Box>
            )}
            {route === 'verification' && (
              <Box className="signup">
                <div className="signup-wrapper-1">
                  <FaRegWindowClose className="icon1" onClick={handleClose} />
                  <h2>Verify OTP</h2>
                </div>
                <form onSubmit={otpFormik.handleSubmit}>
                  <div className="signup-wrapper-2">
                    <div className="text-box-label">
                      <label htmlFor="otp">OTP</label>
                      <input
                        className="text-1"
                        type="text"
                        placeholder="Enter OTP"
                        name="otp"
                        id="otp"
                        value={otpFormik.values.otp}
                        onChange={otpFormik.handleChange}
                      />
                      {otpFormik.errors.otp && (
                        <div>{otpFormik.errors.otp}</div>
                      )}
                    </div>
                    <div className="button">
                      <button type="submit" className="submit">
                        Confirm
                      </button>
                      <button
                        type="button"
                        className="cancel"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
                <div className="signup-wrapper-3-big">
                  Or, Go Back
                  <div className="signup-wrapper-4">
                    <Link
                      href="#"
                      onClick={() => setRoute('signup')}
                      className="link"
                    >
                      Click Me
                    </Link>
                  </div>
                </div>
              </Box>
            )}
          </Box>
        </Modal>
      </div>
    </>
  )
}

export default LoginModal;
