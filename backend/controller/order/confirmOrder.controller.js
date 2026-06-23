const stripe = require('../../config/stripe')
const orderModel = require('../../models/orderProductModel')
const addToCartModel = require('../../models/cartProduct')

async function getLineItems(lineItems) {
    const productItems = []

    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            const product = await stripe.products.retrieve(item.price.product)

            productItems.push({
                productId: product.metadata.productId,
                name: product.name,
                price: item.price.unit_amount / 100,
                quantity: item.quantity,
                image: product.images,
            })
        }
    }

    return productItems
}

const confirmOrderController = async (request, response) => {
    try {
        const { session_id: sessionId } = request.query

        if (!sessionId) {
            return response.status(400).json({
                message: 'Missing session id',
                success: false,
                error: true,
            })
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (!session?.id) {
            return response.status(404).json({
                message: 'Checkout session not found',
                success: false,
                error: true,
            })
        }

        if (session.payment_status !== 'paid') {
            return response.status(400).json({
                message: 'Payment is not completed yet',
                success: false,
                error: true,
            })
        }

        const existingOrder = await orderModel.findOne({
            'paymentDetails.paymentId': session.payment_intent,
        })

        if (existingOrder) {
            return response.json({
                data: existingOrder,
                message: 'Order already confirmed',
                success: true,
            })
        }

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
        const productDetails = await getLineItems(lineItems)

        const orderDetails = {
            productDetails,
            email: session.customer_email,
            userId: session.metadata.userId,
            paymentDetails: {
                paymentId: session.payment_intent,
                payment_method_type: session.payment_method_types,
                payment_status: session.payment_status,
            },
            shipping_options: session.shipping_options?.map((shippingOption) => {
                return {
                    ...shippingOption,
                    shipping_amount: shippingOption.shipping_amount / 100,
                }
            }) || [],
            totalAmount: session.amount_total / 100,
        }

        const order = new orderModel(orderDetails)
        const saveOrder = await order.save()

        if (saveOrder?._id) {
            await addToCartModel.deleteMany({ userId: session.metadata.userId })
        }

        return response.json({
            data: saveOrder,
            message: 'Order confirmed',
            success: true,
        })
    } catch (error) {
        return response.status(500).json({
            message: error?.message || error,
            success: false,
            error: true,
        })
    }
}

module.exports = confirmOrderController