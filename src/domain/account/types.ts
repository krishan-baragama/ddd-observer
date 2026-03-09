
// ============================================================
// BRANDED TYPES — Bank Account Domain
// These prevent mixing up plain numbers/strings accidentally.
// e.g. you can't pass a plain `number` where `Balance` is expected
// ============================================================

// Unique identifier for a bank account
export type AccountId = string & { readonly __brand: "AccountId" }

// Current money in the account — never negative
export type Balance = number & { readonly __brand: "Balance" }

// Amount used in a single deposit or withdrawal — always positive
export type TransactionAmount = number & { readonly __brand: "TransactionAmount" }

// The max amount allowed to withdraw in one day
export type DailyLimit = number & { readonly __brand: "DailyLimit" }