import { formatDate } from "../utils/formatDate";
import type { ReactElement } from "react";

export function Header(): ReactElement {
  return (
    <header className="hero">
      <div>
        <p className="hero-kicker">fragment diary</p>
        <h1>思い出を1枚にまとめる</h1>
        <p className="hero-copy">
          書く、整える、保存する。日記をそのまま共有できる形にします。
        </p>
      </div>
      <div className="hero-meta">
        <span className="hero-meta-label">today</span>
        <strong>{formatDate(new Date())}</strong>
      </div>
    </header>
  );
}