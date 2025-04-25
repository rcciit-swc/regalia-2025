"use client"

import { useRef, useState, Dispatch, SetStateAction, useEffect } from "react"
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
import { navRoutes } from "@/utils/constraints/constants"
import Image from "next/image"

const Logo = () => (
  <span className="relative flex items-center justify-center">
    <Image
      src="/logo.svg"
      alt="Fest Logo"
      width={56}
      height={56}
      className="h-10 w-auto sm:h-12 md:h-14 lg:h-16 drop-shadow-glow"
    />
  </span>
)

const GlassNavigation = () => {
  const navRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const pathname = usePathname()

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

  if (!showNav) return null

  return (
    <nav
      ref={navRef}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: hovered ? "none" : "auto" }}
      className="glass-nav fixed left-0 right-0 top-0 z-50 mx-auto max-w-7xl border border-pink-200/30 bg-gradient-to-br from-pink-100/10 via-pink-300/10 to-yellow-100/5 backdrop-blur-xl shadow-lg md:left-6 md:right-6 md:top-6 md:rounded-b-2xl"
    >
      <div className="flex items-center justify-between px-5 py-4 relative">
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
}

const Links = () => (
  <div className="hidden items-center gap-3 md:gap-5 lg:gap-7 xl:gap-9 md:flex">
    {navRoutes.map((nav, index) => (
      <GlassLink key={index} text={nav.title} route={nav.route} />
    ))}
  </div>
)

const GlassLink = ({ text, route }: { text: string; route: string }) => (
  <Link
    href={route}
    className="group relative overflow-hidden rounded-lg px-3 py-1 sm:px-4 text-base md:text-lg font-bold text-white/90 transition-all duration-200 hover:scale-105 active:scale-95"
  >
    <span className="relative z-10 group-hover:text-white">{text}</span>
    <span className="absolute inset-0 bg-gradient-to-tr from-pink-300/20 via-yellow-100/10 to-pink-100/10 opacity-0 transition-opacity group-hover:opacity-100 blur-sm rounded-lg" />
  </Link>
)

const Buttons = ({ setMenuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>> }) => (
  <div className="flex items-center gap-4">
    <SignInButton />
    <button
      onClick={() => setMenuOpen(prev => !prev)}
      className="ml-2 block text-3xl text-white/90 transition-all hover:scale-110 active:scale-95 md:hidden"
    >
      <FiMenu className="text-pink-200 drop-shadow-glow" />
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
            <Avatar className="relative h-10 w-10 transition-all ring-2 ring-pink-300/50 group-hover:ring-yellow-100/50">
              {!imageLoaded && <Skeleton className="absolute inset-0 h-10 w-10 rounded-full bg-white/20" />}
              <AvatarImage
                src={profileImage}
                alt="Profile"
                onLoad={() => setImageLoaded(true)}
                className={`h-full w-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
              <AvatarFallback className="bg-gradient-to-br from-pink-200/40 to-yellow-100/30 text-white font-bold">
                {!userLoading && userData?.name ? userData.name.charAt(0).toUpperCase() : ''}
              </AvatarFallback>
            </Avatar>
          </button>
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
    )
  }

  return (
    <button
      onClick={login}
      className="relative rounded-full px-5 py-2 text-base font-semibold text-pink-100 border border-pink-200/50 bg-white/10 hover:bg-pink-100/10 transition-all hover:scale-105 active:scale-95 shadow-lg"
    >
      Sign In
      <span className="absolute -inset-[2px] rounded-full blur-md bg-pink-200/20 opacity-40"></span>
    </button>
  )
}

const MobileMenu = ({ menuOpen }: { menuOpen: boolean }) => {
  const [ref, { height }] = useMeasure()
  return (
    <motion.div
      initial={false}
      animate={{ height: menuOpen ? 'fit-content' : "0px" }}
      className="block overflow-hidden md:hidden rounded-b-xl border-t border-pink-200/30 bg-gradient-to-b from-pink-100/10 to-yellow-100/10 backdrop-blur-xl"
    >
      <div ref={ref as React.LegacyRef<HTMLDivElement>} className="flex flex-col items-center justify-between px-4 py-4 gap-4">
        {navRoutes.map((nav, index) => (
          <TextLink key={index} text={nav.title} route={nav.route} />
        ))}
      </div>
    </motion.div>
  )
}

const TextLink = ({ text, route }: { text: string; route: string }) => (
  <Link
    href={route}
    className="text-white/90 font-semibold text-lg transition-colors hover:text-white"
  >
    {text}
  </Link>
)

export default GlassNavigation
