import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setScreen } from '../screenSlice';


const useScreenSize = () => {

    const dispatch = useDispatch();

    useEffect(() => {

        const handleResize = () => {
            const width = window.innerWidth;
            dispatch(setScreen({
                screenSize: `${width}px`,
                isMobile: window.innerWidth <= 576
            }))
        }

        window.addEventListener('resize', handleResize);
        handleResize(); //Running it first time when component Mounts
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [dispatch]);
}

export default useScreenSize