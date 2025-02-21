import React, { useRef, useEffect, useContext } from 'react';
import emailjs from '@emailjs/browser';
import { SearchContext } from './SearchContext.js';
import { SavedCoursesContext } from './SavedCoursesContext.js';

//TODO:
// 1. Style the page
// 2. Plug in data we want to send to user (probably shopping cart and courses table?) (could even have gcal functionality?)

const ContactUs = ({ setShowNavbar }) => {
  const { allCourses } = useContext(SearchContext);
  const { savedCourses, setSavedCourses } = useContext(SavedCoursesContext);

  function setCoursesFromEncoding() {
    const encoding = document.getElementById('encoding').value
    var newCourses = []
    const courseIndices = encoding.split(',')
    for(var i in courseIndices) {
      var index = parseInt(courseIndices[i])
      if(Number.isInteger(index) && index < allCourses.length && index >= 0) {
        newCourses.push(allCourses[courseIndices[i]])
      }
    }
    setSavedCourses(newCourses)
  }

  function getCoursesAsEncoding() {
    return savedCourses.map((course) => allCourses.indexOf(course))
  }

  function savedCoursesToString() {
    var output = ""
    for(var i in savedCourses) {
      output += savedCourses[i].section_listings + ", "
    }
    return output
  }

  function getEmailMessage() {
    return "Your saved courses were: " + savedCoursesToString() + ". Input this phrase to add them back to your cart: " + getCoursesAsEncoding()
  }

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

    const templateParams = {
      to_name: document.getElementById("to_name").value,
      to_email: document.getElementById("to_email").value,
      message: getEmailMessage()
    };
    emailjs
      .send(serviceID, templateID, templateParams, {
        publicKey: publicKey,
      })
      .then(
        () => {
          console.log('SUCCESS!');
          resetForm()
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };

  return (
    <div>
      <h3>Save your saved courses!</h3>
      <p>Done using our webapp for the day but don't want to remember the courses you've saved to your cart?
        No problem! You can send a code to your email corresponding to your saved courses. You can then enter this code
        to the encoding box to automatically add your saved courses to your cart!
      </p>
      <div>
      <h3>Export saved courses code:</h3>
        <form id="emailForm" ref={form} onSubmit={sendEmail}>
        <div>
          <label>Name:</label>
          <input type="text" name="to_name" id="to_name" />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="to_email" id="to_email"/>
        </div>
        <div>
          <input type="submit" value="Send"/>
        </div>
      </form>
    </div>

    <div>
      <h3>Import saved courses code:</h3>
      <label>Encoding:</label>
      <textarea name="encoding" id="encoding" />
    </div>
    <div>
      <button onClick={setCoursesFromEncoding}>Submit</button>
    </div>
  </div>
  );
};

export default ContactUs;