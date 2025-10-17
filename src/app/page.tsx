'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faDribbble,
  faInstagram,
  faFacebookF,
} from '@fortawesome/free-brands-svg-icons';
import {
  faArrowRight,
  faHome,
  faTasks,
  faStream,
  faCommentAlt,
  faEnvelope,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const faqItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const devItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const devTrackRef = useRef<HTMLDivElement | null>(null);
  const leftSidebarRef = useRef<HTMLDivElement | null>(null);
  const bannerSectionRef = useRef<HTMLDivElement | null>(null);
  const rightNavRef = useRef<HTMLUListElement | null>(null);
  const [isRightNavVisible, setIsRightNavVisible] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeDevCard, setActiveDevCard] = useState<number>(0);

  const toggleRightNav = () => {
    setIsRightNavVisible(!isRightNavVisible);
  };

  const handleViewDetails = (propertyName: string) => {
    setSelectedProperty(propertyName);
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setSelectedProperty('');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: element, offsetY: 80 },
        ease: 'power2.inOut',
      });
    }
  };

  const handleDevCardClick = (index: number) => {
    setActiveDevCard(index);
  };

  const scrollDevSlider = (direction: 'left' | 'right') => {
    const track = devTrackRef.current;
    if (track) {
      const scrollAmount = 212; // 180px card + 32px gap
      const currentScroll = track.scrollLeft;
      const newScroll =
        direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;

      gsap.to(track, {
        scrollLeft: newScroll,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  };

  const handleFaqClick = (index: number) => {
    const faqItems = faqItemsRef.current;
    const currentItem = faqItems[index];

    if (!currentItem) return;

    const question = currentItem.querySelector('.faq-question');
    const answer = currentItem.querySelector('.faq-answer');
    const toggle = currentItem.querySelector('.faq-toggle');

    if (!question || !answer || !toggle) return;

    const isActive = currentItem.classList.contains('active');

    if (isActive) {
      // Close FAQ
      currentItem.classList.remove('active');
      gsap.to(answer, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      });
      gsap.to(toggle, {
        rotation: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    } else {
      // Close other FAQs first
      faqItems.forEach((otherItem, otherIndex) => {
        if (otherItem && otherIndex !== index) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherToggle = otherItem.querySelector('.faq-toggle');
          if (otherAnswer && otherToggle) {
            gsap.to(otherAnswer, {
              height: 0,
              opacity: 0,
              duration: 0.4,
              ease: 'power2.inOut',
            });
            gsap.to(otherToggle, {
              rotation: 0,
              duration: 0.3,
              ease: 'power2.inOut',
            });
          }
        }
      });

      // Open current FAQ
      currentItem.classList.add('active');
      gsap.to(answer, {
        height: 'auto',
        opacity: 1,
        duration: 0.4,
        ease: 'power2.inOut',
      });
      gsap.to(toggle, {
        rotation: 45,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }
  };

  useEffect(() => {
    // Initialize FAQ animations
    const faqItems = faqItemsRef.current;

    faqItems.forEach(item => {
      if (item) {
        const answer = item.querySelector('.faq-answer');
        if (answer) {
          // Set initial state
          gsap.set(answer, { height: 0, opacity: 0 });
        }
      }
    });

    // Handle sidebar visibility on scroll
    const handleScroll = () => {
      const bannerSection = bannerSectionRef.current;
      const leftSidebar = leftSidebarRef.current;

      if (bannerSection && leftSidebar) {
        const bannerBottom = bannerSection.offsetTop + bannerSection.offsetHeight;
        const scrollY = window.scrollY;
        const offset = 200; // Show sidebar 200px before banner ends

        if (scrollY > bannerBottom - offset) {
          leftSidebar.classList.add('visible');
        } else {
          leftSidebar.classList.remove('visible');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    // Section detection for active navigation
    const handleSectionScroll = () => {
      const sections = ['home', 'developers', 'locations', 'faqs', 'contact'];
      const windowHeight = window.innerHeight;

      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isInView = rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;

          if (isInView) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    window.addEventListener('scroll', handleSectionScroll);
    handleSectionScroll(); // Initial check

    // GSAP animations for sections
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

    // Animate sections on scroll
    const sections = document.querySelectorAll('.animate-section');
    sections.forEach((section, index) => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 80,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          delay: index * 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse',
            once: false,
          },
        }
      );
    });

    // Animate individual elements within sections
    const animateElements = () => {
      // Animate property cards
      gsap.fromTo(
        '.location-card',
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.locations-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate FAQ items
      gsap.fromTo(
        '.faq-item',
        {
          opacity: 0,
          x: -30,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.faq-container',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate developer cards
      gsap.fromTo(
        '.dev-card',
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'back.out(1.7)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.dev-track',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate contact form
      gsap.fromTo(
        '.contact-form-card',
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    };

    // Run animations after a short delay to ensure DOM is ready
    setTimeout(animateElements, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleSectionScroll);
    };
  }, []);

  return (
    <div className='video-background-container'>
      {/* Video Background */}
      <video className='video-background' autoPlay muted loop playsInline>
        <source src='/images/video4.mp4' type='video/mp4' />
        Your browser does not support the video tag.
      </video>

      {/* Video Overlay */}
      <div className='video-overlay'></div>

      {/* Fixed Toggle Button */}
      <button className='nav-toggle-button' onClick={toggleRightNav}>
        <div className='nav-toggle-icon'>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Banner Section */}
      <div className='banner-section animate-section' ref={bannerSectionRef} id='home'>
        <div className='banner-background'>
          <Image
            src='/images/banner-bg.png'
            alt='Banner Background'
            fill
            className='banner-image'
            priority
          />
        </div>
      </div>

      <div className='main_grid_row'>
        <div className='left-sidebar' ref={leftSidebarRef}>
          <div className='image'>
            <div className='avatar avatar-wrap'>
              <Image
                className='avatar-bg'
                src='/images/rishi_malik.png'
                alt='Avatar BG'
                width={357}
                height={400}
              />
              <Image
                className='avatar-no-bg'
                style={{ display: 'none' }}
                src='/images/rishi_malik.png'
                alt='Avatar No BG'
                width={357}
                height={400}
              />
            </div>
          </div>
          <div className='infor'>
            <h6 className='mail letter-spacing-0'>info@rishimalik.com</h6>
            <div className='text-body-2 address'>Based in Dubai, UAE</div>
          </div>
          <ul className='social-links justify-content-center'>
            <li>
              <a href='#' target='_blank'>
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </li>
            <li>
              <a href='#' target='_blank'>
                <FontAwesomeIcon icon={faDribbble} />
              </a>
            </li>
            <li>
              <a href='#' target='_blank'>
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </li>
            <li>
              <a href='#' target='_blank'>
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
            </li>
          </ul>
          <a href='#contact' className='bot-button'>
            <div className='text-body-1 text'>Get Started</div>
            <div className='icon'>
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
          </a>
        </div>
        <div className='container'>
          <div className='hero-content'>
            <div className='main-title'>
              <div className='text-body-1 dot-before subtitle'>
                ✨ Dubai&apos;s #1 Luxury Expert
              </div>
              <h1 className='title split-text effect-right'>
                Making Your World a Pain Free Experience
              </h1>
              <div className='text-body-2 text'>
                My passion lies in crafting elegant, straightforward digital experiences. <br />{' '}
                It&apos;s a love for simplicity, pure and simple
              </div>
            </div>
            <ul className='list-tags'>
              <li>
                <a className='text-body-2' href='#'>
                  <strong style={{ marginRight: '12px' }}>AED 500M+ </strong> Properties Sold
                </a>
              </li>
              <li>
                <a className='text-body-2' href='#'>
                  <strong style={{ marginRight: '12px' }}>1000+ </strong> Global Clients
                </a>
              </li>
              <li>
                <a className='text-body-2' href='#'>
                  <strong style={{ marginRight: '12px' }}> 10+</strong> Years Excellence
                </a>
              </li>
            </ul>
          </div>

          <div className='about_section'>
            <div className='text-body-1 dot-before subtitle'>✨ About</div>
            <h2>Your Trusted Guide to Dubai&apos;s Most Prestigious Properties</h2>
            <p className='text-body-2 text'>
              Rishi Malik is one of Dubai&apos;s leading real estate experts, specializing in
              ultra-luxury apartments, penthouses, and villas across the city&apos;s most iconic
              communities.
            </p>
            <p className='text-body-2 text'>
              As the CEO & Co-Founder of ACE Elite Properties, Rishi brings a wealth of market
              knowledge, negotiation expertise, and a reputation built on trust, transparency, and
              performance.
            </p>
            <p className='text-body-2 text'>
              With strong partnerships with Dubai&apos;s top developers — Emaar, Damac, Omniyat,
              Binghatti, and Ellington — Rishi offers his clients exclusive access to off-market
              opportunities and first launch inventory not available to the public.
            </p>
            <div className='cards_row'>
              <div className='card-item'>
                <h3 className='fw-medium title'>10+</h3>
                <div className='text-body-1'>Years of Real Estate Excellence </div>
              </div>
              <div className='card-item'>
                <h3 className='fw-medium title'>AED 500M+</h3>
                <div className='text-body-1'>in Property Transactions</div>
              </div>
              <div className='card-item'>
                <h3 className='fw-medium title'>1000+</h3>
                <div className='text-body-1'>Clients Served Globally</div>
              </div>
              <div className='card-item'>
                <h3 className='fw-medium title'>65570</h3>
                <div className='text-body-1'>RERA Licensed Broker - BRN </div>
              </div>
            </div>
          </div>

          {/* Developers Slider */}
          <div className='developers-section animate-section' id='developers'>
            <div className='dev-header'>
              <div className='text-body-1 dot-before subtitle'>• Developers</div>
              <h2 className='dev-title'>Official Partner with Dubai&apos;s Leading Developers</h2>
              <p className='text-body-2 text'>
                Rishi Malik&apos;s long-standing partnerships with Dubai&apos;s top developers
                ensure clients receive priority access, VIP invitations to new project launches, and
                exclusive prices before public release.
              </p>
            </div>
            <div className='dev-slider'>
              <button
                className='dev-nav prev'
                onClick={() => scrollDevSlider('left')}
                aria-label='Previous developers'
              >
                ‹
              </button>
              <div className='dev-track' ref={devTrackRef}>
                <div
                  ref={el => {
                    devItemsRef.current[1] = el;
                  }}
                  className={`dev-card ${activeDevCard === 1 ? 'active' : ''}`}
                  onClick={() => handleDevCardClick(1)}
                >
                  <Image src='/images/developers/damac.webp' alt='Damac' width={200} height={200} />
                </div>
                <div
                  ref={el => {
                    devItemsRef.current[0] = el;
                  }}
                  className={`dev-card ${activeDevCard === 0 ? 'active' : ''}`}
                  onClick={() => handleDevCardClick(0)}
                >
                  <Image src='/images/developers/emaar.png' alt='Emaar' width={200} height={200} />
                </div>
                <div
                  ref={el => {
                    devItemsRef.current[2] = el;
                  }}
                  className={`dev-card ${activeDevCard === 2 ? 'active' : ''}`}
                  onClick={() => handleDevCardClick(2)}
                >
                  <Image
                    src='/images/developers/omniyat.png'
                    alt='Omniyat'
                    width={200}
                    height={200}
                  />
                </div>
                <div
                  ref={el => {
                    devItemsRef.current[3] = el;
                  }}
                  className={`dev-card ${activeDevCard === 3 ? 'active' : ''}`}
                  onClick={() => handleDevCardClick(3)}
                >
                  <Image
                    src='/images/developers/Binghatti.webp'
                    alt='Binghatti'
                    width={200}
                    height={200}
                  />
                </div>
                <div
                  ref={el => {
                    devItemsRef.current[4] = el;
                  }}
                  className={`dev-card ${activeDevCard === 4 ? 'active' : ''}`}
                  onClick={() => handleDevCardClick(4)}
                >
                  <Image
                    src='/images/developers/Ellington.webp'
                    alt='Ellington'
                    width={200}
                    height={200}
                  />
                </div>
              </div>
              <button
                className='dev-nav next'
                onClick={() => scrollDevSlider('right')}
                aria-label='Next developers'
              >
                ›
              </button>
            </div>
          </div>

          {/* Prime Locations Section */}
          <div className='prime-locations-section animate-section' id='locations'>
            <div className='locations-header'>
              <div className='text-body-1 dot-before subtitle'>• Properties</div>
              <h2 className='locations-title'>Hand-Picked Properties Curated by Rishi Malik</h2>
              <p className='text-body-2 text'>
                Explore a selection of ready, under-construction, and off-plan properties personally
                chosen by Rishi Malik — focusing on investment growth, exclusivity, and lifestyle
                value.
              </p>
            </div>
            <div className='locations-grid'>
              <div className='location-card'>
                <div className='location-image'>
                  <Image
                    src='/images/properties/cavali.jpg'
                    alt='Cavalli Tower, Dubai Marina'
                    width={400}
                    height={300}
                  />
                </div>
                <div className='location-content'>
                  <h3 className='location-title'>Cavalli Tower, Dubai Marina</h3>
                  <p className='location-description'>Branded residences by Damac x Cavalli</p>
                  <button
                    className='enroll-button'
                    onClick={() => handleViewDetails('Cavalli Tower, Dubai Marina')}
                  >
                    View Details
                    <FontAwesomeIcon icon={faArrowRight} className='enroll-icon' />
                  </button>
                </div>
              </div>

              <div className='location-card'>
                <div className='location-image'>
                  <Image
                    src='/images/properties/one-canal.jpg'
                    alt='One Canal, Omniyat'
                    width={400}
                    height={300}
                  />
                </div>
                <div className='location-content'>
                  <h3 className='location-title'>One Canal, Omniyat</h3>
                  <p className='location-description'>
                    Limited-edition penthouses with Burj Khalifa view
                  </p>
                  <button
                    className='enroll-button'
                    onClick={() => handleViewDetails('One Canal, Omniyat')}
                  >
                    View Details
                    <FontAwesomeIcon icon={faArrowRight} className='enroll-icon' />
                  </button>
                </div>
              </div>

              <div className='location-card'>
                <div className='location-image'>
                  <Image
                    src='/images/properties/the-valley.webp'
                    alt='The Valley Villas, Emaar South'
                    width={400}
                    height={300}
                  />
                </div>
                <div className='location-content'>
                  <h3 className='location-title'>The Valley Villas, Emaar South</h3>
                  <p className='location-description'>
                    Modern family homes with post-handover plan
                  </p>
                  <button
                    className='enroll-button'
                    onClick={() => handleViewDetails('The Valley Villas, Emaar South')}
                  >
                    View Details
                    <FontAwesomeIcon icon={faArrowRight} className='enroll-icon' />
                  </button>
                </div>
              </div>

              <div className='location-card'>
                <div className='location-image'>
                  <Image
                    src='/images/properties/binghatti.webp'
                    alt='Binghatti Onyx, JVC'
                    width={400}
                    height={300}
                  />
                </div>
                <div className='location-content'>
                  <h3 className='location-title'>Binghatti Onyx, JVC</h3>
                  <p className='location-description'>Boutique design with high ROI</p>
                  <button
                    className='enroll-button'
                    onClick={() => handleViewDetails('Binghatti Onyx, JVC')}
                  >
                    View Details
                    <FontAwesomeIcon icon={faArrowRight} className='enroll-icon' />
                  </button>
                </div>
              </div>

              <div className='location-card'>
                <div className='location-image'>
                  <Image
                    src='/images/properties/cavali.jpg'
                    alt='Ellington Ocean House'
                    width={400}
                    height={300}
                  />
                </div>
                <div className='location-content'>
                  <h3 className='location-title'>Ellington Ocean House</h3>
                  <p className='location-description'>Resort-style beachfront luxury</p>
                  <button
                    className='enroll-button'
                    onClick={() => handleViewDetails('Ellington Ocean House')}
                  >
                    View Details
                    <FontAwesomeIcon icon={faArrowRight} className='enroll-icon' />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className='faq-section animate-section' id='faqs'>
            <h2>FAQ&apos;s</h2>
            <div className='faq-container'>
              <div
                ref={el => {
                  faqItemsRef.current[0] = el;
                }}
                className='faq-item active'
              >
                <div className='faq-question' onClick={() => handleFaqClick(0)}>
                  <h4>What&apos;s the Rishi Malik progress like?</h4>
                  <button className='faq-toggle'>
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                </div>
                <div className='faq-answer'>
                  <p>
                    I specialize in luxury real estate, property investment, and premium property
                    management for individuals and businesses in Dubai.
                  </p>
                </div>
              </div>

              <div
                ref={el => {
                  faqItemsRef.current[1] = el;
                }}
                className='faq-item'
              >
                <div className='faq-question' onClick={() => handleFaqClick(1)}>
                  <h4>Property delivery time estimate?</h4>
                  <button className='faq-toggle'>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <div className='faq-answer'>
                  <p>
                    Property handover typically takes 2-4 weeks after final payment, depending on
                    the developer and property type.
                  </p>
                </div>
              </div>

              <div
                ref={el => {
                  faqItemsRef.current[2] = el;
                }}
                className='faq-item'
              >
                <div className='faq-question' onClick={() => handleFaqClick(2)}>
                  <h4>What services do you offer?</h4>
                  <button className='faq-toggle'>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <div className='faq-answer'>
                  <p>
                    I offer luxury property sales, investment consulting, property management, and
                    real estate portfolio optimization.
                  </p>
                </div>
              </div>

              <div
                ref={el => {
                  faqItemsRef.current[3] = el;
                }}
                className='faq-item'
              >
                <div className='faq-question' onClick={() => handleFaqClick(3)}>
                  <h4>What if I don&apos;t like the property?</h4>
                  <button className='faq-toggle'>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <div className='faq-answer'>
                  <p>
                    We offer a 7-day viewing period and can arrange alternative properties that
                    better match your requirements.
                  </p>
                </div>
              </div>

              <div
                ref={el => {
                  faqItemsRef.current[4] = el;
                }}
                className='faq-item'
              >
                <div className='faq-question' onClick={() => handleFaqClick(4)}>
                  <h4>Are there any refunds?</h4>
                  <button className='faq-toggle'>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <div className='faq-answer'>
                  <p>
                    Refunds are available within 14 days of purchase, subject to our terms and
                    conditions.
                  </p>
                </div>
              </div>

              <div className='faq-bottom'>
                <p>Do you have any other questions?</p>
                <a href='#contact' className='faq-link'>
                  Ask me directly
                </a>
              </div>
            </div>
          </div>
          {/* Contact Section */}
          <div className='contact-section animate-section' id='contact'>
            <div className='contact-form-card'>
              <h2 className='contact-title'>
                Contact For
                <br />
                Work
              </h2>

              <div className='form-group'>
                <label htmlFor='fullName' className='form-label'>
                  Full Name
                </label>
                <input
                  type='text'
                  id='fullName'
                  placeholder='Enter your full name'
                  className='form-input'
                />
              </div>

              <div className='form-group'>
                <label htmlFor='whatsapp' className='form-label'>
                  WhatsApp Number
                </label>
                <input
                  type='tel'
                  id='whatsapp'
                  placeholder='Enter your WhatsApp number'
                  className='form-input'
                />
              </div>

              <div className='form-group'>
                <label htmlFor='email' className='form-label'>
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  placeholder='Enter your email address'
                  className='form-input'
                />
              </div>

              <div className='form-group'>
                <label htmlFor='country' className='form-label'>
                  Country of Residence
                </label>
                <input
                  type='text'
                  id='country'
                  placeholder='Enter your country of residence'
                  className='form-input'
                />
              </div>

              <div className='form-group'>
                <label htmlFor='propertyType' className='form-label'>
                  Property Type
                </label>
                <select id='propertyType' className='form-select'>
                  <option value=''>Select property type</option>
                  <option value='villa'>Villa</option>
                  <option value='apartment'>Apartment</option>
                  <option value='penthouse'>Penthouse</option>
                  <option value='townhouse'>Townhouse</option>
                  <option value='duplex'>Duplex</option>
                  <option value='studio'>Studio</option>
                  <option value='commercial'>Commercial</option>
                  <option value='land'>Land</option>
                </select>
              </div>

              <div className='form-group'>
                <label htmlFor='message' className='form-label'>
                  Message
                </label>
                <textarea
                  id='message'
                  placeholder='Tell us about your property requirements'
                  className='form-input form-textarea'
                  rows={3}
                ></textarea>
              </div>

              <div className='budget-selection'>
                <div className='budget-options'>
                  <button className='budget-button'>&lt; $1,000</button>
                  <button className='budget-button'>$1,000 - $5,000</button>
                  <button className='budget-button'>$5,000 - $10,000</button>
                  <button className='budget-button'>$10,000 - $20,000</button>
                  <button className='budget-button'>&gt; $20,000</button>
                </div>
              </div>

              <button className='get-started-button'>
                Get Started
                <FontAwesomeIcon icon={faArrowRight} className='get-started-icon' />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ul
        className={`right-nav nav-scroll ${isRightNavVisible ? 'visible' : ''}`}
        ref={rightNavRef}
      >
        <li>
          <button
            className={`scroll-to ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => scrollToSection('home')}
          >
            <FontAwesomeIcon icon={faHome} />
            <span className='tooltip text-body-3'>Home</span>
          </button>
        </li>
        <li>
          <button
            className={`scroll-to ${activeSection === 'developers' ? 'active' : ''}`}
            onClick={() => scrollToSection('developers')}
          >
            <FontAwesomeIcon icon={faTasks} />
            <span className='tooltip text-body-3'>Developers</span>
          </button>
        </li>
        <li>
          <button
            className={`scroll-to ${activeSection === 'locations' ? 'active' : ''}`}
            onClick={() => scrollToSection('locations')}
          >
            <FontAwesomeIcon icon={faStream} />
            <span className='tooltip text-body-3'>Properties</span>
          </button>
        </li>
        <li>
          <button
            className={`scroll-to ${activeSection === 'faqs' ? 'active' : ''}`}
            onClick={() => scrollToSection('faqs')}
          >
            <FontAwesomeIcon icon={faCommentAlt} />
            <span className='tooltip text-body-3'>FAQs</span>
          </button>
        </li>
        <li>
          <button
            className={`scroll-to ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={() => scrollToSection('contact')}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            <span className='tooltip text-body-3'>Contact</span>
          </button>
        </li>
      </ul>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className='contact-modal-overlay' onClick={closeContactModal}>
          <div className='contact-modal' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h2 className='modal-title'>Contact for {selectedProperty}</h2>
              <button className='modal-close' onClick={closeContactModal}>
                ×
              </button>
            </div>
            <div className='modal-content'>
              <div className='form-group'>
                <label htmlFor='modal-fullName' className='form-label'>
                  Full Name
                </label>
                <input
                  type='text'
                  id='modal-fullName'
                  placeholder='Enter your full name'
                  className='form-input'
                />
              </div>

              <div className='form-group'>
                <label htmlFor='modal-whatsapp' className='form-label'>
                  WhatsApp Number
                </label>
                <input
                  type='tel'
                  id='modal-whatsapp'
                  placeholder='Enter your WhatsApp number'
                  className='form-input'
                />
              </div>

              <div className='form-group'>
                <label htmlFor='modal-email' className='form-label'>
                  Email Address
                </label>
                <input
                  type='email'
                  id='modal-email'
                  placeholder='Enter your email address'
                  className='form-input'
                />
              </div>

              <div className='form-group'>
                <label htmlFor='modal-country' className='form-label'>
                  Country of Residence
                </label>
                <input
                  type='text'
                  id='modal-country'
                  placeholder='Enter your country of residence'
                  className='form-input'
                />
              </div>

              <div className='form-group'>
                <label htmlFor='modal-propertyType' className='form-label'>
                  Property Type
                </label>
                <select id='modal-propertyType' className='form-select'>
                  <option value=''>Select property type</option>
                  <option value='villa'>Villa</option>
                  <option value='apartment'>Apartment</option>
                  <option value='penthouse'>Penthouse</option>
                  <option value='townhouse'>Townhouse</option>
                  <option value='duplex'>Duplex</option>
                  <option value='studio'>Studio</option>
                  <option value='commercial'>Commercial</option>
                  <option value='land'>Land</option>
                </select>
              </div>

              <div className='form-group'>
                <label htmlFor='modal-message' className='form-label'>
                  Message
                </label>
                <textarea
                  id='modal-message'
                  placeholder='Tell us about your property requirements'
                  className='form-input form-textarea'
                  rows={3}
                ></textarea>
              </div>

              <div className='budget-selection'>
                <div className='budget-options'>
                  <button className='budget-button'>&lt; $1,000</button>
                  <button className='budget-button'>$1,000 - $5,000</button>
                  <button className='budget-button'>$5,000 - $10,000</button>
                  <button className='budget-button'>$10,000 - $20,000</button>
                  <button className='budget-button'>&gt; $20,000</button>
                </div>
              </div>

              <button className='get-started-button'>
                Get Started
                <FontAwesomeIcon icon={faArrowRight} className='get-started-icon' />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
