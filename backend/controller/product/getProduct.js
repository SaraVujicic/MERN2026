const productModel = require("../../models/productModel")

const getProductController = async(req,res) => {
    try{
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
        const limit = Math.max(parseInt(req.query.limit, 10) || 12, 1)
        const skip = (page - 1) * limit

        const [allProduct, totalProduct] = await Promise.all([
            productModel.find().sort({ createdAt : -1 }).skip(skip).limit(limit),
            productModel.countDocuments()
        ])

        res.json({
            message : "All product ",
            success : true,
            error : false ,
            data : allProduct,
            totalProduct,
            totalPage : Math.ceil(totalProduct / limit),
            currentPage : page,
            limit
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err ,
            error : true,
            success : false 
            
        })
    }

}

module.exports = getProductController