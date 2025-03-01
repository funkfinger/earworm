"use client";

import Image from "next/image";

interface UserProfileProps {
  user: {
    display_name: string;
    images: { url: string }[];
  };
  onLogout: () => void;
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  return (
    <div data-testid="user-profile" className="flex items-center gap-4">
      {user.images[0] && (
        <Image
          src={user.images[0].url}
          alt={user.display_name}
          className="rounded-full"
          width={40}
          height={40}
        />
      )}
      <span className="font-medium text-white">{user.display_name}</span>
      <button
        onClick={onLogout}
        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
