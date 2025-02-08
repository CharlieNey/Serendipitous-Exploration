import React, { useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// const ContactUs = ({ setShowNavbar }) => {
//     useEffect(() => {
//         setShowNavbar(true);
//     }, []);

//   return (
//     <p>Hello world!</p>
//   )
// }

const ContactUs = ({ setShowNavbar }) => {
    useEffect(() => {
      setShowNavbar(true);
    }, []);

  const serviceID = 'service_i0niisj'
  const templateID = 'template_du14a4i'
  const publicKey = 'kvJdr1eEmb0GjbfI0'

  const form = useRef();

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
    <form ref={form} onSubmit={sendEmail}>
      <label>Name</label>
      <input type="text" name="user_name" />
      <label>Email</label>
      <input type="email" name="user_email" />
      <label>Message</label>
      <textarea name="message" />
      <input type="submit" value="Send" />
    </form>
  );
};

export default ContactUs;