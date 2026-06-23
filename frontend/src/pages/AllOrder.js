import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'

const AllOrder = () => {
  const [allOrder, setAllOrder] = useState([])

  const fetchAllOrder = async () => {
    const response = await fetch(SummaryApi.allOrder.url, {
      method: SummaryApi.allOrder.method,
      credentials: 'include'
    })

    const dataResponse = await response.json()

    if (dataResponse.success) {
      setAllOrder(dataResponse.data || [])
      return
    }

    if (dataResponse.message) {
      toast.error(dataResponse.message)
    }
  }

  useEffect(() => {
    fetchAllOrder()
  }, [])

  return (
    <div className='bg-white pb-4 overflow-auto'>
      <table className='w-full userTable'>
        <thead>
          <tr className='bg-black text-white'>
            <th>Sr.</th>
            <th>Email</th>
            <th>Items</th>
            <th>Total</th>
            <th>Payment Status</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {allOrder.map((order, index) => (
            <tr key={order?._id || index}>
              <td>{index + 1}</td>
              <td>{order?.email}</td>
              <td>{order?.productDetails?.length || 0}</td>
              <td>{order?.totalAmount}</td>
              <td>{order?.paymentDetails?.payment_status || 'Pending'}</td>
              <td>{moment(order?.createdAt).format('LL')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AllOrder