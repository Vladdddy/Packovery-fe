import React from "react";

const Clock = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={"none"}
        {...props}
    >
        <circle cx="12" cy="12" r="10" stroke="currentColor"></circle>
        <path
            d="M12 8V12L14 14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        ></path>
    </svg>
);

export default Clock;
