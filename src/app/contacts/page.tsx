'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaUser, FaEnvelope } from 'react-icons/fa';
import gsap from 'gsap';
import { BsFillStarFill } from 'react-icons/bs';
import Head from 'next/head';
import { contactData } from '@/utils/constraints/constants/contacts';

type Contact = {
  name: string;
  role: string;
  image: string;
  phone: string;
};

const ContactCard = ({
  contact,
  index,
}: {
  contact: Contact;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gradient-to-br from-[#350000] to-[#220000] rounded-lg p-6 shadow-xl relative overflow-hidden border border-yellow-200/20 hover:border-yellow-200/50 transition-all"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-200/10 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-yellow-200/5 rounded-tr-full"></div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-200 shadow-lg shadow-yellow-200/20">
          <img
            src={contact.image}
            alt={contact.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#220000]/50 to-transparent"></div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-yellow-200 mb-1">
            {contact.name}
          </h3>
          <p className="text-yellow-100/80 text-sm mb-2">{contact.role}</p>

          <div className="flex items-center justify-center md:justify-start gap-1 text-yellow-200/90">
            <FaPhone className="text-yellow-200" />
            <a
              href={`tel:${contact.phone}`}
              className="ml-1 hover:text-yellow-200 transition-colors"
            >
              {contact.phone}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ContactSection component
type Section = {
  name: string;
  contacts: Contact[];
};

const ContactSection = ({
  section,
  sectionIndex,
}: {
  section: Section;
  sectionIndex: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: sectionIndex * 0.2 }}
      className="mb-12"
    >
      <div className="flex items-center gap-2 mb-6">
        <BsFillStarFill className="text-yellow-200 text-xl" />
        <h2 className="text-2xl font-bold text-yellow-200 border-b-2 border-yellow-200/30 pb-1">
          {section.name}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {section.contacts.map((contact, index) => (
          <ContactCard key={contact.name} contact={contact} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

// Main Contact Page component
const ContactPage = () => {
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create floating decorative elements animation
    const decorElements =
      decorRef && decorRef?.current?.querySelectorAll('.decor-element');

    decorElements?.forEach((el) => {
      const randomX = Math.random() * 40 - 20;
      const randomY = Math.random() * 40 - 20;
      const randomDelay = Math.random() * 2;
      const randomTime = 3 + Math.random() * 2;

      gsap.to(el, {
        x: randomX,
        y: randomY,
        rotation: '+=30',
        duration: randomTime,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: randomDelay,
      });
    });
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#220000] text-white py-16 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div ref={decorRef} className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="decor-element absolute opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${10 + Math.random() * 30}px`,
                height: `${10 + Math.random() * 30}px`,
                background: i % 2 === 0 ? '#fde68a' : 'transparent',
                border: i % 2 !== 0 ? '1px solid #fde68a' : 'none',
                borderRadius: i % 3 === 0 ? '50%' : '0%',
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            ></div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto mt-20 font-cogley">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 text-yellow-200">
              Contact Us
            </h1>
            <div className="w-24 h-1 bg-yellow-200 mx-auto mb-6"></div>
            <p className="text-lg max-w-2xl mx-auto text-yellow-100/80">
              Need information about Regalia? Contact our team members below for
              any queries regarding events, sponsorships, or general
              information.
            </p>
          </motion.div>

          {contactData.map((section, index) => (
            <ContactSection
              key={section.name}
              section={section}
              sectionIndex={index}
            />
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 text-center"
          >
            <div className="p-8 bg-gradient-to-br from-[#350000] to-[#220000] rounded-lg border border-yellow-200/20">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">
                Get In Touch
              </h2>
              <div className="flex flex-col md:flex-row justify-center gap-6 text-yellow-100">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-yellow-200" />
                  <a
                    href="mailto:info@regaliafest.com"
                    className="hover:text-yellow-200 transition-colors"
                  >
                    info@regaliafest.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-yellow-200" />
                  <span>RCCIIT, Kolkata</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom decorative gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#120000] to-transparent pointer-events-none"></div>
      </div>
    </>
  );
};

export default ContactPage;
