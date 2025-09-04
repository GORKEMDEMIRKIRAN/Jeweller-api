

import {Router} from "express";
import {
    createCustomer,
    updateCustomer,
    getCustomerById,
    getAllCustomers,
    deleteCustomer
} from "../controllers/customerControlller.js";
import {requestAuth} from "../middlewares/authMiddleware.js";

const router = Router();


/**
 * @openapi
 * /customer/create:
 *   post:
 *    summary: Create Customer
 */
router.post("/create", requestAuth, createCustomer);
/**
 * @openapi
 * /customer/update/{id}:
 *   put:
 *    summary: Update Customer
 */
router.put("/update/:id", requestAuth, updateCustomer);
/**
 * @openapi
 * /customer/{id}:
 *   get:
 *    summary: Get Customer by ID
 */
router.get("/:id", requestAuth, getCustomerById);
/**
 * @openapi
 * /customer:
 *   get:
 *    summary: Get All Customers
 */
router.get("/", requestAuth, getAllCustomers);
/**
 * @openapi
 * /customer/{id}:
 *   delete:
 *    summary: Delete Customer by ID
 */
router.delete("/:id", requestAuth, deleteCustomer);

export default router;
