'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhone, FaUser, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import gsap from 'gsap';
import { BsFillStarFill } from 'react-icons/bs';
import { contactData } from '@/utils/constraints/constants/contacts';

type Contact = {
  name: string;
  role: string;
  image: string;
  phone: string;
};

// Tab interface
type TabItem = {
  id: string;
  label: string;
  icon: JSX.Element;
};

const tabs: TabItem[] = [
  { id: 'contacts', label: 'Team Contacts', icon: <FaUser /> },
  { id: 'venue', label: 'Venue & Location', icon: <FaMapMarkerAlt /> },
];

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
      className="bg-gradient-to-br from-[#350000] to-[#220000] rounded-lg p-6 shadow-xl relative overflow-hidden border border-yellow-200/20 hover:border-yellow-200/50 transition-all hover:shadow-yellow-200/10 hover:shadow-lg"
      whileHover={{ scale: 1.02 }}
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

// VenueSection component
const VenueSection = () => {
  const venueInfoRef = useRef<HTMLDivElement>(null);


  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="venue-section"
  >
    <div className="flex items-center gap-2 mb-6">
      <FaMapMarkerAlt className="text-yellow-300 text-xl" />
      <h2 className="text-2xl font-bold text-yellow-300 border-b-2 border-yellow-300/30 pb-1">
        Event Venue
      </h2>
    </div>
  
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div 
        ref={venueInfoRef}
        className="bg-gradient-to-br from-[#300000] to-[#1e0000] rounded-lg p-6 shadow-lg relative overflow-hidden border border-yellow-300/20 text-sm sm:text-base"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/10 rounded-bl-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-200/5 rounded-tr-full pointer-events-none"></div>
  
        <h3 className="text-xl font-bold text-yellow-300 mb-4 z-10 relative">Rabindra Bhavan</h3>
  
        <div className="space-y-4 text-yellow-100 z-10 relative">
          <p className="flex items-start gap-2">
            <FaMapMarkerAlt className="text-yellow-300 mt-1 flex-shrink-0" />
            <span> Dum Dum Rd, Surer Math, Melabagan Estate, Basak Bagan, Kolkata, West Bengal 700074</span>
          </p>
  
          <div className="pt-2">
            <h4 className="text-yellow-300 font-semibold mb-2">How to Reach:</h4>
            <ul className="list-disc pl-5 space-y-1 text-yellow-100/90">
              <li>~15 mins by cab from Sealdah Railway Station</li>
              <li>~30–35 mins from Howrah Railway Station</li>
              <li>Nearest Metro Station: Dumdum (Blue Line) – 10 mins by auto</li>
              <li>Bus Stop: Nagerbazaar Main Road</li>
              <li>App cabs and autos easily available from major transit points</li>
            </ul>
          </div>
        </div>
      </div>
  
      <div className="map-container bg-gradient-to-br from-[#300000] to-[#1e0000] rounded-lg p-4 border border-yellow-300/20 shadow-lg">
        <div className="relative w-full h-full min-h-80 overflow-hidden rounded-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full h-full"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.9289807146893!2d88.40230891116832!3d22.619127079372994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89e065aadf46d%3A0x85d163c3bac42048!2sRabindra%20Bhavan!5e0!3m2!1sen!2sin!4v1746736347010!5m2!1sen!2sin" 
              width="100%" 
              height="400" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow-md"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </div>
  </motion.div>
  
  );
};

// Main Contact Page component
const ContactPage = () => {
  const [activeTab, setActiveTab] = useState<string>('contacts');
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
          {[...Array(30)].map((_, i) => (
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

          {/* Tab Navigation */}
          <div className="flex justify-center mb-10">
            <div className="bg-[#280000] rounded-full p-1 flex space-x-1 shadow-lg shadow-black/30 border border-yellow-200/10">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-[#280000] font-medium'
                      : 'text-yellow-200/70 hover:text-yellow-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute inset-0 bg-yellow-200 rounded-full"
                      layoutId="activeTab"
                      transition={{ type: 'spring', duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab.icon}</span>
                  <span className="relative z-10">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'contacts' && (
              <motion.div
                key="contacts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {contactData.map((section, index) => (
                  <ContactSection
                    key={section.name}
                    section={section}
                    sectionIndex={index}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'venue' && (
              <motion.div
                key="venue"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VenueSection />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 text-center"
          >
            <div className="p-8 bg-gradient-to-br from-[#350000] to-[#220000] rounded-lg border border-yellow-200/20 hover:border-yellow-200/30 transition-all shadow-xl">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">
                Get In Touch
              </h2>
              <div className="flex flex-col md:flex-row justify-center gap-6 text-yellow-100">
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaEnvelope className="text-yellow-200" />
                  <a
                    href="mailto:regalia.rcciit.official@gmail.com"
                    className="hover:text-yellow-200 transition-colors"
                  >
                    regalia.rcciit.official@gmail.com
                  </a>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaUser className="text-yellow-200" />
                  <span>RCCIIT, Kolkata</span>
                </motion.div>
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