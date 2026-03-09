
// ============================================================
// FRAUD DETECTION OBSERVER — Email / SMS Mock
// Listens for: SuspiciousWithdrawalEvent
// Action: Simulates sending an SMS alert to the account owner
//
// This is a MOCK — no real SMS is sent.
// In a real system, you'd call Twilio or AWS SNS here.
// The domain doesn't know this file exists.
// ============================================================

import { DomainEvent } from "../../domain/events/events"

export function fraudDetectionObserver(event: DomainEvent): void {
  // Only react to SuspiciousWithdrawal events
  // TypeScript knows event.ownerName and event.amount exist here
  if (event.type === "SuspiciousWithdrawal") {
    console.log("-------------------------------------------")
    console.log("📱 FRAUD DETECTION OBSERVER TRIGGERED")
    console.log(`   SMS sent to account owner: ${event.ownerName}`)
    console.log(`   Message: "A withdrawal of $${event.amount} was made on your account.`)
    console.log(`            Account ID: ${event.accountId}`)
    console.log(`            If this wasn't you, call 1-800-BANK-HELP immediately."`)
    console.log("-------------------------------------------")
  }
  // All other event types → this observer does nothing
}