// components/common/Breadcrumb.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface BreadcrumbProps {
  paths: { name: string; to?: string }[]; // to boşsa sadece yazı olur
}

export default function Breadcrumb({ paths }: BreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <nav aria-label="breadcrumb" style={{ marginBottom: 20, fontSize: 14 }}>
      {paths.map((path, i) => {
        const isLast = i === paths.length - 1;

        if (isLast) {
          return (
            <span key={i} style={{ fontWeight: "bold" }}>
              {path.name}
            </span>
          );
        } else {
          return (
            <span key={i}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (path.to) navigate(path.to);
                }}
                style={{ color: "#2563eb", cursor: "pointer" }}
              >
                {path.name}
              </a>
              <span style={{ margin: "0 8px" }}>{">"}</span>
            </span>
          );
        }
      })}
    </nav>
  );
}
