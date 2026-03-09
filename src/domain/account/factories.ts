
// ============================================================
// SMART FACTORY FUNCTIONS — Bank Account Domain
// These functions validate input before creating any value.
// If input is invalid → they throw an Error (no silent failures)
// If input is valid   → they return a branded type
// ============================================================

import { AccountId, Balance, TransactionAmount, DailyLimit } from "./types"
import { Account } from "./account"

// The maximum a customer can withdraw in a single day
export const DAILY_WITHDRAWAL_LIMIT = 5000 as DailyLimit

// ------------------------------------------------------------
// createAccountId — validates and brands an account ID string
// ------------------------------------------------------------
export function createAccountId(value: string): AccountId {
  if (!value || value.trim() === "") {
    throw new Error("Account ID cannot be empty")
  }
  return value as AccountId
}

// ------------------------------------------------------------
// createBalance — validates and brands a balance number
// ------------------------------------------------------------
export function createBalance(value: number): Balance {
  if (value < 0) {
    throw new Error(`Balance cannot be negative. Received: ${value}`)
  }
  return value as Balance
}

// ------------------------------------------------------------
// createTransactionAmount — validates and brands a tx amount
// ------------------------------------------------------------
export function createTransactionAmount(value: number): TransactionAmount {
  if (value <= 0) {
    throw new Error(`Transaction amount must be positive. Received: ${value}`)
  }
  return value as TransactionAmount
}

// ------------------------------------------------------------
// createAccount — factory function to create a valid Account
// ------------------------------------------------------------
export function createAccount(
  id: string,
  ownerName: string,
  initialBalance: number
): Account {
  if (!ownerName || ownerName.trim() === "") {
    throw new Error("Owner name cannot be empty")
  }

  return {
    id: createAccountId(id),
    ownerName: ownerName.trim(),
    balance: createBalance(initialBalance),
    dailyWithdrawn: 0 as TransactionAmount,
  }
}