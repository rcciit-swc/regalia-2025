"use client"

import { useRef, useState, Dispatch, SetStateAction } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useMeasure } from "react-use"
import { useUser } from "@/lib/stores"
import { login } from "@/utils/functions/auth/login"
import { logout } from "@/utils/functions/auth/logout"
import { supabase } from "@/utils/functions/supabase-client"
import { Skeleton } from "../ui/skeleton"
import { useRouter, usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FiMenu } from "react-icons/fi"
import { useEffect } from "react"
import { navRoutes } from "@/utils/constraints/constants"
import Image from "next/image"

const Logo = () => (
  <span className="relative flex items-center justify-center">
    <Image
      src="/logo.svg"
      alt="Guitar"
      width={56}
      height={56}
      className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 xl:h-16"
    />
  </span>
)

const GlassNavigation = () => {
  const navRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showNav, setShowNav] = useState(true)
  const pathname = usePathname()

  // Hide navbar for 5s on "/" then show and open menu
  useEffect(() => {
    if (pathname === "/") {
      setShowNav(false)
      const timer = setTimeout(() => {
        setShowNav(true)
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      setShowNav(true)
    }
  }, [pathname])

  if (showNav) return (
    <nav
      ref={navRef}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: hovered ? "none" : "auto",
      }}
      className="glass-nav fixed left-0 right-0 top-0 z-50 mx-auto max-w-7xl overflow-hidden border border-[#FFF6D5] bg-gradient-to-br from-white/20 to-[#FFF6D5;] backdrop-blur md:left-6 md:right-6 md:top-6 md:rounded-b-2xl"
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
  )
  
  return null
}

const Links = () => (
  <div className="hidden items-center gap-2 md:gap-3 lg:gap-6 xl:gap-8 md:flex">
    {navRoutes.map((nav, index) => (
      <GlassLink key={index} text={nav.title} route={nav.route} />
    ))}
  </div>
)

const GlassLink = ({ text, route }: { text: string; route: string }) => (
  <Link
    href={route}
    className="font-antolia group relative scale-100 overflow-hidden rounded-lg px-2 py-1 sm:px-3 md:px-2 lg:px-3 text-sm md:text-sm lg:text-base xl:text-lg font-bold transition-transform hover:scale-105 active:scale-95"
  >
    <span className="relative z-10 text-white/90 transition-colors group-hover:text-white">{text}</span>
    <span className="absolute inset-0 z-0 bg-gradient-to-br from-white/20 to-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
  </Link>
)

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
      onClick={() => setMenuOpen((prev) => !prev)}
      className="ml-2 block scale-100 text-3xl text-white/90 transition-all hover:scale-105 hover:text-white active:scale-95 md:hidden"
    >
      <FiMenu className="text-[#FFF6D5] font-extrabold rounded-[11px] " />
    </button>
  </div>
)

const SignInButton = () => {
  const { userData, userLoading } = useUser()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const readUserSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session?.user.user_metadata?.avatar_url) {
        setProfileImage(data.session.user.user_metadata.avatar_url)
      }
    }
    readUserSession()
  }, [])

  if (userLoading) {
    return <Skeleton className="w-10 h-10 rounded-full bg-gray-600" />
  }

  if (userData && profileImage) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group relative focus:outline-none">
            <Avatar className="relative h-10 w-10 transition-all group-hover:ring-2 group-hover:ring-[#FFF6D5]/50 group-focus:ring-2 group-focus:ring-[#FFF6D5]">
              {!imageLoaded && (
                <Skeleton className="absolute inset-0 h-10 w-10 rounded-full bg-white/20" />
              )}
              <AvatarImage
                src={profileImage}
                alt="Profile"
                onLoad={() => setImageLoaded(true)}
                className={`h-full w-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <AvatarFallback className="bg-gradient-to-br from-white/20 to-[#FFF6D5]/30 text-white font-bold">
                {!userLoading && userData?.name ? userData.name.charAt(0).toUpperCase() : ''}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="mt-2 w-48 overflow-hidden rounded-lg border border-[#FFF6D5]/30 bg-gradient-to-b from-white/20 to-[#FFF6D5]/10 backdrop-blur-lg shadow-lg"
        >
          <DropdownMenuItem
            className="focus:bg-white/10 focus:text-white cursor-pointer px-4 py-2 text-white/90 transition-colors hover:bg-white/5 hover:text-white"
            onSelect={() => router.push('/profile')}
          >
            <span className="font-antolia">Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="focus:bg-white/10 focus:text-white cursor-pointer px-4 py-2 text-white/90 transition-colors hover:bg-white/5 hover:text-white"
            onSelect={logout}
          >
            <span className="font-antolia">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <button onClick={login} className="group relative scale-100 overflow-visible rounded-full px-5 py-2 sm:px-6 sm:py-3 text-base sm:text-lg font-semibold text-[#FFF6D5] transition-transform hover:scale-105 active:scale-95 border border-[#FFF6D5] shadow-[3px_1px_5px_0px_rgba(255,246,213,0.6)] bg-transparent">
      <span className="relative z-10">Sign in</span>
      <div className="absolute -inset-[1px] rounded-full blur-[1px] bg-transparent border border-[#FFF6D5] opacity-50"></div>
    </button>
  )
}

const MobileMenu = ({ menuOpen }: { menuOpen: boolean }) => {
  const [ref, { height }] = useMeasure()
  return (
    <motion.div
      initial={false}
      animate={{
        height: menuOpen ? height : "0px",
      }}
      className="block overflow-hidden md:hidden shadow-lg rounded-b-lg"
    >
      <div ref={ref as React.LegacyRef<HTMLDivElement>} className="flex flex-col items-start justify-between px-4 pb-4">
        <div className="flex flex-col items-center gap-6 w-full">
          {navRoutes.map((nav, index) => (
            <TextLink key={index} text={nav.title} route={nav.route} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const TextLink = ({ text, route }: { text: string; route: string }) => (
  <a href={route} className="text-white/90 font-antolia text-lg md:text-xl font-bold transition-colors">
    {text}
  </a>
)

export default GlassNavigation