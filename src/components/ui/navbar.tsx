
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Home, User, Settings, LogIn, LogOut } from "lucide-react";
import React from "react";

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            🍿 Só Falta a Pipoca
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList className="space-x-2">
            <NavigationMenuItem>
              <Link to="/" className={navigationMenuTriggerStyle()}>
                <Home className="mr-2 h-4 w-4" />
                Início
              </Link>
            </NavigationMenuItem>
            
            {user && (
              <NavigationMenuItem>
                <Link to="/perfil" className={navigationMenuTriggerStyle()}>
                  <User className="mr-2 h-4 w-4" />
                  Meu Perfil
                </Link>
              </NavigationMenuItem>
            )}
            
            {isAdmin && (
              <NavigationMenuItem>
                <Link to="/admin" className={navigationMenuTriggerStyle()}>
                  <Settings className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </NavigationMenuItem>
            )}
            
            <NavigationMenuItem>
              {user ? (
                <Button variant="outline" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              ) : (
                <Link to="/auth">
                  <Button variant="outline">
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                  </Button>
                </Link>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
