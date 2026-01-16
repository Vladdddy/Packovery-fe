import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/alerts.css";

export default function Sidebar() {
	return (
		<aside className="figma-sidebar">
			<img className="sidebar-logo" src="/packovery-logo.png" alt="logo" />

			<div className="sidebar-items">
				<NavLink to="/" className={({ isActive }) => isActive ? "sidebar-item" : "sidebar-item"}>
					<div className="icon-wrap">
						<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M28 28L20 20M4 13.3333C4 14.559 4.24141 15.7727 4.71046 16.905C5.1795 18.0374 5.86699 19.0663 6.73367 19.933C7.60035 20.7997 8.62925 21.4872 9.76162 21.9562C10.894 22.4253 12.1077 22.6667 13.3333 22.6667C14.559 22.6667 15.7727 22.4253 16.905 21.9562C18.0374 21.4872 19.0663 20.7997 19.933 19.933C20.7997 19.0663 21.4872 18.0374 21.9562 16.905C22.4253 15.7727 22.6667 14.559 22.6667 13.3333C22.6667 12.1077 22.4253 10.894 21.9562 9.76162C21.4872 8.62925 20.7997 7.60035 19.933 6.73367C19.0663 5.86699 18.0374 5.1795 16.905 4.71046C15.7727 4.24141 14.559 4 13.3333 4C12.1077 4 10.894 4.24141 9.76162 4.71046C8.62925 5.1795 7.60035 5.86699 6.73367 6.73367C5.86699 7.60035 5.1795 8.62925 4.71046 9.76162C4.24141 10.894 4 12.1077 4 13.3333Z" stroke="var(--black)" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</div>
					<div className="sidebar-label">Ricerca ordine</div>
				</NavLink>

				<NavLink to="/reports" className={({ isActive }) => isActive ? "sidebar-item" : "sidebar-item"}>
					<div className="icon-wrap">
						<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M16 12.0001V17.3334M16 21.3334H16.0134M13.8174 4.78809L3.00935 22.8334C2.78655 23.2193 2.66864 23.6567 2.66737 24.1023C2.66609 24.5478 2.78149 24.986 3.00208 25.3731C3.22268 25.7602 3.54077 26.0828 3.92474 26.3088C4.30871 26.5349 4.74516 26.6564 5.19069 26.6614H26.8094C27.2547 26.6563 27.6909 26.5347 28.0747 26.3087C28.4585 26.0828 28.7764 25.7603 28.997 25.3734C29.2176 24.9865 29.333 24.5486 29.3319 24.1032C29.3308 23.6579 29.2132 23.2206 28.9907 22.8348L18.1827 4.78676C17.9553 4.41143 17.635 4.10108 17.2526 3.88569C16.8703 3.67029 16.4389 3.55713 16 3.55713C15.5612 3.55713 15.1298 3.67029 14.7474 3.88569C14.3651 4.10108 14.0447 4.41143 13.8174 4.78676V4.78809Z" stroke="var(--black)" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</div>
					<div className="sidebar-label">Segnalazioni attive</div>
				</NavLink>

				<NavLink to="/alerts" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
					<div className="icon-wrap">
						<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M18 8.66667L23.3334 14M25.3334 21.3333V25.3333M25.3334 29.3333V29.3467M5.33337 26.6667H10.6667L24.6667 12.6667C25.0169 12.3165 25.2947 11.9007 25.4842 11.4432C25.6737 10.9856 25.7713 10.4952 25.7713 10C25.7713 9.50475 25.6737 9.01435 25.4842 8.55681C25.2947 8.09926 25.0169 7.68352 24.6667 7.33333C24.3165 6.98314 23.9008 6.70535 23.4432 6.51583C22.9857 6.32631 22.4953 6.22876 22 6.22876C21.5048 6.22876 21.0144 6.32631 20.5569 6.51583C20.0993 6.70535 19.6836 6.98314 19.3334 7.33333L5.33337 21.3333V26.6667Z" stroke="var(--white)" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</div>
					<div className="sidebar-label active-label">Configuratore alert</div>
				</NavLink>
			</div>
		</aside>
	);
}
