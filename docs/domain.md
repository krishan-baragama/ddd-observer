# Domain: FinTech — Bank Account Security

## What is this domain about?

A bank account system where customers can **deposit** and **withdraw** money.
The system must enforce security rules to protect customers from fraud and overdrafts.

---

## Core Entity: `Account`

An Account represents a customer's bank account. It holds:

| Field              | Description                                          |
|--------------------|------------------------------------------------------|
| `id`               | Unique identifier for the account                    |
| `ownerName`        | Full name of the account holder                      |
| `balance`          | Current available balance (never goes below 0)       |
| `dailyWithdrawn`   | Total amount withdrawn today (resets every 24 hours) |

---

## Business Rules (the laws of this domain)

These rules are **always true**, no matter what. The system must enforce them — not the UI, not the database, only the domain.

### Rule 1 — No negative balance
A withdrawal cannot exceed the current balance.
> "You cannot take out more money than you have."

### Rule 2 — Daily Withdrawal Limit
A customer cannot withdraw more than **$5,000 in a single day** across all transactions.
> "If a customer has already withdrawn $4,000 today, they can only withdraw $1,000 more — even if their balance is $50,000."

### Rule 3 — Positive amounts only
All deposits and withdrawals must be a **positive number**.
> "You cannot deposit -$100. That makes no sense."

### Rule 4 — Account must have a valid owner
An account cannot be created without an ID and an owner name.
> "A bank account without an owner does not exist."

---

## State Changes (what can happen to an Account)

### `deposit(amount)`
- Adds money to the balance
- Must be a positive amount
- No daily limit on deposits
- Triggers: `MoneyDepositedEvent`

### `withdraw(amount)`
- Removes money from the balance
- Must not exceed current balance (Rule 1)
- Must not exceed daily withdrawal limit (Rule 2)
- Must be a positive amount (Rule 3)
- Triggers: `MoneyWithdrawnEvent`
- If amount > $5,000 → also triggers: `SuspiciousWithdrawalEvent`

---

## Domain Events (things that happened, past tense)

| Event                    | When it fires                                      |
|--------------------------|----------------------------------------------------|
| `MoneyDepositedEvent`    | After every successful deposit                     |
| `MoneyWithdrawnEvent`    | After every successful withdrawal                  |
| `SuspiciousWithdrawalEvent` | When a single withdrawal exceeds $5,000         |

---

## Observer Reactions (side effects — NOT part of the domain)

These happen **in response** to domain events. The domain does not care how they work.

### Fraud Detection Observer
- Listens for: `SuspiciousWithdrawalEvent`
- Action: Sends an SMS verification to the account holder
- Mock output: `"📱 SMS sent to [owner]: Confirm your $X withdrawal"`

### Audit Log Observer
- Listens for: `MoneyWithdrawnEvent`, `MoneyDepositedEvent`
- Action: Records every transaction into a read-only security log
- Mock output: `"📋 AUDIT LOG: [event details]"`

---

## What CAN'T happen (impossible states)

- Balance goes negative → **blocked by Rule 1**
- Daily withdrawals exceed $5,000 → **blocked by Rule 2**
- Withdrawal or deposit of $0 or negative → **blocked by Rule 3**
- Account with no ID or no owner name → **blocked by Rule 4**
- Skipping `OutForDelivery` before `Delivered` (not applicable here — this is for Logistics domain)

---

## Summary in one sentence

> A bank account tracks a customer's balance, enforces withdrawal limits, and emits events so that fraud detection and audit logging can react — without the domain ever knowing those systems exist.