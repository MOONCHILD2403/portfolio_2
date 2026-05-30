import type { ReactNode } from "react";

type SectionHeaderProps = {
  kicker: string;
  title: string;
  copy: ReactNode;
};

export function SectionHeader({ kicker, title, copy }: SectionHeaderProps) {
  return (
    <div className="section-heading">
      <div className="section-kicker">{kicker}</div>
      <div className="eyebrow-rule" />
      <h2 className="section-title">{title}</h2>
      <div className="section-copy">{copy}</div>
    </div>
  );
}
