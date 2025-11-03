import React from "react";
import {
  FaWhatsapp,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import "./contactus.module.css";

export default function ContactUs() {
  return (
    <div className="contactPage">
      {/* Header Section */}
      <div className="header">
        <img
          src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/682779963.jpg?k=acee76c94310b53e1ba9e5af597e3a67fc5a6c7b2fc8679fa5e8dd06bff48bd8&o="
          alt="Hostel Front View"
          className="headerImage"
        />
        <div className="overlay">
          <h1 className="title">Contact Our Hostel</h1>
          <p className="subtitle">We’re here to make your stay comfortable and secure</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="main">
        {/* Left Contact Info */}
        <div className="infoSection">
          <h2 className="heading">Get in Touch</h2>
          <p className="text">
            Whether you’re checking in, booking a room, or just asking for directions,
            our team is available 24/7 to help. Reach out through any of the
            contact options below or visit us in person.
          </p>

          <div className="contactList">
            <div className="contactItem">
              <FaWhatsapp className="iconGreen" />
              <a href="https://wa.me/256700000000" target="_blank" rel="noreferrer">
                WhatsApp: +256 700 000000
              </a>
            </div>
            <div className="contactItem">
              <FaPhoneAlt className="iconBlue" />
              <p>Call: +256 780 123456</p>
            </div>
            <div className="contactItem">
              <FaEnvelope className="iconRed" />
              <p>Email: info@hostelconnect.ug</p>
            </div>
            <div className="contactItem">
              <FaMapMarkerAlt className="iconBlue" />
              <p>Kikoni, Makerere — Kampala, Uganda</p>
            </div>
          </div>

          <div className="socials">
            <a href="#" className="socialIcon facebook">
              <FaFacebook />
            </a>
            <a href="#" className="socialIcon instagram">
              <FaInstagram />
            </a>
            <a href="#" className="socialIcon twitter">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Map Section */}
        <div className="mapWrapper">
          <h2 className="mapHeading">Find Us on Map</h2>
          <div className="mapContainer">
            <iframe
              title="Hostel Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.745597194307!2d32.56494127370464!3d0.3305339996765335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb37c08f6db3%3A0x1d8a3f10fffa12b3!2sMakerere%20University!5e0!3m2!1sen!2sug!4v1705668916484!5m2!1sen!2sug"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom">
        <img
          src="https://businessfocus.co.ug/wp-content/uploads/2022/02/Olympia-hostel.png"
          alt="Inside View"
          className="bottomImage"
        />
        <p className="footerText">
          Visit us today and experience the best student hostel in Kampala!
        </p>
      </div>
    </div>
  );
}
