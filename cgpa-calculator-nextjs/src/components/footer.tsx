import type React from "react"
import Link from "next/link"
import { Github, Moon, Sun, Laptop, ChevronUp } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const { theme, setTheme } = useTheme()

  return (
    <footer className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700/50">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            &copy; {currentYear} Developed by{" "}
            <Link href="https://nabeelhassan.dev/" className="text-blue-500 hover:text-blue-400 transition-colors">
              Hassan Umar
            </Link>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="h-4 w-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Laptop className="h-4 w-4 mr-2" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link
            href="https://github.com/NabsCodes/cgpa_calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <Github className="h-5 w-5" />
          </Link>
        </div>
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ChevronUp className="h-3 w-3 mr-1" />
            Back to top
          </Button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
