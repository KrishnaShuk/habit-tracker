import React from 'react';
const Silhouette1 = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="40" cy="40" r="40" fill="currentColor"/>
    <circle cx="40" cy="30" r="12" fill="white"/>
    <path d="M68 80C68 62.3269 55.6731 48 40 48C24.3269 48 12 62.3269 12 80H68Z" fill="white"/>
  </svg>
);

const Silhouette2 = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="40" cy="40" r="40" fill="currentColor"/>
    <circle cx="40" cy="32" r="10" fill="white"/>
    <rect x="20" y="52" width="40" height="28" rx="14" fill="white"/>
  </svg>
);

const Silhouette3 = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="40" cy="40" r="40" fill="currentColor"/>
    <path d="M40 20L55 45H25L40 20Z" fill="white"/>
    <rect x="25" y="45" width="30" height="35" fill="white"/>
  </svg>
);

export const avatars = [
  <Silhouette1 key={1} />, 
  <Silhouette2 key={2} />, 
  <Silhouette3 key={3} />
];