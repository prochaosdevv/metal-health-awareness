"use client";

import { useState } from "react";
import ProgressBar from "../components/ProgressBar";
import ThemeToggle from "../components/ThemeToggle";
import jsPDF from "jspdf";

const questions = [
  // GAD-7
  { section: "Anxiety (GAD-7)", text: "Feeling nervous, anxious or on edge" },
  { section: "Anxiety (GAD-7)", text: "Not being able to stop or control worrying" },
  { section: "Anxiety (GAD-7)", text: "Worrying too much about different things" },
  { section: "Anxiety (GAD-7)", text: "Trouble relaxing" },
  { section: "Anxiety (GAD-7)", text: "Being so restless that it is hard to sit still" },
  { section: "Anxiety (GAD-7)", text: "Becoming easily annoyed or irritable" },
  { section: "Anxiety (GAD-7)", text: "Feeling afraid as if something awful might happen" },

  // PHQ-9
  { section: "Depression (PHQ-9)", text: "Little interest or pleasure in doing things" },
  { section: "Depression (PHQ-9)", text: "Feeling down, depressed or hopeless" },
  { section: "Depression (PHQ-9)", text: "Trouble falling or staying asleep, or sleeping too much" },
  { section: "Depression (PHQ-9)", text: "Feeling tired or having little energy" },
  { section: "Depression (PHQ-9)", text: "Poor appetite or overeating" },
  { section: "Depression (PHQ-9)", text: "Feeling bad about yourself or feeling like a failure" },
  { section: "Depression (PHQ-9)", text: "Trouble concentrating on things" },
  { section: "Depression (PHQ-9)", text: "Moving or speaking very slowly or restlessness" },
  { section: "Depression (PHQ-9)", text: "Thoughts of hurting yourself" },
];

const options = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

export default function Home() {
  const total = questions.length;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(total).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const answeredCount = answers.filter(v => v !== null).length;

  const selectAnswer = (value: number) => {
    const updated = [...answers];
    updated[step] = value;
    setAnswers(updated);
  };

  const next = async () => {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      submit();
    }
  };
 const totalScore = result.gadScore + result.phqScore;
const overallRisk = totalRiskLevel(totalScore);
function totalRiskLevel(total: number) {
  if (total <= 6) return "Minimal";
  if (total <= 13) return "Mild";
  if (total <= 20) return "Moderate";
  return "Severe";
}

const optionLabel = (value: number) =>
  value === 0 ? "Not at all" :
  value === 1 ? "Several days" :
  "More than half the days";

function downloadPDF(
  answers: number[],
  result: any,
  questions: { section: string; text: string }[]
) {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  const marginX = 18;
  const pageHeight = 297;
  let y = 20;

  const lineGap = 6;

  const checkPage = (extra = 0) => {
    if (y + extra > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  };

  const heading = (text: string) => {
    checkPage(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(text.toUpperCase(), marginX, y);
    y += 6;

    doc.setDrawColor(180);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 8;
  };

  const labelValue = (label: string, value: string) => {
    checkPage(6);
    doc.setFont("helvetica", "bold");
    doc.text(label, marginX, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, marginX + 50, y);
    y += lineGap;
  };

  const paragraph = (text: string) => {
    checkPage(10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(text, pageWidth - marginX * 2);
    lines.forEach((l: string) => {
      checkPage(6);
      doc.text(l, marginX, y);
      y += lineGap;
    });
  };

  const optionLabel = (v: number) =>
    v === 0 ? "Not at all" : v === 1 ? "Several days" : "More than half the days";

  const totalScore = result.gadScore + result.phqScore;
  const overallRisk =
    totalScore <= 6 ? "Minimal" :
    totalScore <= 13 ? "Mild" :
    totalScore <= 20 ? "Moderate" : "Severe";

  /* ---------- TITLE ---------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Mental Health Assessment Report", pageWidth / 2, y, {
    align: "center",
  });
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 14;

  /* ---------- SUMMARY ---------- */
  heading("Summary");

  labelValue("GAD-7 Score:", `${result.gadScore} (${result.gadRisk})`);
  labelValue("PHQ-9 Score:", `${result.phqScore} (${result.phqRisk})`);
  labelValue("Total Score:", `${totalScore}`);
  labelValue("Overall Risk:", overallRisk);

  y += 6;

  /* ---------- GAD-7 ---------- */
  heading("Anxiety Assessment (GAD-7)");

  questions.slice(0, 7).forEach((q, i) => {
    paragraph(`${i + 1}. ${q.text}`);
    doc.setFont("helvetica", "italic");
    paragraph(`Answer: ${optionLabel(answers[i])} (${answers[i]})`);
    y += 2;
  });

  labelValue("GAD-7 Total:", `${result.gadScore}`);
  labelValue("Risk Level:", result.gadRisk);

  y += 6;

  /* ---------- PHQ-9 ---------- */
  heading("Depression Assessment (PHQ-9)");

  questions.slice(7).forEach((q, i) => {
    const idx = i + 7;
    paragraph(`${i + 1}. ${q.text}`);
    doc.setFont("helvetica", "italic");
    paragraph(`Answer: ${optionLabel(answers[idx])} (${answers[idx]})`);
    y += 2;
  });

  labelValue("PHQ-9 Total:", `${result.phqScore}`);
  labelValue("Risk Level:", result.phqRisk);

  y += 10;

  /* ---------- DISCLAIMER ---------- */
  heading("Disclaimer");

  paragraph(
    "This report is generated for awareness and screening purposes only. " +
    "It is not intended to replace professional medical advice, diagnosis, or treatment. " +
    "If you are experiencing severe distress or thoughts of self-harm, please seek immediate help from a qualified mental health professional or local emergency services."
  );

  doc.save("mental_health_assessment_report.pdf");
}




  const submit = async () => {
    const gadAnswers = answers.slice(0, 7);
    const phqAnswers = answers.slice(7);

    const gadScore = gadAnswers.reduce((a, b) => a + b, 0);
    const phqScore = phqAnswers.reduce((a, b) => a + b, 0);

    const gadRisk =
      gadScore <= 4 ? "Minimal" :
      gadScore <= 9 ? "Mild" :
      gadScore <= 14 ? "Moderate" : "Severe";

    const phqRisk =
      phqScore <= 4 ? "Minimal" :
      phqScore <= 9 ? "Mild" :
      phqScore <= 14 ? "Moderate" :
      phqScore <= 19 ? "Moderately Severe" : "Severe";

    setResult({ gadScore, gadRisk, phqScore, phqRisk });
    setSubmitted(true);

    await fetch("https://script.google.com/macros/s/AKfycbwHWzvfNE8LvJtk6oHBLbEyeaZVIWvgGDEBlmy7ylgX9AUvoRWdv0fOSLjhXvZqkddfgA/exec", {
      method: "POST",
      body: JSON.stringify({
        gadScore,
        gadRisk,
        phqScore,
        phqRisk,
        timestamp: new Date().toISOString(),
      }),
    });
  };

  /* ---------------- RESULT SCREEN ONLY ---------------- */
  if (submitted && result) {
    return (
      <div className="container">
        {/* <ThemeToggle /> */}

        <div className="card">
          <h2>Your Results</h2>

          <p><strong>Anxiety (GAD-7):</strong></p>
          <p>{result.gadScore} — {result.gadRisk}</p>

          <p style={{ marginTop: 12 }}>
            <strong>Depression (PHQ-9):</strong>
          </p>
          <p>{result.phqScore} — {result.phqRisk}</p>
         <button
          style={{ marginTop: 20 }}
          onClick={() => downloadPDF(answers, result, questions)}
        >
          📄 Download Report
        </button>
          <p style={{ marginTop: 16, fontSize: "0.9rem", opacity: 0.8 }}>
            This screening is for awareness only and not a diagnosis.
            Please seek professional help if needed.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- QUESTION SCREEN ---------------- */
  const q = questions[step];

  return (
    <div className="container">
      {/* <ThemeToggle /> */}

      <ProgressBar value={answeredCount} total={total} />

      <div className="card">
        <small>{q.section}</small>
        <h3 style={{ marginTop: 8 }}>
          {step + 1}. {q.text}
        </h3>

        {options.map(opt => (
          <label
            key={opt.value}
            style={{
              display: "block",
              padding: "12px",
              marginTop: "10px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="answer"
              checked={answers[step] === opt.value}
              onChange={() => selectAnswer(opt.value)}
            />{" "}
            {opt.label}
          </label>
        ))}

        <button
          style={{ marginTop: 16 }}
          disabled={answers[step] === null}
          onClick={next}
        >
          {step === total - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}
