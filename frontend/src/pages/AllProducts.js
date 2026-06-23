import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common'
import AdminProductCard from '../components/AdminProductCard'

const AllProducts = () => {
  const [openUploadProduct,setOpenUploadProduct] = useState(false)
  const [allProduct,setAllProduct] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [totalProduct, setTotalProduct] = useState(0)
  const limit = 12

  const fetchAllProduct = async(page = currentPage) => {
   const response = await fetch(`${SummaryApi.allProduct.url}?page=${page}&limit=${limit}`)
   const dataResponse = await response.json()

   console.log("product data",dataResponse)

   setAllProduct(dataResponse?.data || [])
   setTotalProduct(dataResponse?.totalProduct || 0)
   setTotalPage(dataResponse?.totalPage || 1)
  }

  useEffect(()=>{
    fetchAllProduct(currentPage)
  },[currentPage])

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPage) {
      return
    }

    setCurrentPage(pageNumber)
  }

  const startItem = totalProduct === 0 ? 0 : ((currentPage - 1) * limit) + 1
  const endItem = Math.min(currentPage * limit, totalProduct)

  return (
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>All products</h2>
        <button className='border-2  border-r-pink-300 text-pink-500 hover:bg-pink-600 hover:text-white transition-all py-1 px-3 rounded-full ' onClick={()=>setOpenUploadProduct(true)}>Upload product</button>
      </div>

       
      {/**all product */}

       <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-240px)] overflow-y-scroll '>
        {
           allProduct.map((product,index)=>{
            return (
              <AdminProductCard data={product} key={index+"allProduct"} fetchdata={fetchAllProduct}/>
             
            )
           })
        }
       </div>

      <div className='bg-white border-t px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <p className='text-sm text-slate-600'>
          Showing {startItem}-{endItem} of {totalProduct} products
        </p>

        <div className='flex items-center gap-2 flex-wrap'>
          <button
            className='px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPage }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              className={`px-3 py-1 rounded border transition-colors ${
                pageNumber === currentPage
                  ? 'bg-pink-500 text-white border-pink-500'
                  : 'hover:bg-slate-50'
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          <button
            className='px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPage}
          >
            Next
          </button>
        </div>
      </div>




      {/** upload product component */}
      {
        openUploadProduct && (
          <UploadProduct onClose={()=>setOpenUploadProduct(false)} fetchData={fetchAllProduct}/>
        )
      }
     

    </div>
  )
}

export default AllProducts