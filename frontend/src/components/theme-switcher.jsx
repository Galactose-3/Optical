


import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Paintbrush, Sun, Moon, Gem, Leaf, Palette } from 'lucide-react';

const themes = [
    { name: 'Dark', value: 'dark', icon: Moon },
    { name: 'Primary', value: 'primary', icon: Palette },
    { name: 'Regal', value: 'regal', icon: Gem },
    { name: 'Mint', value: 'mint', icon: Leaf },
]

export function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Paintbrush className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
            <DropdownMenuItem key={theme.value} onClick={() => setTheme(theme.value)}>
                <theme.icon className="mr-2 h-4 w-4" />
                <span>{theme.name}</span>
            </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
