export default function ProgressBar({ value, total }: { value: number; total: number }) {
  const percent = Math.round((value / total) * 100);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        height: 8,
        background: "#e5e7eb",
        borderRadius: 999
      }}>
        <div style={{
          width: `${percent}%`,
          height: "100%",
          background: "#4a90e2",
          borderRadius: 999
        }} />
      </div>
      <small>{percent}% completed</small>
    </div>
  );
}
