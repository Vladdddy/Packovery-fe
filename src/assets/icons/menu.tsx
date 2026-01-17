import React from "react";

const Menu = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={"none"}
        {...props}
    >
        <path
            d="M4 8.5L20 8.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        ></path>
        <path
            d="M4 15.5L20 15.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        ></path>
    </svg>
);

export default Menu;
