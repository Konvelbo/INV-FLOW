import { useLanguage } from "@/src/context/LanguageContext";
import {
  BookIcon,
  InfoIcon,
  LifeBuoyIcon,
  MessageCircleMoreIcon,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

export default function InfoMenu() {
  const { t } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open edit menu"
          className="size-8 rounded-full shadow-none"
          size="icon"
          variant="ghost"
        >
          <InfoIcon
            aria-hidden="true"
            className="text-muted-foreground"
            size={16}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="pb-2">
        <DropdownMenuLabel>{t("needHelp")}</DropdownMenuLabel>
        <DropdownMenuItem
          asChild
          className="cursor-pointer py-1 focus:bg-transparent focus:underline"
        >
          <a href="#">
            <BookIcon aria-hidden="true" className="opacity-60" size={16} />
            {t("documentation")}
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer py-1 focus:bg-transparent focus:underline"
        >
          <a href="#">
            <LifeBuoyIcon aria-hidden="true" className="opacity-60" size={16} />
            {t("support")}
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer py-1 focus:bg-transparent focus:underline"
        >
          <a href="#">
            <MessageCircleMoreIcon
              aria-hidden="true"
              className="opacity-60"
              size={16}
            />
            {t("contactUs")}
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
