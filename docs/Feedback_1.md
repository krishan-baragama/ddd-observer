# Peer Review Feedback

## General Feedback

Great job on the domain implementation! Your logic for the `Account` entity is clear and follows the business rules we discussed in class. The bank account domain is well-structured and easy to follow. I noticed a few spots where we can tighten the type safety to fully move away from primitive obsession.

---

## Strengths

- Excellent use of Domain Events (`MoneyDeposited`, `MoneyWithdrawn`, `SuspiciousWithdrawal`) to decouple the entity from the mock observers.
- The `withdraw()` logic correctly enforces the business rule that balance cannot drop below zero.
- The `try-catch` blocks handled all "impossible" data perfectly without crashing the app.
- Good use of `readonly` on event fields — prevents observers from accidentally mutating event data.
- The `DAILY_WITHDRAWAL_LIMIT` constant is defined in one place, making it easy to update in the future.

---

## Specific Checks

### Branded Types
- `AccountId`, `Balance`, `TransactionAmount`, `DailyLimit` are all branded correctly.
- Suggestion: Consider using `unique symbol` instead of a string literal for the `__brand` field for even stronger type safety:
```ts
// Current
type Balance = number & { readonly __brand: "Balance" }

// Stronger alternative
declare const __brand: unique symbol
type Balance = number & { readonly [__brand]: "Balance" }
```

### Validation
- Every factory function throws a clear, descriptive error for invalid data.
- Suggestion: The error messages are very readable (e.g., `"Balance cannot be negative. Received: -500"`). Good practice!

### Observer Pattern
- All observers share the same `DomainEvent` discriminated union signature.
- The `notify()` function correctly loops through all registered observers.
- Suggestion: Consider adding an `unsubscribe()` function in `observer.ts` so observers can be removed when no longer needed.

---

## Checklist

| Check | Status | Notes |
|-------|--------|-------|
| Branded Types used | ✅ | All domain values are branded |
| Factory functions validate input | ✅ | All throw on invalid data |
| `try-catch` blocks present | ✅ | App never crashes on bad input |
| Observer signature consistent | ✅ | All use `DomainEvent` union |
| `readonly` on event fields | ✅ | Events are immutable |
| Daily withdrawal limit enforced | ✅ | Correctly blocks over $5,000 |

---

## Final Recommendation

The implementation is solid and meets all the DDD criteria we covered in class.
Once you consider adding `unsubscribe()` to the observer pattern, this is ready to merge! 🎉