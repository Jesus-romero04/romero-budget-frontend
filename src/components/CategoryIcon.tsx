"use client";

import {
  ShoppingCart, Truck, Zap, HeartPulse, Shirt, Film,
  BookOpen, Box, Briefcase, Monitor, DollarSign,
  LucideIcon
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "shopping-cart": ShoppingCart,
  "truck":         Truck,
  "zap":           Zap,
  "heart-pulse":   HeartPulse,
  "shirt":         Shirt,
  "film":          Film,
  "book-open":     BookOpen,
  "box":           Box,
  "briefcase":     Briefcase,
  "monitor":       Monitor,
  "dollar-sign":   DollarSign,
};

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: number;
}

export default function CategoryIcon({ icon, color, size = 36 }: CategoryIconProps) {
  const Icon = ICON_MAP[icon];

  if (!Icon) {
    // Fallback para emojis viejos
    return (
      <div
        className="rounded-xl flex items-center justify-center flex-shrink-0 text-base"
        style={{ width: size, height: size, background: `${color}20` }}
      >
        {icon}
      </div>
    );
  }

  return (
    <div
      className="rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: `${color}20`, border: `1px solid ${color}30` }}
    >
      <Icon size={size * 0.48} color={color} strokeWidth={1.8} />
    </div>
  );
}