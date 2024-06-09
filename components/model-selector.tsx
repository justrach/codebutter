"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuGroup, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export function ModelSelector({ modelList, onModelSelect }: { modelList: any; onModelSelect: (modelId: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Select a model");
  
  const handleMenuItemClick = (modelId: any) => {
    setSelectedModel(modelId.fileName);
    setMenuOpen(false); // Close the menu when an item is clicked
    // Step 3: Call the callback function with the selected model ID
    onModelSelect(modelId.id);
  };


  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" onClick={() => setMenuOpen(true)}>{selectedModel}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <div>
          <div />
          <Input placeholder="Search..." />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {modelList.map((model:any) => (
            <DropdownMenuItem key={model.id} onSelect={() => handleMenuItemClick(model)}>
              {model.fileName}
            </DropdownMenuItem>
          ))}
          {/* <DropdownMenuItem onSelect={() => handleMenuItemClick('Profile')}>Profile</DropdownMenuItem> */}
          {/* <DropdownMenuItem onSelect={() => handleMenuItemClick('Billing')}>Billing</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMenuItemClick('Settings')}>Settings</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMenuItemClick('Keyboard shortcuts')}>Keyboard shortcuts</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMenuItemClick('Team')}>Team</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMenuItemClick('GitHub')}>GitHub</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMenuItemClick('Support')}>Support</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMenuItemClick('API')}>API</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMenuItemClick('Log out')}>Log out</DropdownMenuItem> */}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}