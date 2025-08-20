"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TableProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderRowProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
}

function TableRoot({ children, header, className }: TableProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-md border border-[#4269aaff] bg-[#030c36ff]", className)}>
      {header && (
        <div className="border-b border-[#4269aaff] bg-[#1a2b5aff]">
          {header}
        </div>
      )}
      <div className="divide-y divide-[#4269aaff]">
        {children}
      </div>
    </div>
  );
}

function TableHeaderRow({ children, className }: TableHeaderRowProps) {
  return (
    <div className={cn("flex items-center px-4 py-3", className)}>
      {children}
    </div>
  );
}

function TableHeaderCell({ children, className }: TableHeaderCellProps) {
  return (
    <div className={cn("flex-1 text-caption font-caption text-[#8ca1ccff] font-medium", className)}>
      {children}
    </div>
  );
}

function TableRow({ children, className }: TableRowProps) {
  return (
    <div className={cn("flex items-center px-4 py-4 hover:bg-[#1a2b5aff] transition-colors", className)}>
      {children}
    </div>
  );
}

function TableCell({ children, className }: TableCellProps) {
  return (
    <div className={cn("flex-1", className)}>
      {children}
    </div>
  );
}

export const Table = Object.assign(TableRoot, {
  Row: TableRow,
  Cell: TableCell,
  HeaderRow: TableHeaderRow,
  HeaderCell: TableHeaderCell,
});
