import { Toolbox } from "lucide-react"
import React from "react"

const Logo = () => {
  return (
    <>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-base font-bold text-white shadow-sm transition-colors group-hover:bg-green-700">
        <Toolbox />
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        FixMate
      </div>
    </>
  )
}

export default Logo
