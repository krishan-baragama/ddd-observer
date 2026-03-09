
// ============================================================
// ACCOUNT ENTITY — Bank Account Domain
// This is the shape of an Account object.
// Uses branded types — no plain primitives allowed here.
// ============================================================

import { AccountId, Balance, TransactionAmount } from "./types"

export type Account = {
  readonly id: AccountId           // never changes after creation
  readonly ownerName: string       // never changes after creation
  balance: Balance                 // changes on deposit/withdraw
  dailyWithdrawn: TransactionAmount // tracks total withdrawn today
}