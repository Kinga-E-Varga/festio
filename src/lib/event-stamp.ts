type Versions = {
  version: number;
  dataVersion: number;
  invitationVersion: number;
};

/**
 * A short mark of an event card's three versions. Two marks are equal only when
 * the card is the same: the dashboard compares them to see if a card changed.
 */
export function eventStamp(card: Versions): string {
  return `${card.version}.${card.dataVersion}.${card.invitationVersion}`;
}

/**
 * The same mark without the replies part (`dataVersion`): for an event whose
 * guest list is open, which keeps its replies and list current itself.
 */
export function stampWithoutData(card: Versions): string {
  return `${card.version}.${card.invitationVersion}`;
}
