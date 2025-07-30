import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseStringify(value: unknown) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    console.error("Error parsing and stringifying value:", error);
    return value;
  }
}