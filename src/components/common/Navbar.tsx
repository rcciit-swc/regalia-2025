'use client';

import { useRef, useState, Dispatch, SetStateAction, useEffect, memo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/lib/stores';
import { login } from '@/utils/functions/auth/login';
import { logout } from '@/utils/functions/auth/logout';
import { supabase } from '@/utils/functions/supabase-client';
import { Skeleton } from '../ui/skeleton';
import { useRouter, usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { navRoutes } from '@/utils/constraints/constants';
import Image from 'next/image';
import { getRoles } from '@/utils/functions';
import { userDataType } from '@/lib/types';

// Memoized Logo component to prevent unnecessary re-renders
const Logo = memo(() => {
  const router = useRouter();
  return (
    <span
      onClick={() => router.push('/')}
      className="relative flex items-center justify-center cursor-pointer"
    >
      <Image
        src="/logo.svg"
        alt="Fest Logo"
        width={56}
        height={56}
        className="h-10 w-auto sm:h-12 md:h-14 lg:h-16 drop-shadow-glow"
        priority
      />
    </span>
  );
});

Logo.displayName = 'Logo';

const GlassNavigation = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const pathname = usePathname();
  const { userData, userLoading } = useUser();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fetch user session only once on mount
  useEffect(() => {
    const readUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user.user_metadata?.avatar_url) {
        setProfileImage(data.session.user.user_metadata.avatar_url);
      }
    };
    readUserSession();
  }, []);

  // Delayed navigation display for homepage
  useEffect(() => {
    if (pathname === '/') {
      setShowNav(false);
      const timer = setTimeout(() => {
        setShowNav(true);
      }, 9000);
      return () => clearTimeout(timer);
    } else {
      setShowNav(true);
    }
  }, [pathname]);

  // Admin role verification with memoization
  useEffect(() => {
    const verifyRoles = async () => {
      const rolesData = await getRoles();
      if (!rolesData) return;
      const roles = rolesData?.map((role) => role.role);

      if (
        rolesData.length > 0 &&
        (roles?.includes('super_admin') ||
        roles?.includes('coordinator') ||
        roles?.includes('convenor'))
      ) {
        setIsAdmin(true);
      }
    };
    verifyRoles();
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  if (!showNav) return null;

  return (
    <nav
      ref={navRef}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: hovered ? 'none' : 'auto' }}
      className="glass-nav fixed left-0 right-0 top-0 z-50 mx-auto max-w-7xl border border-pink-200/30 bg-gradient-to-br from-pink-100/10 via-pink-300/10 to-yellow-100/5 backdrop-blur-xl shadow-lg md:left-6 md:right-6 md:top-6 md:rounded-b-2xl"
    >
      <div className="flex items-center justify-between px-5 py-4 relative">
        <div className="hidden md:flex md:flex-1 justify-start">
          <Links isAdmin={isAdmin} first={true} />
        </div>
        <div className="flex justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
          <Logo />
        </div>
        <div className="flex items-center gap-4 md:flex-1 justify-end">
          <Links isAdmin={isAdmin} first={false} />
          <Buttons
            setMenuOpen={toggleMenu}
            menuOpen={menuOpen}
            imageLoaded={imageLoaded}
            image={profileImage}
            userLoading={userLoading}
            setImageLoaded={setImageLoaded}
            userData={userData}
          />
        </div>
      </div>

      {/* Only render MobileMenu when menuOpen is true for better performance */}
      {menuOpen && (
        <MobileMenu
          isAdmin={isAdmin}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          userData={userData}
          image={profileImage}
        />
      )}
    </nav>
  );
};

// Memoized Links component
const Links = memo(({ isAdmin, first }: { isAdmin?: boolean; first?: boolean }) => (
  <div className="hidden items-center gap-3 md:gap-5 lg:gap-7 xl:gap-9 md:flex">
    {navRoutes
      ?.slice(first ? 0 : 4, first ? 4 : 8)
      .map((nav, index) => (
        <GlassLink key={index} text={nav.title} route={nav.route} />
      ))}
    {isAdmin && !first && (
      <GlassLink text="Admin" route="/admin/manage-events" />
    )}
  </div>
));

Links.displayName = 'Links';

// Memoized GlassLink component
const GlassLink = memo(({ text, route }: { text: string; route: string }) => (
  <Link
    href={route}
    className="group relative overflow-hidden rounded-lg px-3 py-1 sm:px-4 text-base md:text-lg font-bold text-white/90 transition-all duration-200 hover:scale-105 active:scale-95"
  >
    <span className="relative z-10 group-hover:text-white text-shadow">
      {text}
    </span>
    <span className="absolute inset-0 bg-gradient-to-tr from-pink-300/20 via-yellow-100/10 to-pink-100/10 opacity-0 transition-opacity group-hover:opacity-100 blur-sm rounded-lg" />
  </Link>
));

GlassLink.displayName = 'GlassLink';

// Memoized Buttons component
const Buttons = memo(({
  userData,
  setMenuOpen,
  menuOpen,
  imageLoaded,
  image,
  userLoading,
  setImageLoaded,
}: {
  userData: userDataType | null;
  setMenuOpen: () => void;
  imageLoaded: boolean;
  image: string | null;
  userLoading: boolean;
  setImageLoaded: Dispatch<SetStateAction<boolean>>;
  menuOpen: boolean;
}) => (
  <div className="flex items-center gap-4">
    <SignInButton
      userData={userData}
      userLoading={userLoading}
      imageLoaded={imageLoaded}
      image={image}
      setImageLoaded={setImageLoaded}
    />
    <motion.button
      onClick={setMenuOpen}
      className="ml-2 block text-3xl text-pink-200 transition-all hover:scale-110 active:scale-95 md:hidden drop-shadow-text"
      whileHover={{ rotate: menuOpen ? 0 : 15 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        {menuOpen ? (
          <motion.div
            key="close"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <FiX className="drop-shadow-glow" />
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <FiMenu className="drop-shadow-glow" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  </div>
));

Buttons.displayName = 'Buttons';

// Memoized SignInButton
const SignInButton = memo(({
  userData,
  userLoading,
  imageLoaded,
  image,
  setImageLoaded,
}: {
  userData: userDataType | null;
  userLoading: boolean;
  imageLoaded: boolean;
  image: string | null;
  setImageLoaded: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  if (userLoading) {
    return <Skeleton className="w-10 h-10 rounded-full bg-gray-600" />;
  }

  if (userData && image) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            className="group relative focus:outline-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar className="relative h-10 w-10 transition-all ring-2 ring-pink-300/50 group-hover:ring-yellow-100/50">
              {!imageLoaded && (
                <Skeleton className="absolute inset-0 h-10 w-10 rounded-full bg-white/20" />
              )}
              <AvatarImage
                src={image}
                alt="Profile"
                onLoad={() => setImageLoaded(true)}
                className={`h-full w-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
              <AvatarFallback className="bg-gradient-to-br from-pink-200/40 to-yellow-100/30 text-white font-bold">
                {!userLoading && userData?.name
                  ? userData.name.charAt(0).toUpperCase()
                  : ''}
              </AvatarFallback>
            </Avatar>
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="mt-2 w-48 rounded-lg border border-pink-200/20 bg-gradient-to-b from-pink-100/20 to-yellow-100/10 backdrop-blur-md shadow-xl"
        >
          <DropdownMenuItem
            className="cursor-pointer px-4 py-2 text-white/90 transition-colors hover:bg-pink-200/10"
            onSelect={() => router.push('/profile')}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer px-4 py-2 text-white/90 transition-colors hover:bg-pink-200/10"
            onSelect={logout}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <motion.button
      onClick={login}
      className="relative rounded-full px-5 py-2 text-base font-semibold text-pink-100 border border-pink-200/50 bg-white/10 hover:bg-pink-100/10 transition-all shadow-lg drop-shadow-text"
      whileHover={{
        scale: 1.05,
        boxShadow: '0 0 15px rgba(255, 182, 193, 0.6)',
      }}
      whileTap={{ scale: 0.95 }}
    >
      Sign In
      <span className="absolute -inset-[2px] rounded-full blur-md bg-pink-200/20 opacity-40"></span>
    </motion.button>
  );
});

SignInButton.displayName = 'SignInButton';

// Optimized MobileMenu with reduced animation complexity
const MobileMenu = memo(({
  menuOpen,
  isAdmin,
  setMenuOpen,
  userData,
  image,
}: {
  menuOpen: boolean;
  isAdmin: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  userData: userDataType | null;
  image: string | null;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Simplified and optimized animation variants
  const menuVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        opacity: { duration: 0.2 },
        height: { duration: 0.3 }
      }
    },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
        staggerChildren: 0.03,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    },
  };

  const dividerVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { delay: 0.2, duration: 0.3 },
    },
  };

  const inactiveColor = pathname === '/' ? 'text-black' : 'text-white/90';
  const closeMenu = useCallback(() => setMenuOpen(false), [setMenuOpen]);
  
  const handleNavigation = useCallback((route: string) => {
    return () => {
      router.push(route);
      closeMenu();
    };
  }, [router, closeMenu]);

  const handleLogin = useCallback(() => {
    login();
    closeMenu();
  }, [closeMenu]);

  const handleLogout = useCallback(() => {
    logout();
    closeMenu();
  }, [closeMenu]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={menuVariants}
      className="block overflow-hidden md:hidden rounded-b-xl border-t border-pink-200/30 bg-gradient-to-b from-pink-100/20 to-yellow-100/15 backdrop-blur-xl"
      layoutId="mobileMenu"
    >
      {/* Menu Items */}
      <div className="flex flex-col items-start w-full justify-between px-6 py-6 gap-5">
        {/* Main Navigation Links */}
        <div className="w-full space-y-5">
          {navRoutes.map((nav, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="w-full"
              custom={index}
            >
              <TextLink
                text={nav.title}
                route={nav.route}
                setMenuOpen={closeMenu}
              />
            </motion.div>
          ))}

          {isAdmin && (
            <motion.div variants={itemVariants}>
              <TextLink
                text="Admin"
                route="/admin/manage-events"
                setMenuOpen={closeMenu}
              />
            </motion.div>
          )}
        </div>

        {/* Divider */}
        <motion.div
          className="w-full h-px bg-gradient-to-r from-transparent via-pink-200/30 to-transparent my-2"
          variants={dividerVariants}
        />

        {/* User Section with Profile/Login & Logout */}
        <motion.div
          className="w-full pt-2 space-y-5"
          variants={itemVariants}
        >
          {userData ? (
            <>
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4 px-2"
              >
                <div className="flex-shrink-0">
                  <Avatar className="h-12 w-12 ring-2 ring-pink-300/50">
                    <AvatarImage src={image || ''} alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-br from-pink-200/40 to-yellow-100/30 text-white text-lg font-bold">
                      {userData.name
                        ? userData.name.charAt(0).toUpperCase()
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col">
                  <span
                    className={`${inactiveColor} font-medium text-shadow`}
                  >
                    {userData.name || 'User'}
                  </span>
                  <span
                    className={`${inactiveColor} text-sm truncate max-w-[180px]`}
                  >
                    {userData.email || ''}
                  </span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <MobileMenuItem
                  inActiveColor={inactiveColor}
                  icon={
                    <FiUser color={pathname === '/' ? 'black' : 'white'} />
                  }
                  text="Profile"
                  onClick={handleNavigation('/profile')}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <MobileMenuItem
                  inActiveColor={inactiveColor}
                  icon={
                    <FiLogOut
                      color={pathname === '/' ? 'black' : 'white'}
                    />
                  }
                  text="Logout"
                  onClick={handleLogout}
                />
              </motion.div>
            </>
          ) : (
            <motion.button
              onClick={handleLogin}
              className={`w-full relative rounded-full py-3 text-lg font-semibold ${pathname === '/' ? 'text-black' : 'text-white'} border border-pink-200/50 bg-white/10 backdrop-blur-md transition-all shadow-lg drop-shadow-text`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              variants={itemVariants}
            >
              Sign In
              <span className="absolute -inset-[2px] rounded-full blur-md bg-pink-200/20 opacity-40"></span>
            </motion.button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
});

MobileMenu.displayName = 'MobileMenu';

// Memoized MobileMenuItem for better performance
const MobileMenuItem = memo(({
  icon,
  text,
  onClick,
  inActiveColor,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  inActiveColor: string;
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg ${inActiveColor} font-semibold drop-shadow-text text-lg transition-all bg-white/5`}
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-xl text-pink-200">{icon}</span>
      {text}
    </motion.button>
  );
});

MobileMenuItem.displayName = 'MobileMenuItem';

// Memoized TextLink for better performance
const TextLink = memo(({
  text,
  route,
  setMenuOpen,
}: {
  text: string;
  route: string;
  setMenuOpen: () => void;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive =
    route === '/' ? pathname === '/' : pathname.startsWith(route);
  const activeColor = pathname === '/' ? 'text-orange-400' : 'text-yellow-300';
  const inactiveColor = pathname === '/' ? 'text-black' : 'text-white/90';

  const handleClick = useCallback(() => {
    router.push(route);
    setMenuOpen();
  }, [router, route, setMenuOpen]);

  return (
    <motion.div
      className="w-full"
      whileHover={{ x: 8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <div
        onClick={handleClick}
        className="block w-full cursor-pointer"
      >
        <motion.div
          className="group relative flex items-center w-full"
          whileTap={{ scale: 0.98 }}
        >
          {isActive && (
            <motion.span
              layoutId="activeBullet"
              className="absolute -left-4 w-2 h-2 rounded-full bg-current"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}

          <span
            className={`
            ${isActive ? activeColor : inactiveColor}
            drop-shadow-text font-semibold text-start font-antolia
            tracking-widest text-xl transition-all duration-300 ease-in-out
            relative
          `}
          >
            {text}

            {/* Animated underline */}
            <span
              className={`
              absolute left-0 -bottom-1 h-[2px] w-0 
              ${isActive ? 'w-full bg-current' : 'bg-white/70 group-hover:w-full'}
              transition-all duration-300 origin-left
            `}
            />
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
});

TextLink.displayName = 'TextLink';

export default GlassNavigation;