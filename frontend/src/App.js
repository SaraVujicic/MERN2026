import "./App.css";
import { Outlet } from "react-router-dom";
import  Header  from "./components/Header";
import  Footer  from "./components/Footer";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import SummaryApi from "./common";
import Context from "./context";
import { setUserDetails } from "./store/userSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const [cartProductCount,setCartProductCount] = useState(0)
  const skipAppBootstrapRequests = ["/success", "/cancel"].includes(location.pathname)
  
  const fetchUserDetails = async()=>{
    try {
      const dataResponse = await fetch(SummaryApi.current_user.url,{
        method : SummaryApi.current_user.method,
        credentials : 'include'
      })

      if (!dataResponse.ok) {
        return
      }

      const dataApi = await dataResponse.json()

      if(dataApi.success){
        dispatch(setUserDetails(dataApi.data))
      }
    } catch (error) {
      console.warn('Unable to load current user details:', error?.message || error)
    }
  }

  const fetchUserAddToCart = async()=>{
    try {
      const dataResponse = await fetch(SummaryApi.addToCartProductCount.url,{
        method : SummaryApi.addToCartProductCount.method,
        credentials : 'include'
      })

      if (!dataResponse.ok) {
        return
      }

      const dataApi = await dataResponse.json()

      setCartProductCount(dataApi?.data?.count || 0)
    } catch (error) {
      console.warn('Unable to load cart count:', error?.message || error)
      setCartProductCount(0)
    }
  }

 useEffect(()=>{
    if (skipAppBootstrapRequests) {
      return
    }

    /**user Details */

    fetchUserDetails()
    /**user Details cart product */
    fetchUserAddToCart()

  },[skipAppBootstrapRequests])
  return (
   <>
   <Context.Provider value= {{
     fetchUserDetails, // user details fetch
     cartProductCount,  //current user add to cart product count,
     fetchUserAddToCart
   }}>
    <ToastContainer 
     position='top-center'
    />
    
    <Header/>
       <main className="min-h-[calc(100vh-120px)] pt-16">
        <Outlet/>
       </main>
       <Footer/>
       </Context.Provider>
       </>
    
  );
}

export default App;
