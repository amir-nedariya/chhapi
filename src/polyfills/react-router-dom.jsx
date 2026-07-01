"use client";

import LinkNext from 'next/link';
import { usePathname, useRouter as useNextRouter, useParams as useNextParams } from 'next/navigation';
import { forwardRef } from 'react';

export function useNavigate() {
  const router = useNextRouter();
  return (path, options) => {
    if (options?.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  };
}

export function useLocation() {
  const pathname = usePathname();
  return { pathname };
}

export function useParams() {
  return useNextParams() || {};
}

export const Link = forwardRef(({ to, children, ...props }, ref) => {
  return <LinkNext ref={ref} href={to} {...props}>{children}</LinkNext>;
});
Link.displayName = 'Link';

export const NavLink = forwardRef(({ to, className, children, onClick, end, ...props }, ref) => {
  const pathname = usePathname() || "";
  
  // Basic active matching
  const isActive = end 
    ? pathname === to 
    : (pathname === to || (to !== "/" && pathname.startsWith(to)));
  
  const computedClassName = typeof className === 'function' ? className({ isActive }) : className;
  const renderedChildren = typeof children === 'function' ? children({ isActive }) : children;

  return (
    <LinkNext ref={ref} href={to} className={computedClassName} onClick={onClick} {...props}>
      {renderedChildren}
    </LinkNext>
  );
});
NavLink.displayName = 'NavLink';

export function Outlet() {
  return null; // Layouts have been updated to use {children}
}

export function Navigate({ to, replace }) {
  const router = useNextRouter();
  if (typeof window !== "undefined") {
    if (replace) router.replace(to);
    else router.push(to);
  }
  return null;
}
