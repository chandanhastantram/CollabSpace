"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Chrome, Github } from "lucide-react";

export function OAuthButtons() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleGitHubSignIn = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center space-x-2"
        >
          <Chrome className="w-5 h-5" />
          <span>Google</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleGitHubSignIn}
          className="flex items-center justify-center space-x-2"
        >
          <Github className="w-5 h-5" />
          <span>GitHub</span>
        </Button>
      </div>
    </div>
  );
}
