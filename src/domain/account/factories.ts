
// ============================================================
// SMART FACTORY FUNCTIONS — Bank Account Domain
// These functions validate input before creating any value.
// If input is invalid → they throw an Error (no silent failures)
// If input is valid   → they return a branded type or new Account
//
// withdraw() and deposit() are the state-changing operations.
// They enforce business rules AND emit domain events.
// They do NOT know about email, SMS, or databases.
// ============================================================

import { AccountId, Balance, TransactionAmount, DailyLimit } from "./types"
import { Account } from "./account"
import { notify } from "../../infrastructure/observers/observer"

// ------------------------------------------------------------
// CONSTANT — Daily withdrawal limit ($5,000)
// Defined once here — easy to change in the future
// ------------------------------------------------------------
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
// createAccount — factory function to build a valid Account
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

// ------------------------------------------------------------
// deposit() — STATE CHANGE #1
// Business rules:
//   - Amount must be positive (enforced by createTransactionAmount)
// Emits: MoneyDepositedEvent
// ------------------------------------------------------------
export function deposit(account: Account, amount: number): Account {
  // Step 1: validate the amount — throws if invalid
  const txAmount = createTransactionAmount(amount)

  // Step 2: calculate new balance
  const newBalance = createBalance(account.balance + txAmount)

  // Step 3: build updated account (immutable — return new object)
  const updatedAccount: Account = {
    ...account,
    balance: newBalance,
  }

  // Step 4: emit event — observers will react to this
  notify({
    type: "MoneyDeposited",
    accountId: account.id,
    amount: txAmount,
    newBalance,
  })

  return updatedAccount
}

// ------------------------------------------------------------
// withdraw() — STATE CHANGE #2
// Business rules:
//   - Amount must be positive (Rule 3)
//   - Cannot exceed current balance (Rule 1)
//   - Cannot exceed daily withdrawal limit of $5,000 (Rule 2)
// Emits: MoneyWithdrawnEvent
// Emits: SuspiciousWithdrawalEvent (if amount > $5,000)
// ------------------------------------------------------------
export function withdraw(account: Account, amount: number): Account {
  // Step 1: validate the amount — throws if zero or negative
  const txAmount = createTransactionAmount(amount)

  // Step 2: enforce Rule 1 — no overdraft
  if (txAmount > account.balance) {
    throw new Error(
      `Insufficient funds. Balance: $${account.balance}, Attempted: $${txAmount}`
    )
  }

  // Step 3: enforce Rule 2 — daily withdrawal limit
  const newDailyTotal = account.dailyWithdrawn + txAmount
  if (newDailyTotal > DAILY_WITHDRAWAL_LIMIT) {
    throw new Error(
      `Daily withdrawal limit exceeded. Limit: $${DAILY_WITHDRAWAL_LIMIT}, ` +
      `Already withdrawn: $${account.dailyWithdrawn}, Attempted: $${txAmount}`
    )
  }

  // Step 4: calculate new balance
  const newBalance = createBalance(account.balance - txAmount)

  // Step 5: build updated account (immutable — return new object)
  const updatedAccount: Account = {
    ...account,
    balance: newBalance,
    dailyWithdrawn: newDailyTotal as TransactionAmount,
  }

  // Step 6: emit MoneyWithdrawn event — audit log will react
  notify({
    type: "MoneyWithdrawn",
    accountId: account.id,
    amount: txAmount,
    newBalance,
  })

  // Step 7: if amount > $5,000 also emit SuspiciousWithdrawal — fraud detection reacts
  if (txAmount > 5000) {
    notify({
      type: "SuspiciousWithdrawal",
      accountId: account.id,
      amount: txAmount,
      ownerName: account.ownerName,
    })
  }

  return updatedAccount
}