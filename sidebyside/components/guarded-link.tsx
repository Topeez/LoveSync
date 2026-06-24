"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { useUnsavedChanges } from "./unsaved-changes-context";

type GuardedLinkProps = React.ComponentProps<typeof Link>;

export function GuardedLink(props: GuardedLinkProps) {
    const { href, onClick, ...rest } = props;
    const router = useRouter();
    const { requestNavigation } = useUnsavedChanges();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        requestNavigation(() => {
            if (typeof href === "string") {
                router.push(href);
            } else {
                router.push(href.toString());
            }
        });

        if (onClick) onClick(e);
    };

    return <Link {...rest} href={href} onClick={handleClick} />;
}
