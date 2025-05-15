import express from "express";
const router = express.Router();

import { 
    createOrder, 
    getAllOrders, 
    getUserOrders, 
    countTotalOrders, 
    calculateTotalSales,
    calcualteTotalSalesByDate,
    findOrderById,
    markOrderAsPaid,
    markOrderAsDelivered,
    deleteOrder
} from "../controllers/orderControllers.js"

import { 
    authentication, 
    authorizeAdmin 
} from "../middlewares/authentication.js";


router.route("/")
    .post(authentication, createOrder)
    .get( authentication, authorizeAdmin, getAllOrders );

router.route("/mine").get( authentication , getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);
router.route("/:id").get(authentication, findOrderById);
router.route("/:id/pay").put(authentication, markOrderAsPaid);
router
  .route("/:id")
  .delete(authentication, authorizeAdmin, deleteOrder);
router
  .route("/:id/deliver")
  .put(authentication, authorizeAdmin, markOrderAsDelivered);

export default router;