// src/components/Sidebar.jsx

import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "@/constants";
import logoLight from "@/assets/logo-light.svg";
import logoDark from "@/assets/logo-dark.svg";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-full flex-col overflow-x-hidden border-r border-slate-200 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
                collapsed ? "md:w-[70px]" : "md:w-[240px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}
        >
            <div className={cn("flex shrink-0 items-center gap-x-3 p-3", collapsed ? "md:justify-center" : "")}>
                <img src={logoLight} alt="Logo" className={cn("h-8 w-8 dark:hidden", collapsed && "md:h-10 md:w-10")} />
                <img src={logoDark} alt="Logo" className={cn("hidden h-8 w-8 dark:block", collapsed && "md:h-10 md:w-10")} />
                {!collapsed && <p className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">Admin</p>}
            </div>

            {/* --- FIX APPLIED IN THIS SECTION --- */}
            <div className="flex w-full flex-col gap-y-1 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
                {navbarLinks.map((item) => { // Use curly braces to allow variable declarations inside the map
                    if (item.links) {
                        // It's a GROUP of links
                        // Assign the icon of the first link to a capitalized variable for the collapsed view
                        const GroupIcon = item.links[0].icon;

                        return (
                            <nav key={item.title} className={cn("sidebar-group", collapsed && "md:items-center")}>
                                <div className={cn("sidebar-group-title", collapsed && "md:w-auto")}>
                                    {/* Now we can correctly render the capitalized component */}
                                    {collapsed ? <GroupIcon size={18} /> : item.title}
                                </div>
                                {item.links.map((link) => {
                                    // FIX #2: Assign the icon component for each link to a capitalized variable
                                    const LinkIcon = link.icon;
                                    return (
                                        <NavLink key={link.label} to={link.path} className={cn("sidebar-item", collapsed && "md:w-[45px]")}>
                                            <LinkIcon size={18} className="flex-shrink-0" />
                                            {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                                        </NavLink>
                                    );
                                })}
                            </nav>
                        );
                    } else {
                        // It's a SINGLE, direct link
                        // FIX #3: Assign the icon component to a capitalized variable
                        const LinkIcon = item.icon;
                        return (
                            <NavLink
                                key={item.title}
                                to={item.path}
                                end={item.path === "/"}
                                className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                            >
                                <LinkIcon size={18} className="flex-shrink-0" />
                                {!collapsed && <p className="whitespace-nowrap">{item.title}</p>}
                            </NavLink>
                        );
                    }
                })}
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};