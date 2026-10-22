import type { FooterColumn, NavItem } from "@/types/dashboard";

/* Keys into the `Nav` message namespace; the words themselves live there. */
export const NAV_ITEMS: NavItem[] = [
  { labelKey: "home", href: "/dashboard", icon: "home" },
];

/* The side panel's account view, behind the account circle; keys into `Nav` too. */
export const ACCOUNT_LINKS: NavItem[] = [
  { labelKey: "billing", href: "/dashboard/billing", icon: "billing" },
  { labelKey: "privacy", href: "/dashboard/privacy", icon: "shield" },
  { labelKey: "settings", href: "/dashboard/settings", icon: "settings" },
];

/* Keys into the `Footer` message namespace. */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    labelKey: "product",
    linkKeys: [
      "templateGallery",
      "packagesPricing",
      "printSizes",
      "seatingCharts",
    ],
  },
  {
    labelKey: "forHosts",
    linkKeys: [
      "gettingStarted",
      "writingQuestions",
      "sharingLink",
      "cancelPostpone",
    ],
  },
  {
    labelKey: "legal",
    linkKeys: ["termsDpa", "privacyNotice", "dataRetention", "cookies"],
  },
];
