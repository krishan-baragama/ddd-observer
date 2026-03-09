
// ============================================================
// WIRING + TEST RUNS — Bank Account Domain
// This file is the entry point. It:
//   1. Registers observers
//   2. Runs valid operations (happy path)
//   3. Tests invalid / impossible data (must NOT crash)
// ============================================================

import { v4 as uuidv4 } from "uuid"
import { subscribe } from "./infrastructure/observers/observer"
import { fraudDetectionObserver } from "./infrastructure/observers/email"
import { auditLogObserver } from "./infrastructure/observers/database"
import { createAccount, deposit, withdraw } from "./domain/account/factories"

// ============================================================
// STEP 1 — Register observers
// This is the "plug in" moment — connect side effects to events
// ============================================================
console.log("=== REGISTERING OBSERVERS ===")
subscribe(fraudDetectionObserver)
subscribe(auditLogObserver)

// ============================================================
// STEP 2 — Happy path (valid operations)
// ============================================================
console.log("\n=== HAPPY PATH TESTS ===")

// --- Test 1: Create a valid account ---
console.log("\n--- Test 1: Create a valid account ---")
const alice = createAccount(uuidv4(), "Alice Johnson", 10000)
console.log(`Account created: ${alice.ownerName} | Balance: $${alice.balance}`)

// --- Test 2: Normal deposit ---
console.log("\n--- Test 2: Deposit $500 ---")
const afterDeposit = deposit(alice, 500)
console.log(`New balance after deposit: $${afterDeposit.balance}`)

// --- Test 3: Normal withdrawal (under $5,000 limit) ---
console.log("\n--- Test 3: Withdraw $1,000 (normal) ---")
const afterWithdraw = withdraw(afterDeposit, 1000)
console.log(`New balance after withdrawal: $${afterWithdraw.balance}`)

// --- Test 4: Large withdrawal (triggers fraud detection) ---
console.log("\n--- Test 4: Withdraw $5,500 (triggers SuspiciousWithdrawal) ---")
const bob = createAccount(uuidv4(), "Bob Smith", 20000)
const afterSuspicious = withdraw(bob, 5500)
console.log(`New balance after large withdrawal: $${afterSuspicious.balance}`)

// ============================================================
// STEP 3 — Invalid / impossible data tests
// Every block below MUST fail gracefully — no app crashes
// ============================================================
console.log("\n=== INVALID DATA TESTS ===")

// --- Invalid Test 1: Negative deposit amount ---
console.log("\n--- Invalid Test 1: Deposit -$200 (negative amount) ---")
try {
  deposit(alice, -200)
} catch (error) {
  if (error instanceof Error) {
    console.error(`✋ Caught expected error: ${error.message}`)
  }
}

// --- Invalid Test 2: Zero withdrawal ---
console.log("\n--- Invalid Test 2: Withdraw $0 (zero amount) ---")
try {
  withdraw(alice, 0)
} catch (error) {
  if (error instanceof Error) {
    console.error(`✋ Caught expected error: ${error.message}`)
  }
}

// --- Invalid Test 3: Overdraft attempt ---
console.log("\n--- Invalid Test 3: Withdraw $99,999 (exceeds balance) ---")
try {
  withdraw(alice, 99999)
} catch (error) {
  if (error instanceof Error) {
    console.error(`✋ Caught expected error: ${error.message}`)
  }
}

// --- Invalid Test 4: Daily limit exceeded ---
console.log("\n--- Invalid Test 4: Exceed daily withdrawal limit ---")
try {
  const carol = createAccount(uuidv4(), "Carol White", 20000)
  const afterFirst = withdraw(carol, 3000)   // $3,000 withdrawn today
  withdraw(afterFirst, 3000)                 // another $3,000 → total $6,000 → blocked
} catch (error) {
  if (error instanceof Error) {
    console.error(`✋ Caught expected error: ${error.message}`)
  }
}

// --- Invalid Test 5: Empty account owner name ---
console.log("\n--- Invalid Test 5: Create account with empty owner name ---")
try {
  createAccount(uuidv4(), "", 1000)
} catch (error) {
  if (error instanceof Error) {
    console.error(`✋ Caught expected error: ${error.message}`)
  }
}

// --- Invalid Test 6: Empty account ID ---
console.log("\n--- Invalid Test 6: Create account with empty ID ---")
try {
  createAccount("", "Dave Brown", 1000)
} catch (error) {
  if (error instanceof Error) {
    console.error(`✋ Caught expected error: ${error.message}`)
  }
}

// --- Invalid Test 7: Negative initial balance ---
console.log("\n--- Invalid Test 7: Create account with negative balance ---")
try {
  createAccount(uuidv4(), "Eve Davis", -500)
} catch (error) {
  if (error instanceof Error) {
    console.error(`✋ Caught expected error: ${error.message}`)
  }
}

console.log("\n=== ALL TESTS COMPLETE — APP DID NOT CRASH ✅ ===")