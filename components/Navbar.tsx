import Link from "next/link";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { buttonVariants } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo / Home Link */}
        <Link href="/" className="flex z-40 font-semibold">
          <span>Home</span>
        </Link>

        {/* Right Side - Auth Buttons */}
        <div className="flex items-center gap-4">
            
            {/* Show this if user is SIGNED OUT */}
            <SignedOut>
                <SignInButton mode="modal">
                    <button className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        Sign in
                    </button>
                </SignInButton>
                {/* Optional: Add a Get Started button here too if you want */}
            </SignedOut>

            {/* Show this if user is SIGNED IN */}
            <SignedIn>
                <UserButton afterSignOutUrl="/" />
            </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;