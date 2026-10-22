import { isPast } from "@/lib/event";
import type { Package, PackageId, TimeSpan } from "@/types/dashboard";

/** Prices and what each package unlocks, lowest first, straight from the project spec. */
export const PACKAGES: Record<PackageId, Package> = {
  free: { price: 0, seating: false },
  standard: { price: 100, seating: true },
  custom: { price: 200, seating: true },
};

const ORDER = Object.keys(PACKAGES) as PackageId[];

/** The package one step up, or none from the top. */
export function nextPackage(id: PackageId): PackageId | undefined {
  return ORDER[ORDER.indexOf(id) + 1];
}

/** True when what was bought is enough for what is needed: paid for. */
export function covers(bought: PackageId, needed: PackageId): boolean {
  return ORDER.indexOf(bought) >= ORDER.indexOf(needed);
}

/** What an unpaid event costs: upgrades pay the difference to the package it needs. */
export function upgradePrice(event: {
  package: PackageId;
  neededPackage: PackageId;
}): number {
  return PACKAGES[event.neededPackage].price - PACKAGES[event.package].price;
}

/** Waiting for payment: in the cart. A past event can no longer be published. */
export function awaitingPayment(event: {
  paid: boolean;
  countdown: TimeSpan;
}): boolean {
  return !event.paid && !isPast(event);
}
