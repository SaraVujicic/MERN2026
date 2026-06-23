const stripe = require('../../config/stripe')
const userModel = require('../../models/userModel')

const resolveImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') {
        return undefined
    }

    if (/^https?:\/\//i.test(imagePath)) {
        return imagePath
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    return new URL(imagePath.startsWith('/') ? imagePath : `/${imagePath}`, frontendUrl).toString()
}

const paymentController = async(request,response)=>{
    try {
        const { cartItems } = request.body

        const user = await userModel.findOne({ _id : request.userId })

        const params = {
            submit_type : 'pay',
            mode : "payment",
            payment_method_types : ['card'],
            billing_address_collection : 'auto',
            customer_email : user.email,
            metadata : {
                userId : request.userId
            },
                        line_items : cartItems.map((item)=>{
                return{
                    price_data : {
                      currency : 'inr',
                      product_data : {
                        name : item.productId.productName,
                                                images : [resolveImageUrl(item.productId?.productImage?.[0])].filter(Boolean),
                        metadata : {
                            productId : item.productId._id
                        }
                      },
                      unit_amount : item.productId.sellingPrice * 100
                    },
                    adjustable_quantity : {
                        enabled : true,
                        minimum : 1
                    },
                    quantity : item. quantity

                }
            }),
            success_url : `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`,
        }

        const session = await stripe.checkout.sessions.create(params)

        response.status(303).json(session)

    } catch (error) {
        response.json({
            message : error?.message || error,
            error : true,
            success : false
        })
    }
}

module.exports = paymentController