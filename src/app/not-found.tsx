import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "7rem 1.5rem 3rem",
        background: "#0b0d12",
        color: "#f4f0e8",
      }}
    >
      <div style={{ maxWidth: "44rem" }}>
        <p className="atlas-kicker" style={{ color: "#ff5a36" }}>404 · LOST BETWEEN WORLDS</p>
        <h1 style={{ margin: "1rem 0", fontSize: "clamp(3rem, 10vw, 8rem)", lineHeight: 0.9 }}>
          这条线暂时断了。
        </h1>
        <p style={{ maxWidth: "32rem", lineHeight: 1.8, color: "rgba(244,240,232,.7)" }}>
          页面可能尚未建成，或地址已经改变。回到入口，选择另一扇仍在生长的门。
        </p>
        <Link
          href="/"
          style={{ display: "inline-block", marginTop: "2rem", borderBottom: "2px solid #ff5a36", paddingBottom: ".35rem", fontWeight: 800 }}
        >
          返回百折万象
        </Link>
      </div>
    </main>
  );
}
