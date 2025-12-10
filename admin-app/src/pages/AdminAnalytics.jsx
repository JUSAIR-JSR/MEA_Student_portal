import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

import {
  getOverviewStats,
  getPassFailStats,
  getSubjectAverages,
  getDepartmentPerformance,
  getTopPerformers,
  getMonthlyTrends,
  getRecentActivity,
} from "../api/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ComposedChart,
  AreaChart,
  Area,
} from "recharts";

import {
  FiUsers,
  FiUserCheck,
  FiBook,
  FiAward,
  FiPieChart,
  FiBarChart2,
  FiRefreshCw,
  FiAlertCircle,
  FiActivity,
  FiStar,
} from "react-icons/fi";

const COLORS = ["#10B981", "#EF4444", "#3B82F6", "#F59E0B", "#8B5CF6", "#06B6D4"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function AdminAnalytics() {
  const [overview, setOverview] = useState(null);
  const [passFail, setPassFail] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [departmentPerformance, setDepartmentPerformance] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const loadAll = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [
        ovRes,
        pfRes,
        saRes,
        deptRes,
        topRes,
        monthlyRes,
        recentRes,
      ] = await Promise.allSettled([
        getOverviewStats(),
        getPassFailStats(),
        getSubjectAverages(),
        getDepartmentPerformance(),
        getTopPerformers(),
        getMonthlyTrends(),
        getRecentActivity(),
      ]);

      // Helper to extract settled result
      const extract = (settled) =>
        settled.status === "fulfilled" ? settled.value.data : null;

      const ov = extract(ovRes);
      const pf = extract(pfRes);
      const sa = extract(saRes);
      const dp = extract(deptRes);
      const tp = extract(topRes);
      const mt = extract(monthlyRes);
      const ra = extract(recentRes);

      if (!ov || !pf || !sa) {
        // Non-fatal, show message but still load whatever available
        setError("Some core analytics endpoints returned incomplete data.");
      }

      if (ov) setOverview(ov);
      if (pf) setPassFail(pf);
      if (sa) setSubjects(sa);
      if (dp) setDepartmentPerformance(dp);
      if (tp) setTopPerformers(tp);
      if (mt) setMonthlyTrends(mt);
      if (ra) setRecentActivity(ra);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Failed to load analytics. Check server logs.");
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare pie data from passFail
  const pieData = passFail
    ? [
        { name: "Passed", value: Number(passFail.passed) },
        { name: "Failed", value: Number(passFail.failed) },
      ]
    : [];

  return (
    <>
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/60 via-purple-50/40 to-pink-50/40 -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-6 pt-6 pb-3"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-600">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">Real-time insights from database</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-300"
            >
              <option value="all">All Time</option>
              <option value="monthly">This Month</option>
              <option value="weekly">This Week</option>
            </select>
{/* 
            <button
              onClick={loadAll}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 shadow hover:shadow-lg"
            >
              <FiRefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="text-sm">Refresh</span>
            </button> */}
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="mx-6 mb-4">
          <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200 flex items-center gap-3">
            <FiAlertCircle className="w-5 h-5 text-yellow-600" />
            <div className="text-sm text-yellow-800">{error}</div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-8">
        {/* Overview stat cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { label: "Students", value: overview?.students ?? "—", icon: FiUsers },
            { label: "Teachers", value: overview?.teachers ?? "—", icon: FiUserCheck },
            { label: "Exams", value: overview?.exams ?? "—", icon: FiBook },
            { label: "Results", value: overview?.results ?? "—", icon: FiAward },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                variants={itemVariants}
                className="relative p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/20 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{card.label}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{card.value}</h3>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 xl:grid-cols-3 gap-8"
        >
          {/* Pass/Fail Pie */}
          <motion.section variants={itemVariants} className="rounded-2xl p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <FiPieChart className="w-5 h-5 text-blue-600" /> Pass / Fail
              </h4>
              <div className="text-sm text-gray-500">Pass mark: {passFail?.passMark ?? "—"}</div>
            </div>

            {passFail ? (
              <>
                <div className="w-full h-56">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} innerRadius={36} label>
                        {pieData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="text-center p-3 rounded-lg bg-green-50 border border-green-100">
                    <div className="text-2xl font-bold text-green-700">{passFail.passed}</div>
                    <div className="text-xs text-green-600">Passed</div>
                    <div className="text-xs text-green-500 mt-1">{passFail.passPercent}%</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-50 border border-red-100">
                    <div className="text-2xl font-bold text-red-700">{passFail.failed}</div>
                    <div className="text-xs text-red-600">Failed</div>
                    <div className="text-xs text-red-500 mt-1">{passFail.failPercent}%</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-56">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            )}
          </motion.section>

          {/* Subjects Composed chart */}
          <motion.section variants={itemVariants} className="xl:col-span-2 rounded-2xl p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <FiBarChart2 className="w-5 h-5 text-purple-600" /> Subject Performance
              </h4>
              <div className="text-sm text-gray-500">Average marks across subjects</div>
            </div>

            {subjects?.length > 0 ? (
              <div className="w-full h-80">
                <ResponsiveContainer>
                  <ComposedChart data={subjects}>
                    <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
                    <XAxis dataKey="subject" angle={-30} textAnchor="end" height={60} />
                    <YAxis label={{ value: "Marks", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgMarks" name="Average" fill="#3B82F6" barSize={24} radius={[6,6,0,0]} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-500">
                No subject data
              </div>
            )}
          </motion.section>
        </motion.div>

        {/* Additional analytics row */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly trends */}
          <motion.section variants={itemVariants} className="rounded-2xl p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <FiActivity className="w-5 h-5 text-green-600" /> Monthly Trends
              </h4>
              <div className="text-sm text-gray-500">Avg marks & exams per month</div>
            </div>

            {monthlyTrends?.length > 0 ? (
              <div className="w-full h-64">
                <ResponsiveContainer>
                  <AreaChart data={monthlyTrends}>
                    <CartesianGrid stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="averageMarks" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">No monthly data</div>
            )}
          </motion.section>

          {/* Top performers */}
          <motion.section variants={itemVariants} className="rounded-2xl p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <FiStar className="w-5 h-5 text-yellow-500" /> Top Performers
              </h4>
              <div className="text-sm text-gray-500">Based on average marks</div>
            </div>

            {topPerformers?.length > 0 ? (
              <div className="space-y-3">
                {topPerformers.slice(0, 8).map((t, i) => (
                  <div key={t._id || i} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-white ${
                        i === 0 ? "bg-gradient-to-r from-yellow-500 to-yellow-600" :
                        i === 1 ? "bg-gradient-to-r from-gray-500 to-gray-600" :
                        "bg-gradient-to-r from-blue-500 to-blue-600"
                      }`}>
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.department || t.rollNo}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">{t.averageMarks ?? "-"}</div>
                      <div className="text-xs text-gray-500">Average</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">No top performers</div>
            )}
          </motion.section>
        </motion.div>

        {/* Department performance list and recent activity */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2 rounded-2xl p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-lg">
            <h4 className="text-lg font-semibold mb-4">Department Performance</h4>
            {departmentPerformance?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departmentPerformance.map((d) => (
                  <div key={d.department} className="p-4 rounded-xl bg-gradient-to-r from-white to-gray-50 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{d.department}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{d.averageMarks}</p>
                      </div>
                      <div className="text-sm text-gray-500">{d.students} students</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No department data</div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="rounded-2xl p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-lg">
            <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
            {recentActivity?.length > 0 ? (
              <div className="space-y-3 text-sm">
                {recentActivity.map((act, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">{act.description}</div>
                        <div className="text-xs text-gray-500 mt-1">{new Date(act.timestamp).toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-gray-500">{act.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No recent activity</div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
