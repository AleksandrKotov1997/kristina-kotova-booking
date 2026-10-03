interface PublicNavigationItem {
  href: string;
  label: string;
}

export const publicNavigationItems: PublicNavigationItem[] = [
  { href: "/", label: "Главная" },
  { href: "/services", label: "Услуги" },
  { href: "/works", label: "Работы" },
  { href: "/about", label: "О мастере" },
  { href: "/booking", label: "Запись" },
  { href: "/#contacts", label: "Контакты" },
];
