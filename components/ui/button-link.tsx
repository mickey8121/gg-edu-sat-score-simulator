import type { VariantProps } from "class-variance-authority";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonLinkSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

type ButtonLinkBase = React.ComponentProps<typeof Link> & {
  variant?: NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
};

export type ButtonLinkProps =
  | (ButtonLinkBase & { size?: Exclude<ButtonLinkSize, "icon"> })
  | (ButtonLinkBase & { size: "icon" } & (
        | { "aria-label": string }
        | { "aria-labelledby": string }
      ));

export const ButtonLink = ({ className, variant, size, ...props }: ButtonLinkProps) => {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
};
