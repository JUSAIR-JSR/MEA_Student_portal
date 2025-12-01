// src/pages/StudentDashboard.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentResults } from "../api/api";
import html2canvas from "html2canvas/dist/html2canvas.esm.js";
import jsPDF from "jspdf";

export default function StudentDashboard() {
  const [latestResult, setLatestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const certificateRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await getStudentResults();
      if (res.data?.length > 0) {
        const sorted = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLatestResult(sorted[0]);
      }
    } catch (err) {
      console.error("Failed to load results", err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async (e) => {
    if (!latestResult) return;
    const button = e.currentTarget;
    const originalText = button.textContent;
    button.textContent = "Generating PDF...";
    button.disabled = true;

    try {
      const input = certificateRef.current;
      // ensure fonts and images are loaded; useCORS true for external images
      const canvas = await html2canvas(input, { scale: 3, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // compute centered X offset (so content is centered horizontally)
      const imgWidthInMm = pdfWidth;
      const imgHeightInMm = pdfHeight;
      const xOffset = (pdfWidth - imgWidthInMm) / 2;
      const yOffset = 10; // small top margin

      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidthInMm, imgHeightInMm);
      pdf.save(`Result_${latestResult?.examId?.title || "Certificate"}.pdf`);
    } catch (err) {
      console.error("PDF error", err);
      alert("Failed to generate PDF. Try again.");
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  };

  // status helper (only Passed/Failed)
  const getStatus = (marks) => {
    if (marks >= 40) return { text: "Passed", colorCls: "text-emerald-700", bgCls: "bg-emerald-50 border-emerald-200" };
    return { text: "Failed", colorCls: "text-rose-700", bgCls: "bg-rose-50 border-rose-200" };
  };

  const status = latestResult ? getStatus(latestResult.marks) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {latestResult ? (
              <div className="space-y-6">
                <div ref={certificateRef} className="relative bg-white rounded-2xl p-8 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-purple-50/60 pointer-events-none"></div>

                  <div className="relative z-10 space-y-8">
                    <div className="text-center">
                      <h3 className="text-4xl font-bold tracking-tight">Certificate of Achievement</h3>
                      <div className="mt-4">
                        <span className={`px-6 py-2 rounded-full text-sm font-semibold ${status?.bgCls} ${status?.colorCls}`}>{status?.text}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                      <div>
                        <p className="text-sm text-gray-500 uppercase">Student Name</p>
                        <p className="text-lg font-semibold">{latestResult.studentId?.name || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase">Roll Number</p>
                        <p className="text-lg font-semibold">{latestResult.studentId?.rollNo || "—"}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 uppercase">Department</p>
                        <p className="text-lg font-semibold">{latestResult.studentId?.department || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase">Examination</p>
                        <p className="text-lg font-semibold">{latestResult.examId?.title || "—"}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 uppercase">Subject</p>
                        <p className="text-lg font-semibold">{latestResult.subject || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase">Marks Obtained</p>
                        <p className="text-lg font-semibold">{latestResult.marks ?? "—"}</p>
                      </div>

                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500 uppercase">Overall Grade</p>
                        <p className="text-2xl font-bold">{latestResult.grade || "—"}</p>
                      </div>

                      <div className="md:col-span-2 text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">Issued on {new Date(latestResult.createdAt).toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button onClick={downloadPDF} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg">Download Certificate</button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Available</h3>
                <p className="text-gray-600 max-w-sm mx-auto">Your examination results will appear here once they are published.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick actions & stats (keeps same as earlier) */}
          </div>
        </div>
      </div>
    </div>
  );
}
