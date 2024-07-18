import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";

export default function Guest({ header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const { flash } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-50 border-b border-blue-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/" aria-label="Home">
                                    <ApplicationLogo className="block h-9 w-auto fill-current" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex text-blue-900">
                                <NavLink
                                    href="/"
                                    active={route().current("/")}
                                    className={
                                        window.location.pathname === "/"
                                            ? " border-b-2 border-blue-900 text-blue-900 focus:border-blue-700 font-semibold focus:text-blue-700"
                                            : ""
                                    }
                                >
                                    Home
                                </NavLink>
                                <NavLink
                                    href={route("hub.index")}
                                    active={route().current("hub.index")}
                                >
                                    Hub List
                                </NavLink>
                            </div>
                        </div>
                        <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                            {/* Login user for debugging */}
                            <NavLink
                                href="/testlogin/1"
                                // active="/testlogin"
                            >
                                Test Admin
                            </NavLink>
                            <NavLink href="/testlogin/2">Test User</NavLink>
                            <NavLink
                                href={route("login")}
                                active={route().current("login")}
                            >
                                Log in
                            </NavLink>

                            <NavLink
                                href={route("register")}
                                active={route().current("register")}
                            >
                                Register
                            </NavLink>
                        </div>
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                aria-label="Open Main Menu"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href="/"
                            active={route().current("/")}
                        >
                            Home
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("hub.index")}
                            active={route().current("hub.index")}
                        >
                            Hub List
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href="/login">
                                Log in
                            </ResponsiveNavLink>

                            <ResponsiveNavLink href="/register">
                                Register
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href="/testlogin/1">
                                Test Admin
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href="/testlogin/2">
                                Test User
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>
            {header && (
                <header className="bg-blue-50 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}
            <main className="p-2">
                {flash.success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 w-1/2 mx-auto text-center">
                        {flash.success}
                    </div>
                )}
                {flash.error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 w-1/2 mx-auto text-center">
                        {flash.error}
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}
