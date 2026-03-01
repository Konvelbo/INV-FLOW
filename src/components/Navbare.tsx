import InfoMenu from "@/src/components/navbar-components/info-menu";
import Logo from "@/src/components/navbar-components/logo";
import NotificationMenu from "@/src/components/navbar-components/notification-menu";
import UserMenu from "@/src/components/navbar-components/user-menu";
import { NotificationObserver } from "@/src/components/navbar-components/NotificationObserver";

export default function Navbare() {
  return (
    <header className="w-full backdrop-blur-md border-b px-4 md:px-6">
      <div className="w-full flex h-13 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Logo />
            </div>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Info menu */}
            {/*<InfoMenu />*/}
            {/*Notification */}
            <NotificationMenu />
          </div>
          {/*User menu */}
          <UserMenu />
        </div>
      </div>
      <NotificationObserver />
    </header>
  );
}
