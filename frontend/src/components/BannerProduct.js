import React, { useEffect, useState } from 'react'
import bannerImage from '../assest/bannerImage.jpg'
import banner from '../assest/banner.jpg';
import banner1 from '../assest/banner1.jpg';
import banner2 from '../assest/banner2.jpg';
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";

const BannerProduct = () => {
    const [currentImage, setCurrentImage] = useState(0)

    const desktopImages = [
        bannerImage,
        banner,
        banner1,
        banner2

    ]

    const nextImage = () =>{
        if(desktopImages.length-1 > currentImage){
         setCurrentImage(preve => preve+1)
        }

       
    }

    const preveImage = () =>{
        if(currentImage != 0 ){
         setCurrentImage(preve => preve-1)
        }
    }

        useEffect(()=>{
            const interval = setInterval(()=>{
                if(desktopImages.length-1 > currentImage){
                    nextImage()
                }else {
                    setCurrentImage(0)
                }
            },5000)

            return ()=>clearInterval(interval)
        },[currentImage])

       
    
    return (
        <div className='container mx-auto px-4 rounded'>
            <div className='h-60 md:h-72 w-full bg-slate-200 relative'>
                <div className='absolute z-10 h-full w-full md:flex items-center hidden'>
                    <div className='flex justify-between w-full text-2xl'>
                        <button onClick={preveImage} className='bg-white shadow-md rounded-full p-1'><FaAngleLeft /></button>
                        <button onClick={nextImage} className='bg-white shadow-md rounded-full p-1'><FaAngleRight /></button>
                    </div>

                </div>
                <div className='flex h-full w-full overflow-hidden '>
                    {
                        desktopImages.map((imageURL, index) => {
                            return (
                                <div className='w-full h-full min-w-full min-h-full transition-all' key={imageURL} style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                                    <img src={imageURL} className='w-full h-full' />
                                </div>

                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export default BannerProduct