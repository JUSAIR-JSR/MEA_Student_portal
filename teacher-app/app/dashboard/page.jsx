"use client";

import { useEffect, useState } from "react";
import { getAssignedExams } from "../api/axios";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Dashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  async function loadExams() {
    try {
      const res = await getAssignedExams();
      setExams(res.data || []);
    } catch (err) {
      console.log("Error loading exams:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="pt-24 pb-10 px-4 max-w-5xl mx-auto mt-16">

        {/* HEADER */}
        <h2 className="text-4xl font-bold mb-8 
          bg-[linear-gradient(to_right,#3b82f6,#6366f1)] 
          bg-clip-text text-transparent">
          Assigned Exams
        </h2>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="grid gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow animate-pulse"
              >
                <div className="h-6 w-2/3 bg-slate-200 rounded mb-3"></div>
                <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && exams.length === 0 && (
          <div className="p-10 text-center bg-white border border-slate-200 rounded-2xl shadow">
            <p className="text-lg text-slate-600">No exams found.</p>
          </div>
        )}

        {/* EXAMS LIST */}
        <div className="grid gap-6">
          {exams.map((exam) => (
            <Link
              key={exam._id}
              href={`/exam/${exam._id}`}
              className="
                group block p-6 rounded-2xl 
                bg-[linear-gradient(to_bottom_right,white,#f8fafc)]

                border border-slate-200 shadow 
                hover:shadow-xl transition-all
                hover:border-blue-300 hover:scale-[1.01]
              "
            >
              <div className="flex items-start justify-between">
                <h3
                  className="
                    text-xl font-bold text-slate-900 
                    group-hover:text-blue-600 transition-colors
                  "
                >
                  {exam.title}
                </h3>

                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                  {exam.subject}
                </span>
              </div>

              <p className="text-slate-600 mt-3">
                {exam.description || "No description provided"}
              </p>

              <div className="mt-5 flex gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Duration: {exam.duration} min
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Students: {exam.students?.length || 0}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
