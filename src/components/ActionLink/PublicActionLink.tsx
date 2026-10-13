import { useLocale } from "next-intl";
import { getPathname } from "@/shared/i18n/navigation";
import { ActionLink, type ActionLinkProps } from "./ActionLink";
export const PublicActionLink = (props: ActionLinkProps) => {
  const locale = useLocale();
  return (
    <ActionLink {...props} href={getPathname({ locale, href: props.href })} />
  );
};
