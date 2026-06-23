import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate} from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import VerticalCard from '../components/VerticalCard'
import SummaryApi from '../common'

const CategoryProduct = () => {
    const [data,setData]= useState([])
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const loaction = useLocation()
    const urlSearch = new URLSearchParams(loaction.search)
    const urlCategoryListInArray = urlSearch.getAll("category")

    const urlCategoryListObject = {}
    urlCategoryListInArray.forEach(el =>{
      urlCategoryListObject[el] = true
    })
    

    const [selectCategory,setSelectCategory] = useState(urlCategoryListObject)
    const [filterCategoryList,setFilterCategoryList] = useState(urlCategoryListInArray)

    const [sortBy,setSortBy] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [totalProduct, setTotalProduct] = useState(0)
    const limit = 12





    const fetchData =async(page = currentPage)=>{
      setLoading(true)
      try {
        const response =await fetch(SummaryApi.filterProduct.url,{
          method : SummaryApi.filterProduct.method,
          headers : {
            "content-type" : "application/json"
          },
          body : JSON.stringify({
            category : filterCategoryList,
            page,
            limit
          })
        })

        const dataResponse =await response.json()

        setData(dataResponse?.data || []) 
        setTotalProduct(dataResponse?.totalProduct || 0)
        setTotalPage(dataResponse?.totalPage || 1)
      } finally {
        setLoading(false)
      }

   
    }

    const handleSelectCategory =(e)=>{
      const {value,checked} = e.target
      setCurrentPage(1)
      const nextSelectCategory = {
        ...selectCategory,
        [value] : checked
      }

      const arrayOfCategory = Object.keys(nextSelectCategory).map(categoryKeyName =>{
        if(nextSelectCategory[categoryKeyName]){
          return categoryKeyName
        }

        return null
      }).filter(el => el)

      setSelectCategory(nextSelectCategory)
      setFilterCategoryList(arrayOfCategory)

      const urlformat = arrayOfCategory.map((el,index) => {
        if((arrayOfCategory.length - 1) === index){
          return `category=${el}`
        }

        return `category=${el}&`
      })

      navigate("/product-category?"+urlformat.join(""))


    }

  useEffect(()=>{
    fetchData(currentPage)
  },[filterCategoryList, currentPage])

    const handlePageChange = (pageNumber) => {
      if (pageNumber < 1 || pageNumber > totalPage) {
        return
      }

      setCurrentPage(pageNumber)
    }

    const startItem = totalProduct === 0 ? 0 : ((currentPage - 1) * limit) + 1
    const endItem = Math.min(currentPage * limit, totalProduct)

    const handleOnChangesSortBy = (e)=>{
      const {value} = e.target

      setSortBy(value)

      if(value === 'asc'){
        setData(preve => [...preve].sort((a,b)=> a.sellingPrice - b.sellingPrice))
      }


      if(value === 'dsc'){
        setData(preve => [...preve].sort((a,b)=> b.sellingPrice - a.sellingPrice))
      }
    }

    useEffect(()=>{

    },[sortBy])
  

  return (
    <div className='container mx-auto p-4'>

      {/**desktop version */}
      <div className='hidden lg:grid grid-cols-[200px,1fr]'>
         {/**left side */}
         <div className='bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll'>
          {/**sort by */}
          <div className=''>
            <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by:</h3>
            <form className='text-sm flex flex-col gap-2 py-2'>
              <div className='flex items-center gap-3 '>
                <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangesSortBy} value={"asc"}  />
                <label>Price - Low to High</label>
              </div>

              <div lassName='flex items-center gap-3 '>
                <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangesSortBy} value={"dsc"}  />
                <label>Price - High to Low</label>
              </div>
            </form>
          </div>
           {/**filter by */}
          <div className=''>
            <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category:</h3>
            <form className='text-sm flex flex-col gap-2 py-2'>
             {
              productCategory.map((categoryName,index)=>{
                return (
                  <div className='flex items-center gap-3'>
                    <input type='checkbox' name={"categoty"} checked={selectCategory[categoryName?.value]} value={categoryName?.value} id={categoryName?.value} onChange={handleSelectCategory}/>
                    <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                  </div>
                )
              })
             }
            </form>
          </div>
         </div>

           {/**right side(product) */}
           <div className='px-4'>
             <p className='font-medium text-slate-800 text-lg my-2'>Search Results : {startItem}-{endItem} of {totalProduct} </p>
            <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
            {
              data.length !== 0 &&  (
                <VerticalCard data={data} loading={loading}/>
              )
            }
            </div>

            <div className='flex items-center justify-between gap-3 py-4 flex-wrap'>
              <button
                className='px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Prev
              </button>

              <div className='flex items-center gap-2 flex-wrap'>
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
              </div>

              <button
                className='px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPage}
              >
                Next
              </button>
            </div>
          </div>
      </div>
       
    </div>
  )
}

export default CategoryProduct