import "../../styles/topbar.css";
import MenuIcon from "../../assets/icons/menu.tsx";

function Topbar({
    header,
    btn,
    onClick,
}: {
    header: string;
    btn: string | null;
    onClick?: () => void;
}) {
    return (
        <>
            <div className="topbar-pc">
                <div className="left">
                    <h1>{header}</h1>
                </div>
                {btn !== null ? (
                    <button className="btn" onClick={onClick}>
                        {btn}
                    </button>
                ) : null}
            </div>

            <div className="topbar-mobile">
                <div className="left">
                    <div className="burger-menu">
                        <MenuIcon />
                    </div>
                    <h1>{header}</h1>
                </div>
            </div>
        </>
    );
}

export default Topbar;
