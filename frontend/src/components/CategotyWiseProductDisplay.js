import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import scrollTop from '../helpers/scrollTop'

const CategoryWiseProductDisplay = ({category, heading}) => {

    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)
    const loadingList = new Array(3).fill(null)

    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart =async(e,id)=>{
    await addToCart(e,id)
    fetchUserAddToCart()
    }

    const fetchData = async() =>{
      setLoading(true)
      const categoryProduct = await fetchCategoryWiseProduct(category)
      setLoading(false)

      console.log("horizontal data",categoryProduct.data)

      setData(categoryProduct?.data)

    }

    useEffect(()=>{
      fetchData()
    },[])

  return (
    <div className='container mx-auto px-4 my-6 relative'>
        <h2 className='text-2xl font-semibold py-4'>{heading}</h2>


      <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,320px))] justify-between md:gap-6 overflow-scroll scrollbar-none transition-all'>
      {
        loading ? (
          loadingList.map((product,index)=>{
            return (
              <div className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex'>
              <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] animate-pulse '>
              
    
              </div>
              <div className='p-4 grid w-full gap-2 '>
                <h2 className='font-medium text-base mg:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse p-1 rounded-full'></h2>
                <p className='capitalize text-slate-500 p-1 bg-slate-200 animate-pulse  rounded-full'></p>
                <div className='flex gap-3 w-full '>
                  <p className='text-red-600 font-medium p-1 bg-slate-200 w-full animate-pulse  rounded-full'></p>
                  <p className='text-slate-500 line-through p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
                  </div>
                  <button className='text-sm  text-white px-3 py-0.5 rounded-full w-full bg-slate-200 animate-pulse p-1 '></button>
              </div>
            </div>
            )
          })
        ) : (
          data.map((product,index)=>{
            return (
              <Link to={"product/"+product?._id} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex' onClick={scrollTop}>
              <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] '>
               <img src={product.productImage[0]} className='object-scale-down h-full hover:scale-110 transition-all'/>
    
              </div>
              <div className='p-4 grid '>
                <h2 className='font-medium text-base mg:text-lg text-ellipsis line-clamp-1 text-black'>{product?.productName}</h2>
                <p className='capitalize text-slate-200'>{product?.category}</p>
                <div className='flex gap-3 '>
                  <p className='text-pink-600 font-medium'>{displayINRCurrency(product?.sellingPrice) }</p>
                  <p className='text-slate-500 line-through'>{displayINRCurrency(product?.price)}</p>
                  </div>
                  <button className='text-sm bg-pink-300 hover:bg-pink-500 text-white px-3 py-0.5 rounded-full' onClick={(e)=>handleAddToCart(e,product?._id)}>Add to card</button>
              </div>
            </Link>
            )
          })
        )
        
        }
      </div>

        
    </div>
  )
}

export default CategoryWiseProductDisplay