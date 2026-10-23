import type { Package, PackageId } from "@/types/dashboard";

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
