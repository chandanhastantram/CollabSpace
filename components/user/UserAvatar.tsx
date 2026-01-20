import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  online?: boolean;
}

export function UserAvatar({ name, avatar, size = "md", className, online }: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative inline-block">
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className={cn(
            "rounded-full object-cover",
            sizeClasses[size],
            className
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center font-semibold text-white",
            sizeClasses[size],
            className
          )}
        >
          {getInitials(name)}
        </div>
      )}
      
      {online && (
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900" />
      )}
    </div>
  );
}
