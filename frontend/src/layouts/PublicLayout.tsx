import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";

import { SiteNavbar } from "@/components/common/SiteNavbar";
import { SiteFooter } from "@/components/common/SiteFooter";

interface Props {
  children?: ReactNode;
}

const PublicLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />

      <main>{children ?? <Outlet />}</main>

      <SiteFooter />
    </div>
  );
};

export default PublicLayout;
