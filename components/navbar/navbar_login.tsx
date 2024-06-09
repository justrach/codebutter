"use client"
import Link from "next/link"

export function NavBarLogin() {
  return (
    <header className="flex items-center justify-between h-20 px-4 md:px-6 bg-white dark:bg-gray-950 shadow">
      <div className="flex items-center">
        <Link href="#" className="text-3xl font-bold" prefetch={false}>
          CodeButter
        </Link>
      </div>
    </header>
  )
}