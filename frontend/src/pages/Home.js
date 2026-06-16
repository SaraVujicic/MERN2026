import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'


export const Home = () => {
  return (
    <div>
     <CategoryList/>
     <BannerProduct/>

     <HorizontalCardProduct category={"bags"} heading={"Top's Bags"}/>

     <HorizontalCardProduct category={"backpack"} heading={"Popular's Backpack"}/>


     <HorizontalCardProduct category={"wallets"} heading={"Popular's Wallets"}/>
        </div>
  )
}
export default Home