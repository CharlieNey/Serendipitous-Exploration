/**
 * @file EmailPage.js
 * @description Creates email page. Allows users to email information about their saved courses and load their saved courses from email codes.
 * @authors Kai, Zoey
 * @date 3/12/25
 * @reference https://www.emailjs.com/docs/examples/reactjs/
 */

import React, { useRef, useEffect, useContext } from 'react';
import emailjs from '@emailjs/browser';
import { SearchContext } from './SearchContext.js';
import { SavedCoursesContext } from './SavedCoursesContext.js';
import './EmailPage.css';

/**
* Returns the email page's layout.
* @param {function} setShowNavbar - sets whether or not the navbar is visible on a page.
* @return {html} the email page's html.
*/
const ContactUs = ({ setShowNavbar }) => {
  const { allCourses } = useContext(SearchContext);
  const { savedCourses, setSavedCourses } = useContext(SavedCoursesContext);

  /**
   * Set the navbar to show on this page.
   * @return {void}
   */
  useEffect(() => {
    setShowNavbar(true);
  }, []);

  /**
  * Uses current encoding field value to initialize a user's saved courses to the corresponding encoding.
  * @return {void}
  */
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

  /**
  * Returns a user's currently saved courses as a list of encodings.
  * @return {List} a list of encodings corresponding to a user's saved courses.
  */
  function getCoursesAsEncoding() {
    return savedCourses.map((course) => allCourses.indexOf(course))
  }

  /**
  * Returns a user's saved courses as a string.
  * @return {String} output - the string equivalent of a user's saved courses.
  */
  function savedCoursesToString() {
    var output = ""
    for(var i in savedCourses) {
      output += savedCourses[i].section_listings + ", "
    }
    return output
  }

  /**
  * Returns a message detailling a user's saved courses as a string and an encoding.
  * @return {String} a string detailling a user's saved courses as a string and an encoding
  */
  function getEmailMessage() {
    return "Your saved courses were: " + savedCoursesToString() + ". Input this phrase to add them back to your cart: " + getCoursesAsEncoding()
  }

  const serviceID = 'service_i0niisj'
  const templateID = 'template_du14a4i'
  const publicKey = 'kvJdr1eEmb0GjbfI0'

  const form = useRef();

  /**
  * Resets all fields in email form
  * @return {void}
  */
  function resetForm() {
    document.getElementById("emailForm").reset();
  }

  /**
  * Uses current email form values to create and send email using Email.js.
  * @param {Event} e - an event.
  * @return {void}
  */
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
    <div className="email-page-container">
      <h3>Save your saved courses!</h3>
      <p>
        Done using our webapp for the day but don't want to remember the courses you've saved to your cart?
        No problem! You can send a code to your email corresponding to your saved courses. You can then enter this code
        to the encoding box to automatically add your saved courses to your cart!
      </p>
      <div className="form-section">
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

      <div className="form-section">
        <h3>Import saved courses code:</h3>
        <form
          id="importForm"
          onSubmit={(e) => {
            e.preventDefault();
            setCoursesFromEncoding();
          }}
        >
          <div>
            <label>Encoding:</label>
            <textarea name="encoding" id="encoding" />
          </div>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>


    </div>
  );
  
};

export default ContactUs;