"use client"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useAnimate, motion } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import useMeasure from "react-use-measure";
import { useUser } from "@/lib/stores";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
import { login } from "@/utils/functions/auth/login";
import { logout } from "@/utils/functions/auth/logout";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from "@/utils/functions/supabase-client";
import { Skeleton } from "../ui/skeleton";

const Example = () => {
  return (
    <section>
      <GlassNavigation />
      <span className="absolute -top-[600px] left-[50%] h-[800px] w-4/5 max-w-3xl -translate-x-[50%] rounded" />
    </section>
  );
};

const GlassNavigation = () => {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [scope, animate] = useAnimate();
  const navRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = ({ offsetX, offsetY, target }: MouseEvent) => {
    // @ts-ignore
    const isNavElement = [...target.classList].includes("glass-nav");

    if (isNavElement) {
      setHovered(true);

      const top = offsetY + "px";
      const left = offsetX + "px";

      animate(scope.current, { top, left }, { duration: 0 });
    } else {
      setHovered(false);
    }
  };

  useEffect(() => {
    navRef.current?.addEventListener("mousemove", handleMouseMove);

    return () =>
      navRef.current?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <nav
      ref={navRef}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: hovered ? "none" : "auto",
      }}
      className="glass-nav fixed left-0 right-0 top-0 z-10 mx-auto max-w-7xl overflow-hidden border border-[#FFF6D5] bg-gradient-to-br from-white/20 to-[#FFF6D5;] backdrop-blur md:left-6 md:right-6 md:top-6 md:rounded-b-2xl"
    >
      <div className="glass-nav flex items-center justify-between px-5 py-4 relative">
        <div className="hidden md:flex md:flex-1 justify-start">
          <Links />
        </div>

        <div className="flex justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
          <Logo />
        </div>

        <div className="flex items-center gap-4 md:flex-1 justify-end">
          <Buttons setMenuOpen={setMenuOpen} />
        </div>
      </div>

      <MobileMenu menuOpen={menuOpen} />
    </nav>
  );
};

const Logo = () => (
  <span className="relative flex items-center justify-center">
    <img
      src="logo.svg"
      alt="Guitar"
      className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 xl:h-16"
    />
  </span>
);

const Links = () => (
  <div className="hidden items-center gap-4 md:gap-6 lg:gap-8 md:flex">
    {["Home", "Events", "Team", "Gallery"].map((text) => (
      <GlassLink key={text} text={text} />
    ))}
  </div>
);

const GlassLink = ({ text }: { text: string }) => (
  <a
    href="#"
    className="font-antolia group relative scale-100 overflow-hidden rounded-lg px-3 py-1 sm:px-4 sm:py-2 md:px-3 md:py-1 text-lg md:text-base lg:text-lg font-bold transition-transform hover:scale-105 active:scale-95"
  >
    <span className="relative z-10 text-white/90 transition-colors group-hover:text-white">
      {text}
    </span>
    <span className="absolute inset-0 z-0 bg-gradient-to-br from-white/20 to-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
  </a>
);

const Buttons = ({
  setMenuOpen,
}: {
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) => (
  <div className="flex items-center gap-4">
    <div className="block md:hidden">
      <SignInButton />
    </div>
    <div className="hidden md:block">
      <SignInButton />
    </div>
    <button
      onClick={() => setMenuOpen((pv) => !pv)}
      className="ml-2 block scale-100 text-3xl text-white/90 transition-all hover:scale-105 hover:text-white active:scale-95 md:hidden"
    >
      <FiMenu className="text-[#FFF6D5] font-extrabold " />
    </button>
  </div>
);

export const SignInButton = () => {
    const { userData, userLoading,  } = useUser();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const router = useRouter();
  
    useEffect(() => {
      const readUserSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user.user_metadata?.avatar_url) {
          setProfileImage(data.session.user.user_metadata.avatar_url);
        }
      };
      readUserSession();
    }, []);
  
    if (userLoading) {
      return <Skeleton className="w-10 h-10 rounded-full bg-gray-600" />;
    }
  
    if (userData && profileImage) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="relative">
              {!imageLoaded && (
                <Skeleton className="w-10 h-10 rounded-full absolute inset-0" />
              )}
              <AvatarImage
                src={profileImage}
                alt="Profile"
                onLoad={() => setImageLoaded(true)}
                className={imageLoaded ? 'block' : 'hidden'}
              />
              <AvatarFallback>
                {!userLoading && userData?.name ? userData.name.charAt(0) : ''}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={() => {
                router.push('/profile');
              }}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={logout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  
    return (
        <button onClick={login} className="group relative scale-100 overflow-visible rounded-full px-5 py-2 sm:px-6 sm:py-3 text-base sm:text-lg font-semibold text-[#FFF6D5] transition-transform hover:scale-105 active:scale-95 border border-[#FFF6D5] shadow-[3px_1px_5px_0px_rgba(255,246,213,0.6)] bg-transparent">
    <span className="relative z-10">Sign in</span>
    <div className="absolute -inset-[1px] rounded-full blur-[1px] bg-transparent border border-[#FFF6D5] opacity-50"></div>
  </button>
    );
  };

const MobileMenu = ({ menuOpen }: { menuOpen: boolean }) => {
  const [ref, { height }] = useMeasure();
  return (
    <motion.div
      initial={false}
      animate={{
        height: menuOpen ? height : "0px",
      }}
      className="block overflow-hidden md:hidden shadow-lg rounded-b-lg"
    >
      <div
        ref={ref}
        className="flex flex-col items-start justify-between px-4 pb-4"
      >
        <div className="flex flex-col items-center gap-6">
          {["Home", "Events", "Team", "Gallery"].map((text) => (
            <TextLink key={text} text={text} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const TextLink = ({ text }: { text: string }) => (
  <a
    href={`/${text.charAt(0).toLowerCase()}${text.substring(1)}`}
    className="text-white/90 font-antolia text-lg md:text-xl font-bold transition-colors"
  >
    {text}
  </a>
);

export default Example;