import InfoMenu from "@/src/components/navbar-components/info-menu";
import Logo from "@/src/components/navbar-components/logo";
import NotificationMenu from "@/src/components/navbar-components/notification-menu";
import UserMenu from "@/src/components/navbar-components/user-menu";

export default function Navbare() {
  return (
    <header className="w-full backdrop-blur-md border-b px-4 md:px-6">
      <div className="w-full flex h-13 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <a className="text-primary hover:text-primary/90" href="#">
              <Logo />
            </a>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Info menu */}
            {/* <InfoMenu /> */}
            {/* Notification */}
            <NotificationMenu />
          </div>
          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
