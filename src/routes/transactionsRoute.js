import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactionSummary,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/:userId", getTransactionById);
router.delete("/:id", deleteTransaction);
router.get("/summary/:userId", getTransactionSummary);

export default router;
