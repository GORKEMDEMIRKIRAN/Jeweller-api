
import { Router } from "express";
import {
  getInventoryItem,
  getInventoryList,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../controllers/inventoryController.js";
import { requestAuth } from "../middlewares/authMiddleware.js";
const inventoryRouter = Router();

inventoryRouter.get("/:id", requestAuth, getInventoryItem);
inventoryRouter.get("/list", requestAuth, getInventoryList);
inventoryRouter.post("/", requestAuth, addInventoryItem);
inventoryRouter.put("/:id", requestAuth, updateInventoryItem);
inventoryRouter.delete("/:id", requestAuth, deleteInventoryItem);

export default inventoryRouter;
