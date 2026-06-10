import { ReactNode } from "react";

export type SkeletonCardConfig = {
  colSpan?: string;
  height?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
  contentLines?: number;
  customContent?: ReactNode;
};

export type SkeletonProps = {
  titleWidth?: string;
  subtitleWidth?: string;
  cards: SkeletonCardConfig[];
};