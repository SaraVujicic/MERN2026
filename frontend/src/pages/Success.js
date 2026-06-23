import React, { useEffect, useState } from 'react'
import SUCCESSIMAGE from '../assest/success.gif'
import { Link, useLocation } from 'react-router-dom'
import SummaryApi from '../common'

const Success = () => {
  const [isConfirming, setIsConfirming] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const confirmOrder = async () => {
      const searchParams = new URLSearchParams(location.search)
      const sessionId = searchParams.get('session_id')

      if (!sessionId) {
        setIsConfirming(false)
        return
      }

      try {
        const response = await fetch(`${SummaryApi.confirmOrder.url}?session_id=${sessionId}`, {
          method: SummaryApi.confirmOrder.method,
          credentials: 'include',
        })

        if (!response.ok) {
          setErrorMessage('Narudžba trenutno nije mogla biti potvrđena.')
          setIsConfirming(false)
          return
        }

        await response.json()
        setErrorMessage('')
        setIsConfirming(false)
      } catch (error) {
        setErrorMessage('Narudžba trenutno nije mogla biti potvrđena.')
        setIsConfirming(false)
      }
    }

    confirmOrder()
  }, [location.search])

  return (
    <div className='bg-slate-200 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 m-2 rounded'>
      <img
        src={SUCCESSIMAGE}
        width={150}
        height={150}
      />
      <p className='text-green-600 font-bold text-xl'>Payment Successfully</p>
      {isConfirming ? (
        <p className='mt-4 text-slate-600'>Finalizing your order...</p>
      ) : (
        <Link to={"/order"} className='p-2 px-3 mt-5 border-2 border-green-600 rounded font-semibold text-green-600 hover:bg-green-600 hover:text-white'>See Order</Link>
      )}
      {errorMessage && (
        <p className='mt-3 text-sm text-red-600 text-center'>{errorMessage}</p>
      )}
    </div>
  )
}

export default Success