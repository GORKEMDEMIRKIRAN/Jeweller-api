
/**
 * @openapi
 * tags:
 *   name:  Product
 *   description: Product Management
 */


import {Router} from "express";
import {
    updateProduct,
    getProductById,
    getAllProducts,
    deleteProductById,
    createProduct
} from "../controllers/productController.js";
import {requestAuth} from "../middlewares/authMiddleware.js";

const router = Router();

router.put("/update/:id", requestAuth, updateProduct);
router.post("/create", requestAuth, createProduct);
router.get("/", requestAuth, getAllProducts);
router.get("/:id", requestAuth, getProductById);
router.delete("/:id", requestAuth, deleteProductById);



export default router;
