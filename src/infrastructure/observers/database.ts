
// ============================================================
// AUDIT LOG OBSERVER — Database Mock
// Listens for: MoneyDepositedEvent, MoneyWithdrawnEvent
// Action: Simulates writing a read-only record to a security log
//
// This is a MOCK — no real database is used.
// In a real system, you'd call PostgreSQL or MongoDB here.
// The domain doesn't know this file exists.
// ============================================================

import { DomainEvent } from "../../domain/events/events"

export function auditLogObserver(event: DomainEvent): void {
  // React to deposits and withdrawals — ignore suspicious events
  if (
    event.type === "MoneyDeposited" ||
    event.type === "MoneyWithdrawn"
  ) {
    const timestamp = new Date().toISOString()
    const action = event.type === "MoneyDeposited" ? "DEPOSIT" : "WITHDRAWAL"

    console.log("-------------------------------------------")
    console.log("📋 AUDIT LOG OBSERVER TRIGGERED")
    console.log(`   [${timestamp}]`)
    console.log(`   Action      : ${action}`)
    console.log(`   Account ID  : ${event.accountId}`)
    console.log(`   Amount      : $${event.amount}`)
    console.log(`   New Balance : $${event.newBalance}`)
    console.log(`   Status      : SUCCESS (read-only record saved)`)
    console.log("-------------------------------------------")
  }
  // SuspiciousWithdrawalEvent → audit log ignores it (fraud observer handles it)
}