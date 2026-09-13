import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Analytics from "./pages/Analytics";
import Enquiries from "./pages/Enquiries";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  GraduationCap,
  MapPin,
  Menu,
  Phone,
  Star,
  X,
} from "lucide-react";

const DEFAULT_RENDER_API_URL = "https://anish-tuition-mern-professional-seo.onrender.com/api";

const API_URL = import.meta.env.VITE_API_URL || (() => {
  const host = window.location.hostname;
  const isLocalhost = host === "localhost" || host === "127.0.0.1";
  const isRenderHost = host.includes("onrender.com") || host.includes("render.com");

  if (isLocalhost) return "http://localhost:5000/api";
  if (isRenderHost) return DEFAULT_RENDER_API_URL;

  return `${window.location.origin}/api`;
})();

const subjects = [
  ["Mathematics", "Concepts, calculations & problem solving"],
  ["Science", "Clear concepts, examples & revision"],
  ["English", "Grammar, reading, writing & comprehension"],
  ["Hindi", "Grammar, language & writing skills"],
  ["Social Science", "History, Geography & Civics"],
  ["Computer", "Fundamentals & practical concepts"],
  ["General Knowledge", "Age-appropriate knowledge & awareness"],
];

const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];

const highlights = [
  { icon: GraduationCap, title: "Strong fundamentals", text: "Build clarity before marks." },
  { icon: BookOpen, title: "Personal attention", text: "Learning paced to each student." },
  { icon: Clock3, title: "Regular revision", text: "Consistent practice for retention." },
];

const steps = [
  "Understand the chapter with easy explanations",
  "Practice important questions and worksheets",
  "Review mistakes and improve confidence",
];

const defaultPricing = [
  { range: "Class 1 to 5", price: 3000, note: "Focused foundational learning and concept clarity" },
  { range: "Class 6 to 8", price: 4500, note: "Strengthened syllabus support and regular revision" },
];

const faqs = [
  { q: "Which classes do you teach?", a: "I teach students from Class 1 to Class 8 in Lucknow." },
  { q: "Do you cover all major subjects?", a: "Yes, I support Mathematics, Science, English, Hindi, Social Science, Computer and General Knowledge." },
  { q: "How can I book a tuition slot?", a: "You can send an enquiry through the form or call directly on 8565912536." },
  { q: "Do you focus on weak students too?", a: "Yes. My method is designed to simplify concepts and strengthen fundamentals for every learner." },
];

const whatsappLink = "https://wa.me/918565912536?text=Hi%20Anish%2C%20I%20want%20to%20enquire%20about%20tuition%20classes.";

const PublicWebsite = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState(0);
  const [form, setForm] = React.useState({ name: "", phone: "", className: "", address: "", message: "" });
  const [status, setStatus] = React.useState("");
  const [pricing, setPricing] = React.useState(defaultPricing);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Sending enquiry...");

    try {
      const res = await fetch(`${API_URL}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");

      setStatus("Enquiry received successfully. I will contact you soon.");
      setForm({ name: "", phone: "", className: "", address: "", message: "" });
    } catch {
      setStatus("Could not submit online. Please call 8565912536.");
    }
  };

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const response = await fetch(`${API_URL}/settings/fees`);
        const data = await response.json();
        if (data?.success && Array.isArray(data.data) && data.data.length) {
          setPricing(data.data.map((plan) => ({ ...plan, price: Number(plan.price) })));
        }
      } catch (error) {
        console.error("Unable to load fee plans:", error);
      }
    };

    const recordVisit = async () => {
      const sessionId = localStorage.getItem("sessionId") || `sess-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem("sessionId", sessionId);

      const payload = {
        sessionId,
        page: window.location.pathname || "/",
        referrer: document.referrer || "direct",
      };

      try {
        await fetch(`${API_URL}/admin/analytics/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-session-id": sessionId },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error("Analytics tracking failed:", error);
      }
    };

    loadPricing();
    recordVisit();
  }, []);

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container nav">
          <button type="button" className="brand" onClick={() => go("home")} aria-label="Anish Ojha Tuition Classes home">
            <span className="logo">AO</span>
            <span>
              <b>Anish Ojha</b>
              <small>Tuition Classes</small>
            </span>
          </button>

          <nav className={menuOpen ? "links show" : "links"} aria-label="Main navigation">
            <button type="button" onClick={() => go("home")}>Home</button>
            <button type="button" onClick={() => go("about")}>About</button>
            <button type="button" onClick={() => go("classes")}>Classes &amp; Subjects</button>
            <button type="button" onClick={() => go("why")}>Why Me</button>
            <button type="button" onClick={() => go("contact")}>Contact</button>
          </nav>

          <a className="call-button" href="tel:+918565912536">
            <Phone size={16} /> Call Now
          </a>

          <button type="button" className="hamburger" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="hero-section">
          <div className="hero-glow" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="pill">
                <MapPin size={15} /> Tuition Classes in Lucknow
              </div>
              <h1>
                Personal Tuition for <em>Class 1–8</em> students in Lucknow
              </h1>
              <p className="lead">
                I’m <strong>Anish Ojha</strong>, a B.Tech student helping children build
                confidence, score better in school and learn with clarity across major
                subjects.
              </p>

              <div className="actions">
                <button type="button" className="btn primary" onClick={() => go("contact")}>
                  Enquire for Tuition <ArrowRight size={18} />
                </button>
                <a className="btn outline" href="tel:+918565912536">
                  <Phone size={18} /> 8565912536
                </a>
              </div>

              <div className="hero-points">
                <span><CheckCircle2 /> Classes 1–8</span>
                <span><CheckCircle2 /> All major subjects</span>
                <span><CheckCircle2 /> Local, focused teaching</span>
              </div>
            </div>

            <aside className="profile-card">
              <div className="card-top">
                <span>Your Tutor</span>
                <Star size={16} />
              </div>
              <div className="avatar">AO</div>
              <h2>Anish Ojha</h2>
              <p>B.Tech Student &amp; Private Tutor</p>
              <div className="marks">
                <div>
                  <b>85%</b>
                  <span>Class 10</span>
                </div>
                <div>
                  <b>85%</b>
                  <span>Class 12</span>
                </div>
              </div>
              <div className="card-note">
                <GraduationCap /> Currently pursuing B.Tech
              </div>
            </aside>
          </div>
        </section>

        <section className="stats-strip">
          <div className="container stats-grid">
            <div>
              <Award />
              <span><b>85%</b> Class 10</span>
            </div>
            <div>
              <Award />
              <span><b>85%</b> Class 12</span>
            </div>
            <div>
              <GraduationCap />
              <span><b>B.Tech</b> Pursuing</span>
            </div>
            <div>
              <MapPin />
              <span><b>Lucknow</b> Local Tuition</span>
            </div>
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="container two-col">
            <div>
              <div className="eyebrow">About Anish Ojha</div>
              <h2>Helping students understand, practise and improve.</h2>
              <p>
                I provide tuition classes in Lucknow for students from Class 1 to Class 8.
                With a student-friendly approach and a practical understanding of school
                requirements, I focus on making learning simple and effective.
              </p>
              <p>
                Every topic is taught step by step, followed by guided practice and revision.
                The aim is not just to complete the syllabus, but to build strong academic
                confidence and long-term habit formation.
              </p>
            </div>

            <div className="info-box">
              <div>
                <BookOpen />
                <span>
                  <b>Concept-first teaching</b>
                  <small>Understand before memorising.</small>
                </span>
              </div>
              <div>
                <Star />
                <span>
                  <b>Individual attention</b>
                  <small>Focused support for doubts and gaps.</small>
                </span>
              </div>
              <div>
                <CheckCircle2 />
                <span>
                  <b>Regular practice</b>
                  <small>Revision that builds retention.</small>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="classes" className="section classes-section light-block">
          <div className="container">
            <div className="section-heading">
              <div className="eyebrow">Classes &amp; Subjects</div>
              <h2>Tuition for Class 1 to Class 8</h2>
              <p>
                Comprehensive academic support with clear teaching, guided practice and a
                strong focus on fundamentals.
              </p>
            </div>

            <div className="class-row">
              {classes.map((item) => <span key={item}>{item}</span>)}
            </div>

            <div className="subject-grid">
              {subjects.map(([name, desc], index) => (
                <article className="subject-card" key={name}>
                  <span className="num">0{index + 1}</span>
                  <BookOpen />
                  <h3>{name}</h3>
                  <p>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section process-section">
          <div className="container">
            <div className="section-heading align-left">
              <div className="eyebrow">How learning works</div>
              <h2>Simple, structured and effective teaching.</h2>
            </div>

            <div className="process-grid">
              {steps.map((step, index) => (
                <div key={step} className="process-card">
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="why" className="section why-section">
          <div className="container">
            <div className="section-heading align-left">
              <div className="eyebrow">Why choose these classes?</div>
              <h2>A simple approach to better learning.</h2>
            </div>

            <div className="feature-grid">
              {highlights.map(({ icon: Icon, title, text }) => (
                <article key={title} className="feature-card">
                  <div className="feature-icon">
                    <Icon />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section pricing-section">
          <div className="container">
            <div className="section-heading">
              <div className="eyebrow">Fee Structure</div>
              <h2>Simple monthly fee plans</h2>
            </div>

            <div className="pricing-grid">
              {pricing.map(({ range, price, note }) => (
                <div key={range} className="pricing-card">
                  <span className="pricing-tag">{range}</span>
                  <h3>₹{Number(price).toLocaleString("en-IN")} / month</h3>
                  <p>{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section faq-section">
          <div className="container faq-layout">
            <div className="section-heading align-left faq-copy">
              <div className="eyebrow">Frequently asked</div>
              <h2>Everything parents usually ask before enrolling.</h2>
            </div>

            <div className="faq-list">
              {faqs.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div className={`faq-item ${isOpen ? "open" : ""}`} key={item.q}>
                    <button
                      type="button"
                      className="faq-question"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.q}</span>
                      <ChevronDown size={18} />
                    </button>
                    {isOpen && <p className="faq-answer">{item.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="container contact-grid">
            <div>
              <div className="eyebrow inverse">Contact</div>
              <h2>Looking for a reliable tutor in Lucknow?</h2>
              <p>
                Reach out to discuss your child’s learning needs and find the right support
                for school performance and confidence.
              </p>

              <div className="contact-list">
                <a href="tel:+918565912536">
                  <Phone />
                  <span>
                    <small>Phone</small>
                    <b>8565912536</b>
                  </span>
                </a>

                <a href="mailto:anishojha1512@gmail.com">
                  <span className="at">@</span>
                  <span>
                    <small>Email</small>
                    <b>anishojha1512@gmail.com</b>
                  </span>
                </a>

                <div>
                  <MapPin />
                  <span>
                    <small>Service Area</small>
                    <b>Lucknow, Uttar Pradesh</b>
                  </span>
                </div>
              </div>
            </div>

            <form className="enquiry-form" onSubmit={submit}>
              <h3>Send a tuition enquiry</h3>

              <label>
                Your Name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Parent / Student name"
                />
              </label>

              <label>
                Phone Number
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                />
              </label>

              <label>
                Student&apos;s Class
                <select
                  required
                  value={form.className}
                  onChange={(e) => setForm({ ...form, className: e.target.value })}
                >
                  <option value="">Select class</option>
                  {classes.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label>
                Address
                <textarea
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Enter your full address"
                />
              </label>

              <label>
                Message
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about the tuition requirement"
                />
              </label>

              <button type="submit" className="btn primary submit-btn">
                Submit Enquiry <ArrowRight size={18} />
              </button>

              {status && <div className="status-message">{status}</div>}
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer">
          <div>
            <b>Anish Ojha Tuition Classes</b>
            <span>Tuition Classes for Class 1–8 in Lucknow</span>
          </div>
          <div>
            <a href="tel:+918565912536">8565912536</a>
            <a href="mailto:anishojha1512@gmail.com">Email</a>
          </div>
        </div>
      </footer>

      <a
        className="whatsapp-float"
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <Phone size={20} />
      </a>
    </div>
  );
};

const RequireAdmin = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  if (loading) return <div className="admin-loading">Checking admin access...</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
};

const AdminAppShell = () => (
  <Routes>
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
    <Route path="/admin/analytics" element={<RequireAdmin><Analytics /></RequireAdmin>} />
    <Route path="/admin/enquiries" element={<RequireAdmin><Enquiries /></RequireAdmin>} />
    <Route path="*" element={<PublicWebsite />} />
  </Routes>
);

function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <AdminAppShell />
      </BrowserRouter>
    </AdminAuthProvider>
  );
}

export default App;
