import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  

const ContactPage = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const res = await fetch(`${API_URL}/api/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Server se connect nahi ho paya! Backend chal raha hai?');
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        /* ✅ FIXED: Global reset hataya, sirf .page-bg ke andar scope kiya */
        .page-bg *, .page-bg *::before, .page-bg *::after {
          box-sizing: border-box;
        }

        .page-bg {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 120% 80% at 50% -10%, rgba(120, 60, 180, 0.85) 0%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 80% 20%, rgba(90, 40, 160, 0.5) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 20% 60%, rgba(100, 50, 170, 0.4) 0%, transparent 50%),
            linear-gradient(180deg, #1a0a2e 0%, #12082a 40%, #0d0620 100%);
        }

        .contact-hero {
          padding: 60px 24px 60px;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .contact-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 6px 18px;
          margin-bottom: 28px;
        }
        .contact-badge-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #34d399; animation: contactPulse 2s infinite;
        }
        @keyframes contactPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .contact-hero-title {
          font-size: clamp(40px, 6vw, 64px);
          font-weight: 900;
          color: white;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .contact-hero-title span {
          background: linear-gradient(90deg, #818cf8, #a78bfa, #60a5fa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .contact-slogan {
          font-size: clamp(16px, 2.5vw, 22px);
          color: rgba(255,255,255,0.7);
          font-style: italic;
          margin-bottom: 16px;
          font-weight: 500;
        }
        .contact-slogan strong {
          background: linear-gradient(90deg, #a78bfa, #60a5fa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          font-style: normal;
        }
        .contact-hero-sub { color: rgba(255,255,255,0.4); font-size: 16px; line-height: 1.6; }

        .contact-main-grid {
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px 24px 80px;
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 28px;
        }
        @media(max-width: 768px) {
          .contact-main-grid { grid-template-columns: 1fr; }
        }

        .contact-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 18px;
          padding: 20px;
          display: flex; align-items: flex-start; gap: 16px;
          transition: all 0.3s;
          cursor: pointer;
          margin-bottom: 12px;
        }
        .contact-card:hover {
          background: rgba(139,92,246,0.12);
          border-color: rgba(139,92,246,0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(139,92,246,0.2);
        }
        .contact-card-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: rgba(139,92,246,0.2);
          border: 1px solid rgba(139,92,246,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
        }
        .contact-card-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.35);
          margin-bottom: 4px;
        }
        .contact-card-value { font-size: 15px; font-weight: 600; color: white; }
        .contact-card:hover .contact-card-value { color: #c4b5fd; }
        .contact-card-sub { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 2px; }

        .contact-social-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .contact-social-btn {
          width: 42px; height: 42px; border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; cursor: pointer;
          transition: all 0.25s;
        }
        .contact-social-btn:hover { background: rgba(139,92,246,0.2); border-color: rgba(139,92,246,0.5); transform: scale(1.1); }

        .contact-form-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(139,92,246,0.18);
          border-radius: 24px;
          padding: 36px;
        }
        .contact-form-title { font-size: 22px; font-weight: 700; color: white; margin-bottom: 4px; }
        .contact-form-sub { color: rgba(255,255,255,0.35); font-size: 14px; margin-bottom: 28px; }
        .contact-field-label {
          display: block;
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.4);
          margin-bottom: 8px;
        }
        .contact-field-input {
          width: 100%; padding: 12px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: white; font-size: 14px;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s;
          outline: none;
        }
        .contact-field-input::placeholder { color: rgba(255,255,255,0.2); }
        .contact-field-input:focus {
          border-color: rgba(139,92,246,0.7);
          background: rgba(139,92,246,0.08);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
        }
        .contact-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        @media(max-width: 500px) { .contact-field-row { grid-template-columns: 1fr; } }
        .contact-field-group { margin-bottom: 16px; }
        .contact-send-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; font-weight: 700; font-size: 15px;
          border: none; border-radius: 14px; cursor: pointer;
          transition: all 0.3s;
          font-family: 'Inter', sans-serif;
          margin-top: 8px;
        }
        .contact-send-btn:hover {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(99,102,241,0.4);
        }
        .contact-success-box {
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.3);
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 12px;
          animation: contactFadeIn 0.4s ease;
        }
        @keyframes contactFadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

        .contact-footer-strip {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 24px;
          text-align: center;
        }
        .contact-footer-slogan {
          background: linear-gradient(90deg, #a78bfa, #60a5fa, #34d399);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          font-size: 18px; font-weight: 700;
        }
        .contact-footer-copy { color: rgba(255,255,255,0.25); font-size: 12px; margin-top: 6px; letter-spacing: 0.05em; }
        .contact-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 16px 0; }
        .contact-section-heading { color: white; font-size: 16px; font-weight: 700; margin-bottom: 12px; }
      `}</style>

      <div className="page-bg">

        {/* HERO */}
        <section className="contact-hero">
          <div className="contact-hero-badge">
            <div className="contact-badge-dot"></div>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>We're here to help</span>
          </div>
          <h1 className="contact-hero-title">Contact <span>Us</span></h1>
          <p className="contact-slogan">"Nothing is impossible when <strong>Tech Learn</strong> is with you"</p>
          <p className="contact-hero-sub">Have questions or feedback? Drop us a message — we'd love to hear from you.</p>
        </section>

        {/* MAIN GRID */}
        <div className="contact-main-grid">

          {/* Left — Info */}
          <div>
            <p className="contact-section-heading">📬 Reach Us</p>

            <div className="contact-card">
              <div className="contact-card-icon">📞</div>
              <div>
                <div className="contact-card-label">Phone</div>
                <div className="contact-card-value">+91 7017051229</div>
                <div className="contact-card-sub">Mon – Sat, 10am – 7pm IST</div>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon">✉️</div>
              <div>
                <div className="contact-card-label">Email</div>
                <div className="contact-card-value">techlearn@gmail.com</div>
                <div className="contact-card-sub">Reply within 24 hours</div>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon">💬</div>
              <div>
                <div className="contact-card-label">WhatsApp</div>
                <div className="contact-card-value">+91 7017051229</div>
                <div className="contact-card-sub">Quick support available</div>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon">📍</div>
              <div>
                <div className="contact-card-label">Location</div>
                <div className="contact-card-value">Tech Learn HQ</div>
                <div className="contact-card-sub">Remote</div>
              </div>
            </div>

           
          </div>

          {/* Right — Form */}
          <div className="contact-form-card">
            <div className="contact-form-title">Send a Message</div>
            <div className="contact-form-sub">Fill the form and we'll get back to you shortly.</div>

            {submitted && (
              <div className="contact-success-box">
                <span style={{ fontSize: 22 }}>🎉</span>
                <span style={{ color: '#6ee7b7', fontSize: 14, fontWeight: 500 }}>
                  Message sent! We'll reach out to you soon.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="contact-field-row">
                <div>
                  <label className="contact-field-label">Your Name</label>
                  <input className="contact-field-input" type="text" name="name"
                    value={formData.name} onChange={handleChange}
                    placeholder="Rahul Sharma" required />
                </div>
                <div>
                  <label className="contact-field-label">Email Address</label>
                  <input className="contact-field-input" type="email" name="email"
                    value={formData.email} onChange={handleChange}
                    placeholder="rahul@example.com" required />
                </div>
              </div>

              <div className="contact-field-group">
                <label className="contact-field-label">Subject</label>
                <input className="contact-field-input" type="text" name="subject"
                  value={formData.subject} onChange={handleChange}
                  placeholder="How can we help you?" required />
              </div>

              <div className="contact-field-group">
                <label className="contact-field-label">Message</label>
                <textarea className="contact-field-input" name="message"
                  value={formData.message} onChange={handleChange}
                  placeholder="Write your message here..."
                  required rows={6} style={{ resize: 'none' }} />
              </div>

              <button type="submit" className="contact-send-btn">Send Message →</button>
            </form>

            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 16 }}>
              We respect your privacy. No spam, ever.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="contact-footer-strip">
          <div className="contact-footer-slogan">"Nothing is impossible when Tech Learn is with you"</div>
          <div className="contact-footer-copy">© 2025 Tech Learn · All Rights Reserved</div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
