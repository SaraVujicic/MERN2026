const addToCartModel = require("../../models/cartProduct")

const deleteAddToCartProduct = async(req,res)=>{
    try {
        const currentUserId = req.currentUserId
        const addToCartProductId = req.body._id

        const deleteProduct = await addToCartModel.deleteOne({_id : addToCartProductId})

        res.json({
            messege : "Product deleted from cart",
            error : false ,
            success : true,
            data : deleteProduct
        })


    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })

    }
}

module.exports = deleteAddToCartProduct