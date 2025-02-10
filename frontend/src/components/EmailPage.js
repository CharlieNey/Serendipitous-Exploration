import React, { useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';

//TODO:
// 1. Style the page
// 2. Plug in data we want to send to user (probably shopping cart and courses table?) (could even have gcal functionality?)

const ContactUs = ({ setShowNavbar }) => {
    useEffect(() => {
      setShowNavbar(true);
    }, []);

  const serviceID = 'service_i0niisj'
  const templateID = 'template_du14a4i'
  const publicKey = 'kvJdr1eEmb0GjbfI0'

  const form = useRef();

  function resetForm() {
    document.getElementById("emailForm").reset();
  }

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(serviceID, templateID, form.current, {
        publicKey: publicKey,
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };

  return (
    <form id="emailForm" ref={form} onSubmit={sendEmail}>
      <label>Name</label>
      <input type="text" name="to_name" />
      <label>Email</label>
      <input type="email" name="to_email" />
      <label>Message</label>
      <textarea name="message" />
      <input type="submit" onClick={() => resetForm()} value="Send"/>
    </form>
  );
};

export default ContactUs;