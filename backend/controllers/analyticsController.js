import Analytics from "../models/Analytics.js";
import Enquiry from "../models/Enquiry.js";

const parseDevice = (userAgent = "") => {
  const ua = userAgent.toLowerCase();

  if (/ipad|tablet|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod|windows phone/i.test(ua)) return "mobile";
  return "desktop";
};

const parseBrowser = (userAgent = "") => {
  const ua = userAgent.toLowerCase();
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome\//i.test(ua) && !/opr\//i.test(ua)) return "Chrome";
  if (/firefox\//i.test(ua)) return "Firefox";
  if (/safari\//i.test(ua)) return "Safari";
  if (/opr\//i.test(ua)) return "Opera";
  return "Unknown";
};

const parseOS = (userAgent = "") => {
  const ua = userAgent.toLowerCase();
  if (/windows/i.test(ua)) return "Windows";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/mac os/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Unknown";
};

const getStartOfDay = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const getStartOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), 1);
const getStartOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
};

export const trackVisitor = async (req, res) => {
  try {
    const { page = "/", referrer = "direct" } = req.body || {};
    const userAgent = req.headers["user-agent"] || "";

    const sessionId = req.headers["x-session-id"] || req.body?.sessionId || `sess-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const timestamp = new Date();
    const date = timestamp.toISOString().slice(0, 10);

    const record = await Analytics.create({
      sessionId,
      timestamp,
      date,
      page: page.startsWith("/") ? page : `/${page}`,
      device: parseDevice(userAgent),
      browser: parseBrowser(userAgent),
      operatingSystem: parseOS(userAgent),
      referrer: referrer && referrer !== "null" ? String(referrer).slice(0, 200) : "direct",
    });

    return res.status(201).json({
      success: true,
      data: { record },
    });
  } catch (error) {
    console.error("Track visitor error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to record visitor analytics.",
    });
  }
};

export const getOverview = async (req, res) => {
  try {
    const now = new Date();
    const today = getStartOfDay(now);
    const weekStart = getStartOfWeek(now);
    const monthStart = getStartOfMonth(now);
    const totalVisitors = await Analytics.distinct("sessionId");
    const visitorsToday = await Analytics.distinct("sessionId", { timestamp: { $gte: today } });
    const visitorsThisWeek = await Analytics.distinct("sessionId", { timestamp: { $gte: weekStart } });
    const visitorsThisMonth = await Analytics.distinct("sessionId", { timestamp: { $gte: monthStart } });
    const totalPageViews = await Analytics.countDocuments();
    const totalEnquiries = await Enquiry.countDocuments();
    const todaysEnquiries = await Enquiry.countDocuments({ createdAt: { $gte: today } });
    const thisMonthEnquiries = await Enquiry.countDocuments({ createdAt: { $gte: monthStart } });

    const onlineNow = await Analytics.aggregate([
      { $match: { timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) } } },
      { $group: { _id: "$sessionId" } },
      { $count: "sessions" },
    ]);

    return res.json({
      success: true,
      data: {
        totalVisitors: totalVisitors.length,
        visitorsToday: visitorsToday.length,
        visitorsThisWeek: visitorsThisWeek.length,
        visitorsThisMonth: visitorsThisMonth.length,
        totalPageViews,
        totalEnquiries,
        todaysEnquiries,
        thisMonthEnquiries,
        visitorsCurrentlyOnline: onlineNow[0]?.sessions || 0,
      },
    });
  } catch (error) {
    console.error("Overview analytics error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load analytics overview.",
    });
  }
};

export const getDailyVisitors = async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const results = await Analytics.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          visitors: { $addToSet: "$sessionId" },
        },
      },
      { $project: { _id: 0, date: "$_id", visitors: { $size: "$visitors" } } },
      { $sort: { date: 1 } },
    ]);

    const series = results.map((item) => ({
      date: new Date(`${item.date}T00:00:00`).toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
      visitors: item.visitors,
    }));

    return res.json({ success: true, data: series });
  } catch (error) {
    console.error("Daily visitors error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load daily visitors.",
    });
  }
};

export const getMonthlyVisitors = async (req, res) => {
  try {
    const months = Number(req.query.months) || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (months - 1));
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const results = await Analytics.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
          },
          visitors: { $addToSet: "$sessionId" },
        },
      },
      { $project: { _id: 0, year: "$_id.year", month: "$_id.month", visitors: { $size: "$visitors" } } },
      { $sort: { year: 1, month: 1 } },
    ]);

    const formatted = results.map((item) => ({
      month: new Date(item.year, item.month - 1, 1).toLocaleDateString("en-US", { month: "long" }),
      visitors: item.visitors,
    }));

    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Monthly visitors error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load monthly visitors.",
    });
  }
};

export const getDeviceStats = async (req, res) => {
  try {
    const results = await Analytics.aggregate([
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const total = results.reduce((sum, item) => sum + item.count, 0) || 1;

    return res.json({
      success: true,
      data: results.map((item) => ({
        name: item._id,
        value: Number(((item.count / total) * 100).toFixed(1)),
      })),
    });
  } catch (error) {
    console.error("Device stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load device analytics.",
    });
  }
};

export const getPageStats = async (req, res) => {
  try {
    const results = await Analytics.aggregate([
      { $group: { _id: "$page", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return res.json({
      success: true,
      data: results.map((item) => ({
        page: item._id,
        views: item.count,
      })),
    });
  } catch (error) {
    console.error("Page stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load page analytics.",
    });
  }
};

export const getRecentEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(10).lean();
    return res.json({ success: true, data: enquiries });
  } catch (error) {
    console.error("Get recent enquiries error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load recent enquiries.",
    });
  }
};
