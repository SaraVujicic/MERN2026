const productModel = require("../../models/productModel")

const getCategoryWiseProduct = async(req,res)=>{
    try{
        const { category, page: pageValue, limit: limitValue } = req?.body || req.query
        const page = Math.max(parseInt(pageValue, 10) || 1, 1)
        const limit = Math.max(parseInt(limitValue, 10) || 12, 1)
        const skip = (page - 1) * limit

        const categoryFilter = Array.isArray(category)
            ? { category: { $in: category } }
            : category
                ? { category }
                : {}

        const [product, totalProduct] = await Promise.all([
            productModel.find(categoryFilter).sort({ createdAt : -1 }).skip(skip).limit(limit),
            productModel.countDocuments(categoryFilter)
        ])

         res.json({
            data : product,
            message : "Product",
            success : true,
            error : false,
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

module.exports = getCategoryWiseProduct