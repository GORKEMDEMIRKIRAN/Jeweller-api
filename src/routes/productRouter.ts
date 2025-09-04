import {Router} from "express";
import {
    updateProduct,
    getProductById,
    getAllProducts,
    deleteProductById,
} from "../controllers/productController.js";
import {requestAuth} from "../middlewares/authMiddleware.js";

const router = Router();


/**
 * @openapi
 * /product/update/{id}::
 *   put:
 *    summary: Update Product
 */
router.put("/update/:id", requestAuth, updateProduct);
/**
 * @openapi
 * /product/{id}:
 *   get:
 *    summary: Get Product by ID
 */
router.get("/:id", requestAuth, getProductById);
/**
 * @openapi
 * /product:
 *   get:
 *    summary: Get All Products
 */
router.get("/", requestAuth, getAllProducts);
/**
 * @openapi
 * /product/{id}:
 *   delete:
 *    summary: Delete Product by ID
 */
router.delete("/:id", requestAuth, deleteProductById);

export default router;
