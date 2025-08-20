"use client";

import classNames from "classnames";
import React from "react";

export interface CleanPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const CleanPageLayout = React.forwardRef<HTMLDivElement, CleanPageLayoutProps>(
  function CleanPageLayout(
    { className, children, ...otherProps }: CleanPageLayoutProps,
    ref
  ) {
    return (
      <div
        className={classNames(
          "subframe-component",
          "flex",
          "h-full",
          "w-full",
          "flex-col",
          "items-start",
          className
        )}
        ref={ref}
        {...otherProps}
      >
        {children}
      </div>
    );
  }
);

export { CleanPageLayout };
