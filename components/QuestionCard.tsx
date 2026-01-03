type Props = {
  text: string;
  name: string;
  onChange: (val: number) => void;
};

export default function QuestionCard({ text, name, onChange }: Props) {
  return (
    <div className="card">
      <p><strong>{text}</strong></p>
      {[0, 1, 2].map(v => (
        <label key={v} style={{ display: "block", padding: "8px 0" }}>
          <input
            type="radio"
            name={name}
            value={v}
            required
            onChange={() => onChange(v)}
          />{" "}
          {["Not at all", "Several days", "More than half the days"][v]}
        </label>
      ))}
    </div>
  );
}
