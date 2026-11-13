"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  User,
  LogOut,
  Lock,
  Mail,
  CreditCard,
  ShieldCheck,
  Globe,
  Target,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

const ADMIN_EMAILS = ["admin@seuemail.com", "admin2@seuemail.com"];

interface NavbarProps {
  user: { name: string; email: string; role: string } | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({ user, onLogin, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = user ? ADMIN_EMAILS.includes(user.email) : false;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-surface-100/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size={36} showText={true} />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/cursos"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Cursos
            </Link>
            <Link
              href="/minha-conta"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Minha Conta
            </Link>
            {user && (
              <>
                <Link
                  href={isAdmin ? "/admin/dashboard" : "/minha-conta"}
                  className="text-sm font-medium text-accent-emerald hover:text-accent-emerald/80 transition-colors"
                >
                  {isAdmin ? "Painel Admin" : "Meus Cursos"}
                </Link>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            )}
            {!user && (
              <button
                onClick={onLogin}
                className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-neon"
              >
                Entrar / Cadastre-se
              </button>
            )}
          </div>

          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-surface-100">
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/cursos"
              className="block text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cursos
            </Link>
            <Link
              href="/minha-conta"
              className="block text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Minha Conta
            </Link>
            {user && (
              <>
                <Link
                  href={isAdmin ? "/admin/dashboard" : "/minha-conta"}
                  className="block text-accent-emerald hover:text-accent-emerald/80 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isAdmin ? "Painel Admin" : "Meus Cursos"}
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block text-gray-400 hover:text-white py-2 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            )}
            {!user && (
              <button
                onClick={() => {
                  onLogin();
                  setMobileMenuOpen(false);
                }}
                className="block bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-full text-sm font-medium text-center shadow-neon"
              >
                Entrar / Cadastre-se
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

