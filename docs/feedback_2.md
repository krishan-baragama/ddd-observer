# Peer Review Feedback — Reviewer: Adithya

## General Feedback

Good work on implementing the FinTech bank account domain! The folder structure is clean and follows DDD principles well. The separation between domain logic and infrastructure (observers) is clear. Below are my observations after reviewing the code and testing it with impossible data.

---

##  Strengths

- The DDD folder structure is well organised — domain logic is completely separated from infrastructure.
- Smart constructors like `createBalance()` and `createTransactionAmount()` correctly prevent invalid data from entering the system.
- The discriminated union `DomainEvent` type makes observer logic type-safe and easy to extend.
- `withdraw()` correctly emits two separate events when needed — `MoneyWithdrawn` for the audit log and `SuspiciousWithdrawal` for fraud detection.
- The `src/index.ts` test file covers both happy path and edge cases thoroughly.

---

## Specific Checks

### Branded Types
- Branded types are used for all domain values — no primitive obsession.
- Suggestion: The `dailyWithdrawn` field is initialised as `0 as TransactionAmount` directly in `createAccount()`. Consider creating a dedicated `createDailyWithdrawn()` factory for consistency:
```ts
// More consistent approach
dailyWithdrawn: createTransactionAmount(0)
```

### Validation
- All factory functions throw descriptive errors for invalid inputs.
- Suggestion: Consider adding a max balance limit (e.g., `$1,000,000`) to `createBalance()` to simulate a real banking constraint:
```ts
if (value > 1_000_000) {
  throw new Error("Balance cannot exceed $1,000,000")
}
```

### Observer Pattern
-  `subscribe()` and `notify()` are cleanly separated from domain logic.
-  Each observer only reacts to its own relevant event types.
- Suggestion: The `observers` array in `observer.ts` is module-level state. Consider wrapping it in a class or factory function for better testability:
```ts
// Alternative: EventBus pattern
export function createEventBus() {
  const observers: Observer[] = []
  return {
    subscribe: (o: Observer) => observers.push(o),
    notify: (e: DomainEvent) => observers.forEach(o => o(e))
  }
}
```

---

## 🛠️ Checklist

| Check | Status | Notes |
|-------|--------|-------|
| Branded Types used | ✅ | All domain values are branded |
| Factory functions validate input | ✅ | All throw on invalid data |
| `try-catch` blocks present | ✅ | App never crashes on bad input |
| Observer signature consistent | ✅ | All use `DomainEvent` union |
| `readonly` on event fields | ✅ | Events are immutable |
| Daily withdrawal limit enforced | ✅ | Correctly blocks over $5,000 |
| Observers decoupled from domain | ✅ | Domain never imports observers |

---

## 📋 Final Recommendation

I tested the code with impossible data (negative amounts, empty IDs, overdrafts, exceeding daily limits) and the `try-catch` blocks handled everything perfectly without crashing the app.