interface PublicNavigationItem {
  href: string;
  labelKey: "home" | "services" | "works" | "about" | "booking" | "contacts";
}
export const publicNavigationItems: PublicNavigationItem[] = [
  { href: "/", labelKey: "home" },
  { href: "/services", labelKey: "services" },
  { href: "/works", labelKey: "works" },
  { href: "/about", labelKey: "about" },
  { href: "/booking", labelKey: "booking" },
  { href: "/#contacts", labelKey: "contacts" },
];
