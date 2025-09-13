/**
 * @openapi
 * tags:
 *   name: Customer
 *   description: Customer Management
 */


import { Router } from "express";
import {
  createCustomer,
  updateCustomer,
  getCustomerById,
  getAllCustomers,
  deleteCustomerById,
} from "../controllers/customerControlller.js";
import { requestAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/create", requestAuth, createCustomer);
router.put("/update/:id", requestAuth, updateCustomer);
router.get("/:id", requestAuth, getCustomerById);
router.get("/", requestAuth, getAllCustomers);
router.delete("/:id", requestAuth, deleteCustomerById);

export default router;
