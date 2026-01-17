import "../../styles/topbar.css";

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
        <div className="topbar">
            <h1>{header}</h1>
            {btn !== null ? (
                <button className="btn" onClick={onClick}>
                    {btn}
                </button>
            ) : null}
        </div>
    );
}

export default Topbar;
