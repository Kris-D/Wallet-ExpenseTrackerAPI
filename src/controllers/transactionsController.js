import { sql } from "../config/db.js";

// Create a new transaction
export const createTransaction = async (req, res) => {
  //title, amount, category, user_id
  try {
    const { title, amount, category, user_id } = req.body;

    // Validation
    if (!title || amount === undefined || !category || !user_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Insert into database
    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *;
    `;
    res.status(201).json({
      message: "Transaction created successfully",
      transaction: transaction[0],
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await sql`
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC;`;

    res.status(200).json({
      message: "Transactions retrieved successfully",
      transactions: transactions,
    });
  } catch (error) {
    console.error("Error getting the transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete transaction by ID
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      res.status(400).json({ message: "Invalid transaction ID " });
    }
    const result =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting the transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Transaction summary
export const getTransactionSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const balanceResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as balance
    FROM transactions
    WHERE user_id = ${userId}`;

    const incomeResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as income
    FROM transactions
    WHERE user_id = ${userId} And amount > 0`;

    const expenseResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as expense
    FROM transactions
    WHERE user_id = ${userId} And amount < 0`;

    res.status(200).json({
      message: "Transaction summary retrieved successfully",
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    });
  } catch (error) {
    console.error("Error getting the transaction summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
