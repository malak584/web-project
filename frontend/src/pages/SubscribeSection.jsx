import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

function SubscribeSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
      subscriber_email: email,
    }, 'YOUR_PUBLIC_KEY')
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      setStatus('Thank you for subscribing! You will now receive our latest updates.');
      setEmail('');
    }, (error) => {
      console.log('FAILED...', error);
      setStatus('Failed to subscribe. Please try again later.');
    });
  };

  return (
    <section className="subscribe-section">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Subscribe</button>
      </form>
      {status && <p>{status}</p>}
    </section>
  );
}

export default SubscribeSection;
