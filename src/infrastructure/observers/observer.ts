
// ============================================================
// OBSERVER PATTERN — Core Setup
// This is the heart of the observer pattern.
// - Observer: a function that receives a domain event
// - observers: the list of all registered observers
// - subscribe(): adds an observer to the list
// - notify(): sends an event to ALL registered observers
// ============================================================

import { DomainEvent } from "../../domain/events/events"

// ------------------------------------------------------------
// Observer type — any function that receives a DomainEvent
// ------------------------------------------------------------
export type Observer = (event: DomainEvent) => void

// ------------------------------------------------------------
// The registry — holds all subscribed observer functions
// ------------------------------------------------------------
const observers: Observer[] = []

// ------------------------------------------------------------
// subscribe() — register a new observer
// Call this once at startup for each observer you want active
// ------------------------------------------------------------
export function subscribe(observer: Observer): void {
  observers.push(observer)
  console.log(`✅ Observer registered: ${observer.name}`)
}

// ------------------------------------------------------------
// notify() — emit an event to ALL registered observers
// Called inside domain operations (withdraw, deposit)
// The domain doesn't know WHO is listening — it just notifies
// ------------------------------------------------------------
export function notify(event: DomainEvent): void {
  console.log(`\n📢 Event emitted: [${event.type}]`)
  observers.forEach((observer) => observer(event))
}