import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode,
  faChartLine,
  faComments,
  faMobileAlt,
  faBriefcase,
  faDollarSign,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter as faTwitterBrand, faLinkedinIn, faInstagram as faInstagramBrand } from '@fortawesome/free-brands-svg-icons';
import Logo from "../components/Logo";
import "../assets/css/Landing.css";

const jobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    salary: "$90,000 - $120,000",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
    description: "Looking for an experienced software engineer to join our team."
  },
  {
    id: 2,
    title: "HR Manager",
    salary: "$70,000 - $90,000",
    skills: ["Recruitment", "Employee Relations", "HR Policies"],
    description: "Seeking an HR professional to lead our human resources department."
  },
  {
    id: 3,
    title: "Project Manager",
    salary: "$80,000 - $100,000",
    skills: ["Agile", "Scrum", "Project Planning"],
    description: "Experienced project manager needed for our development team."
  }
];

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <header className="header">
        <nav className="navbar">
          <Link to="/" className="logo">
            <Logo />
          </Link>
          <ul className="nav-links">
            <li><a href="#home" className="nav-link">Home</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#jobs" className="nav-link">Jobs</a></li>
            <li><a href="#team" className="nav-link">Team</a></li>
            <li><a href="#portfolio" className="nav-link">Portfolio</a></li>
            <li><a href="#blog" className="nav-link">Blog</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
            <li><Link to="/login" className="btn btn-outline">Login</Link></li>
            <li><Link to="/signup" className="btn btn-primary">Sign Up</Link></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Company</h1>
          <p>Your gateway to great opportunities.</p>
          <div className="hero-buttons">
            <a href="#jobs" className="btn btn-primary">View Jobs</a>
            <Link to="/login" className="btn btn-outline">Learn More</Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <h2>Our Story</h2>
          <p>
            Founded in 2024, we've grown from a small startup to a leading technology company. 
            Our journey has been driven by a passion for innovation and a commitment to excellence.
          </p>
          <div className="stats">
            <div className="stat-item">
              <span className="number">100+</span>
              <span className="label">Projects Completed</span>
            </div>
            <div className="stat-item">
              <span className="number">50+</span>
              <span className="label">Team Members</span>
            </div>
            <div className="stat-item">
              <span className="number">24/7</span>
              <span className="label">Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <FontAwesomeIcon icon={faCode} className="service-icon" />
            <h3>Web Development</h3>
            <p>Custom web solutions for your business needs</p>
          </div>
          <div className="service-card">
            <FontAwesomeIcon icon={faMobileAlt} className="service-icon" />
            <h3>Mobile Apps</h3>
            <p>Native and cross-platform mobile applications</p>
          </div>
          <div className="service-card">
            <FontAwesomeIcon icon={faChartLine} className="service-icon" />
            <h3>Digital Marketing</h3>
            <p>Strategic marketing solutions for growth</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team-section">
        <h2 className="section-title">Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <h3>Malak Khalfallah</h3>
            <p className="position">Project Manager</p>
          </div>
          <div className="team-member">
            <h3>Rania Ammar</h3>
            <p className="position">CTO</p>
          </div>
          <div className="team-member">
            <h3>Lina Ben Salah</h3>
            <p className="position">Lead Developer</p>
          </div>
          <div className="team-member">
            <h3>Nada Bakir</h3>
            <p className="position">Marketing Director</p>
          </div>
          <div className="team-member">
            <h3>Meriem Krifa</h3>
            <p className="position">UX Designer</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <h2 className="section-title">Client Testimonials</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-content">
              "Working with this team has been an absolute pleasure. Their expertise and dedication are unmatched."
            </p>
            <div className="testimonial-author">
              <div>
                <h4>Sarah Williams</h4>
                <p>CEO, TechCorp</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-content">
              "The results exceeded our expectations. We've seen significant growth since partnering with them."
            </p>
            <div className="testimonial-author">
              <div>
                <h4>David Brown</h4>
                <p>Marketing Director, Innovate Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="portfolio-section">
        <h2 className="section-title">Our Work</h2>
        <div className="portfolio-grid">
          <div className="portfolio-item">
            <img src="/images/portfolio1.jpg" alt="Project 1" />
            <div className="portfolio-overlay">
              <h3>E-commerce Platform</h3>
              <p>Custom shopping experience</p>
            </div>
          </div>
          <div className="portfolio-item">
            <img src="/images/portfolio2.jpg" alt="Project 2" />
            <div className="portfolio-overlay">
              <h3>Mobile App</h3>
              <p>Fitness tracking application</p>
            </div>
          </div>
          <div className="portfolio-item">
            <img src="/images/portfolio3.jpg" alt="Project 3" />
            <div className="portfolio-overlay">
              <h3>Web Platform</h3>
              <p>Enterprise solution</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="blog-section">
        <h2 className="section-title">Latest News</h2>
        <div className="blog-grid">
          <div className="blog-card">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="AI in HR" />
            <div className="blog-content">
              <p className="blog-date">March 15, 2024</p>
              <h3>AI Revolution in HR Management</h3>
              <p>Discover how artificial intelligence is transforming recruitment, employee engagement, and workforce analytics in modern HR departments.</p>
            </div>
          </div>
          <div className="blog-card">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Remote Work" />
            <div className="blog-content">
              <p className="blog-date">March 10, 2024</p>
              <h3>Remote Work Best Practices</h3>
              <p>Learn about the latest strategies for managing remote teams effectively and maintaining productivity in a distributed workforce.</p>
            </div>
          </div>
          <div className="blog-card">
            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" alt="Employee Wellness" />
            <div className="blog-content">
              <p className="blog-date">March 5, 2024</p>
              <h3>Employee Wellness Programs</h3>
              <p>Explore innovative approaches to employee wellness and how they contribute to increased productivity and job satisfaction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Stay updated with our latest news and offers</p>
        <form className="newsletter-form">
          <input type="email" className="newsletter-input" placeholder="Enter your email" />
          <button type="submit" className="btn btn-primary">Subscribe</button>
        </form>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2 className="section-title">Contact Us</h2>
        <form className="contact-form">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" />

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" rows="4" />

          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </section>

      {/* Live Chat Button */}
      <button className="chat-button" aria-label="Open live chat">
        <FontAwesomeIcon icon={faComments} />
      </button>

      {/* Jobs Section */}
      <section id="jobs" className="jobs-section">
        <div className="container">
          <h2 className="section-title">Available Positions</h2>
          <div className="jobs-grid">
            {jobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <div className="job-salary">
                    <FontAwesomeIcon icon={faDollarSign} />
                    <span>{job.salary}</span>
                  </div>
                </div>
                <p className="job-description">{job.description}</p>
                <div className="job-skills">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <div className="skills-list">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                <Link to={`/apply/${job.id}`} className="btn btn-primary apply-button">
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <h3>Quick Links</h3>
            <a href="#home" className="footer-link">Home</a>
            <a href="#about" className="footer-link">About</a>
            <a href="#services" className="footer-link">Services</a>
            <a href="#portfolio" className="footer-link">Portfolio</a>
            <a href="#blog" className="footer-link">Blog</a>
            <a href="#contact" className="footer-link">Contact</a>
          </div>
          <div className="footer-links">
            <h3>Legal</h3>
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="/cookies" className="footer-link">Cookie Policy</a>
          </div>
          <div className="social-links">
            <h3>Follow Us</h3>
            <button className="social-link" aria-label="Visit our Facebook page">
              <FontAwesomeIcon icon={faFacebookF} />
            </button>
            <button className="social-link" aria-label="Visit our Twitter page">
              <FontAwesomeIcon icon={faTwitterBrand} />
            </button>
            <button className="social-link" aria-label="Visit our LinkedIn page">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </button>
            <button className="social-link" aria-label="Visit our Instagram page">
              <FontAwesomeIcon icon={faInstagramBrand} />
            </button>
          </div>
          <div className="copyright">
            <p>&copy; 2024 Company Name. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
