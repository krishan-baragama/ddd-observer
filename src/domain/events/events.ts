
// ============================================================
// DOMAIN EVENTS — Bank Account Domain
// Events describe what HAPPENED in the domain (past tense).
// They are plain data objects — zero logic, zero side effects.
// The observer will receive these and decide what to do.
// ============================================================

import { AccountId, Balance, TransactionAmount } from "../account/types"

// ------------------------------------------------------------
// Event 1: Money was successfully deposited
// ------------------------------------------------------------
export type MoneyDepositedEvent = {
  readonly type: "MoneyDeposited"
  readonly accountId: AccountId
  readonly amount: TransactionAmount
  readonly newBalance: Balance
}

// ------------------------------------------------------------
// Event 2: Money was successfully withdrawn
// ------------------------------------------------------------
export type MoneyWithdrawnEvent = {
  readonly type: "MoneyWithdrawn"
  readonly accountId: AccountId
  readonly amount: TransactionAmount
  readonly newBalance: Balance
}

// ------------------------------------------------------------
// Event 3: A withdrawal over $5,000 was detected
// This triggers the Fraud Detection Observer (SMS alert)
// ------------------------------------------------------------
export type SuspiciousWithdrawalEvent = {
  readonly type: "SuspiciousWithdrawal"
  readonly accountId: AccountId
  readonly amount: TransactionAmount
  readonly ownerName: string
}

// ------------------------------------------------------------
// DomainEvent — the union of ALL possible events
// This is what observers receive and react to.
// Using a discriminated union means TypeScript knows exactly
// which event type you're dealing with inside each if/switch block.
// ------------------------------------------------------------
export type DomainEvent =
  | MoneyDepositedEvent
  | MoneyWithdrawnEvent
  | SuspiciousWithdrawalEvent