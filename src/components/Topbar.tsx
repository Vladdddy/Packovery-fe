import "../styles/topbar.css";

function Topbar({ header, btn }: { header: string; btn: string | null }) {
    return (
        <div className="topbar">
            <h1>{header}</h1>
            {btn !== null ? <button className="btn">{btn}</button> : null}
        </div>
    );
}

export default Topbar;
