import {Link} from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                "inline-flex items-center px-1 pt-1   font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
                (active
                    ? "border-b-2 border-blue-900 text-blue-900 focus:border-blue-700 font-semibold "
                    : " text-blue-800 hover:text-blue-700 hover:border-blue-300 focus:text-blue-700 focus:border-blue-300 ") +
                className
            }
        >
            {children}
        </Link>
    );
}
