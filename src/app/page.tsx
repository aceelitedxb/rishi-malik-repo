'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faHome,
  faTasks,
  faStream,
  faCommentAlt,
  faEnvelope,
  faNewspaper,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function Home() {
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
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          propertyInterest: selectedProperty || 'General Inquiry',
          propertyType: 'Luxury Real Estate',
          country: 'UAE',
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', phone: '', email: '', message: '' });
        // Close modal after showing success message
        if (isContactModalOpen) {
          setTimeout(() => {
            closeContactModal();
            setSubmitStatus('idle');
          }, 2000);
        }
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
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

  useEffect(() => {
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
      const sections = [
        'home',
        'developers',
        'insights',
        'testimonials',
        'blog',
        'locations',
        'contact',
      ];
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

    // Testimonials marquee toggle functionality
    const control = document.getElementById('direction-toggle');
    const marquees = document.querySelectorAll('.marquee');
    const wrapper = document.querySelector('.wrapper');

    if (control && marquees.length > 0 && wrapper) {
      control.addEventListener('click', () => {
        control.classList.toggle('toggle--vertical');
        wrapper.classList.toggle('wrapper--vertical');
        [...marquees].forEach(marquee => marquee.classList.toggle('marquee--vertical'));
      });
    }

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
                width={1000}
                height={1000}
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
            <h6 className='mail letter-spacing-0'>Mr. Rishi Malik</h6>
            <div className='text-body-2 address'>Real Estate Expert</div>
          </div>
          <ul className='social-links justify-content-center'>
            <li>
              <a
                href='https://www.instagram.com/aceeliteproperties/'
                target='_blank'
                aria-label='Instagram'
              >
                <svg
                  fill='#fff'
                  width='24'
                  height='24'
                  viewBox='-2 -2 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                  preserveAspectRatio='xMinYMin'
                >
                  <path d='M14.017 0h-8.07A5.954 5.954 0 0 0 0 5.948v8.07a5.954 5.954 0 0 0 5.948 5.947h8.07a5.954 5.954 0 0 0 5.947-5.948v-8.07A5.954 5.954 0 0 0 14.017 0zm3.94 14.017a3.94 3.94 0 0 1-3.94 3.94h-8.07a3.94 3.94 0 0 1-3.939-3.94v-8.07a3.94 3.94 0 0 1 3.94-3.939h8.07a3.94 3.94 0 0 1 3.939 3.94v8.07z'></path>
                  <path d='M9.982 4.819A5.17 5.17 0 0 0 4.82 9.982a5.17 5.17 0 0 0 5.163 5.164 5.17 5.17 0 0 0 5.164-5.164A5.17 5.17 0 0 0 9.982 4.82zm0 8.319a3.155 3.155 0 1 1 0-6.31 3.155 3.155 0 0 1 0 6.31z'></path>
                  <circle cx='15.156' cy='4.858' r='1.237'></circle>
                </svg>
              </a>
            </li>
            <li>
              <a href='https://www.youtube.com/' target='_blank' aria-label='YouTube'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path d='M23.5 6.2a3 3 0 0 0-2.1-2.1C19.7 3.5 12 3.5 12 3.5s-7.7 0-9.4.6A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.7.6 9.4.6 9.4.6s7.7 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.8 15.5v-7L15.5 12l-5.7 3.5z' />
                </svg>
              </a>
            </li>
            <li>
              <a
                href='https://www.facebook.com/people/Ace-Elite-Properties/61572930571115/'
                target='_blank'
                aria-label='Facebook'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='lucide lucide-facebook'
                  aria-hidden='true'
                >
                  <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'></path>
                </svg>
              </a>
            </li>
            <li>
              <a href='https://twitter.com/' target='_blank' aria-label='Twitter'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path d='M22.46 6c-.77.35-1.6.58-2.46.69a4.14 4.14 0 0 0 1.82-2.28 8.2 8.2 0 0 1-2.6 1 4.11 4.11 0 0 0-7 3.75A11.67 11.67 0 0 1 3.15 4.6a4.1 4.1 0 0 0 1.27 5.48 4.07 4.07 0 0 1-1.86-.52v.05a4.11 4.11 0 0 0 3.3 4.03c-.45.12-.92.18-1.4.07a4.12 4.12 0 0 0 3.84 2.85A8.24 8.24 0 0 1 2 19.54a11.63 11.63 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.54A8.36 8.36 0 0 0 24 6.5c-.83.37-1.72.63-2.64.73z' />
                </svg>
              </a>
            </li>
          </ul>
          <a
            href='#contact'
            className='bot-button'
            onClick={e => {
              e.preventDefault();
              setSelectedProperty('Consultation');
              setIsContactModalOpen(true);
            }}
          >
            <div className='text-body-1 text'>Get Started</div>
            <div className='icon'>
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
          </a>
        </div>
        <div className='container'>
          <div className='hero-content'>
            <div className='main-title'>
              <h1 className='title split-text effect-right'>
                ABOUT <span>MR. RISHI MALIK</span>
              </h1>
              <div className='text-body-2 text'>
                Rishi Malik, CEO & Co-founder of ACE Elite Properties, is a leading Dubai real
                estate expert specializing in ultra-luxury apartments, penthouses, and villas.
                Partnered with top developers like Emaar, Damac, and Omniyat, he offers clients
                exclusive access to off-market and pre-launch opportunities across the city’s most
                iconic communities.
              </div>
            </div>
            <ul className='list-tags'>
              <li>
                <a className='text-body-2' href='#'>
                  <strong style={{ marginRight: '12px' }}>30 </strong>
                  <span>Global Real Estate Exclusives</span>
                </a>
              </li>
              <li>
                <a className='text-body-2' href='#'>
                  <strong style={{ marginRight: '12px' }}>25+ </strong>
                  <span> Countries Trusted by Global </span>
                </a>
              </li>
              <li>
                <a className='text-body-2' href='#'>
                  <strong style={{ marginRight: '12px' }}>132+</strong>
                  <span>UHN Clients Served Globally</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Prime Locations Section */}
          <div className='prime-locations-section animate-section' id='locations'>
            <div className='locations-header'>
              <h2 className='locations-title'>
                BRANDED <span>LUXURY COLLECTION</span>
              </h2>
              <p className='section-summary'>
                Handpicked ultra-luxury properties from Dubai&apos;s most prestigious developers,
                offering exclusive access to off-market and pre-launch opportunities.
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
                  <h3 className='location-title'>CAVALLI TOWER</h3>
                  <p className='location-developer'>By Damac</p>
                  <div className='location-specs'>
                    <span className='bedrooms'>Unit: 1,2,3 BR</span>
                    <span className='sqft'>Size: 1250sqft</span>
                  </div>
                  <div className='location-footer'>
                    <span className='price'>Price: AED 20M</span>
                    <button
                      className='know-more-button'
                      onClick={() => handleViewDetails('Cavalli Tower, Dubai Marina')}
                    >
                      KNOW MORE
                    </button>
                  </div>
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
                  <h3 className='location-title'>ONE CANAL</h3>
                  <p className='location-developer'>By Omniyat</p>
                  <div className='location-specs'>
                    <span className='bedrooms'>Unit: 2,3,4 BR</span>
                    <span className='sqft'>Size: 1800sqft</span>
                  </div>
                  <div className='location-footer'>
                    <span className='price'>Price: AED 35M</span>
                    <button
                      className='know-more-button'
                      onClick={() => handleViewDetails('One Canal, Omniyat')}
                    >
                      KNOW MORE
                    </button>
                  </div>
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
                  <h3 className='location-title'>THE VALLEY VILLAS</h3>
                  <p className='location-developer'>By Emaar</p>
                  <div className='location-specs'>
                    <span className='bedrooms'>Unit: 3,4,5 BR</span>
                    <span className='sqft'>Size: 2500sqft</span>
                  </div>
                  <div className='location-footer'>
                    <span className='price'>Price: AED 15M</span>
                    <button
                      className='know-more-button'
                      onClick={() => handleViewDetails('The Valley Villas, Emaar South')}
                    >
                      KNOW MORE
                    </button>
                  </div>
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
                  <h3 className='location-title'>BINGHATTI ONYX</h3>
                  <p className='location-developer'>By Binghatti</p>
                  <div className='location-specs'>
                    <span className='bedrooms'>Unit: 1,2 BR</span>
                    <span className='sqft'>Size: 950sqft</span>
                  </div>
                  <div className='location-footer'>
                    <span className='price'>Price: AED 8M</span>
                    <button
                      className='know-more-button'
                      onClick={() => handleViewDetails('Binghatti Onyx, JVC')}
                    >
                      KNOW MORE
                    </button>
                  </div>
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
                  <h3 className='location-title'>ELLINGTON OCEAN HOUSE</h3>
                  <p className='location-developer'>By Ellington</p>
                  <div className='location-specs'>
                    <span className='bedrooms'>Unit: 2,3,4 BR</span>
                    <span className='sqft'>Size: 1600sqft</span>
                  </div>
                  <div className='location-footer'>
                    <span className='price'>Price: AED 25M</span>
                    <button
                      className='know-more-button'
                      onClick={() => handleViewDetails('Ellington Ocean House')}
                    >
                      KNOW MORE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Developers Slider */}
          <div className='developers-section animate-section' id='developers'>
            <div className='dev-header'>
              <h2 className='dev-title'>
                PARTNERSHIP <span>WITH TOP DEVELOPERS</span>
              </h2>
              <p className='section-summary'>
                We partner with Dubai&apos;s most prestigious developers including Emaar, Damac,
                Omniyat, Binghatti, and Ellington to bring you exclusive access to ultra-luxury
                properties and pre-launch opportunities.
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

          {/* Dubai Insights Section */}
          <div className='insights-section animate-section' id='insights'>
            <div className='insights-header'>
              <h2 className='insights-title'>
                DUBAI INSIGHTS BY <span>RISHI MALIK</span>
              </h2>
              <p className='section-summary'>
                Stay ahead of the market with exclusive weekly insights, market trends, and expert
                analysis from Dubai&apos;s premier real estate expert.
              </p>
            </div>
            <div className='insights-grid'>
              <div className='insight-card'>
                <div className='insight-image'>
                  <Image
                    src='/images/weekly-insights.jpeg'
                    alt='Weekly Insight'
                    width={400}
                    height={200}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                <div className='insight-content'>
                  <h3 className='insight-title'>WEEKLY INSIGHT</h3>
                  <button
                    className='download-button'
                    onClick={() => handleViewDetails('Weekly Insight')}
                  >
                    DOWNLOAD
                  </button>
                </div>
              </div>

              <div className='insight-card'>
                <div className='insight-image'>
                  <Image
                    src='/images/weekly-insights.jpeg'
                    alt='Weekly Insight'
                    width={400}
                    height={200}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                <div className='insight-content'>
                  <h3 className='insight-title'>WEEKLY INSIGHT</h3>
                  <button
                    className='download-button'
                    onClick={() => handleViewDetails('Weekly Insight')}
                  >
                    DOWNLOAD
                  </button>
                </div>
              </div>

              <div className='insight-card'>
                <div className='insight-image'>
                  <Image
                    src='/images/weekly-insights.jpeg'
                    alt='Weekly Insight'
                    width={400}
                    height={200}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                <div className='insight-content'>
                  <h3 className='insight-title'>WEEKLY INSIGHT</h3>
                  <button
                    className='download-button'
                    onClick={() => handleViewDetails('Weekly Insight')}
                  >
                    DOWNLOAD
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className='testimonials-section animate-section' id='testimonials'>
            <div className='testimonials-header'>
              <h2 className='testimonials-title'>
                TESTIMONIALS <span>BY INVESTORS</span>
              </h2>
              <p className='section-summary'>
                Real experiences from satisfied clients who have successfully invested in
                Dubai&apos;s ultra-luxury real estate market with our expert guidance.
              </p>
            </div>

            <button className='toggle' id='direction-toggle'>
              <span>Toggle scroll axis</span>
              <svg aria-hidden='true' viewBox='0 0 512 512' width='100'>
                <title>arrows-alt-h</title>
                <path d='M377.941 169.941V216H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.568 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296h243.882v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.568 0-33.941l-86.059-86.059c-15.119-15.12-40.971-4.412-40.971 16.97z' />
              </svg>
            </button>

            <article className='wrapper'>
              <div className='marquee'>
                <div className='marquee__group'>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;I had an amazing experience purchasing an off-plan property through
                        this platform. The team guided me through every step, provided detailed
                        insights, and ensured a smooth transaction. Highly recommended for anyone
                        looking to invest in Dubai real estate!&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>Michael R.</h4>
                        <span>Investor</span>
                      </div>
                    </div>
                  </div>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;After searching for months, I finally found the perfect villa thanks
                        to this website. The listings were up-to-date, and the agents were extremely
                        helpful. They understood my requirements and made the entire process
                        stress-free.&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>Sarah L.</h4>
                        <span>Homeowner</span>
                      </div>
                    </div>
                  </div>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;As a first-time investor in Dubai, I was unsure about the market. The
                        team not only provided great property options but also gave me valuable
                        advice on ROI and future growth potential. Their expertise made all the
                        difference!&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>James T.</h4>
                        <span>Real Estate Investor</span>
                      </div>
                    </div>
                  </div>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;From my initial inquiry to the final handover, the service was
                        top-notch. The agents were transparent, knowledgeable, and always available
                        to answer my questions. I couldn&apos;t have asked for a better experience
                        in buying my new apartment.&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>Aisha K.</h4>
                        <span>Dubai Resident</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div aria-hidden='true' className='marquee__group'>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;I had an amazing experience purchasing an off-plan property through
                        this platform. The team guided me through every step, provided detailed
                        insights, and ensured a smooth transaction. Highly recommended for anyone
                        looking to invest in Dubai real estate!&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>Michael R.</h4>
                        <span>Investor</span>
                      </div>
                    </div>
                  </div>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;After searching for months, I finally found the perfect villa thanks
                        to this website. The listings were up-to-date, and the agents were extremely
                        helpful. They understood my requirements and made the entire process
                        stress-free.&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>Sarah L.</h4>
                        <span>Homeowner</span>
                      </div>
                    </div>
                  </div>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;As a first-time investor in Dubai, I was unsure about the market. The
                        team not only provided great property options but also gave me valuable
                        advice on ROI and future growth potential. Their expertise made all the
                        difference!&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>James T.</h4>
                        <span>Real Estate Investor</span>
                      </div>
                    </div>
                  </div>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;From my initial inquiry to the final handover, the service was
                        top-notch. The agents were transparent, knowledgeable, and always available
                        to answer my questions. I couldn&apos;t have asked for a better experience
                        in buying my new apartment.&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>Aisha K.</h4>
                        <span>Dubai Resident</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='marquee marquee--reverse'>
                <div className='marquee__group'>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;I had an amazing experience purchasing an off-plan property through
                        this platform. The team guided me through every step, provided detailed
                        insights, and ensured a smooth transaction. Highly recommended for anyone
                        looking to invest in Dubai real estate!&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>Michael R.</h4>
                        <span>Investor</span>
                      </div>
                    </div>
                  </div>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;After searching for months, I finally found the perfect villa thanks
                        to this website. The listings were up-to-date, and the agents were extremely
                        helpful. They understood my requirements and made the entire process
                        stress-free.&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>Sarah L.</h4>
                        <span>Homeowner</span>
                      </div>
                    </div>
                  </div>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;As a first-time investor in Dubai, I was unsure about the market. The
                        team not only provided great property options but also gave me valuable
                        advice on ROI and future growth potential. Their expertise made all the
                        difference!&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>James T.</h4>
                        <span>Real Estate Investor</span>
                      </div>
                    </div>
                  </div>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;From my initial inquiry to the final handover, the service was
                        top-notch. The agents were transparent, knowledgeable, and always available
                        to answer my questions. I couldn&apos;t have asked for a better experience
                        in buying my new apartment.&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>Aisha K.</h4>
                        <span>Dubai Resident</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div aria-hidden='true' className='marquee__group'>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;I had an amazing experience purchasing an off-plan property through
                        this platform. The team guided me through every step, provided detailed
                        insights, and ensured a smooth transaction. Highly recommended for anyone
                        looking to invest in Dubai real estate!&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>Michael R.</h4>
                        <span>Investor</span>
                      </div>
                    </div>
                  </div>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;After searching for months, I finally found the perfect villa thanks
                        to this website. The listings were up-to-date, and the agents were extremely
                        helpful. They understood my requirements and made the entire process
                        stress-free.&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>Sarah L.</h4>
                        <span>Homeowner</span>
                      </div>
                    </div>
                  </div>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;As a first-time investor in Dubai, I was unsure about the market. The
                        team not only provided great property options but also gave me valuable
                        advice on ROI and future growth potential. Their expertise made all the
                        difference!&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>James T.</h4>
                        <span>Real Estate Investor</span>
                      </div>
                    </div>
                  </div>
                  <div className='testimonial-card'>
                    <div className='testimonial-content'>
                      <p>
                        &ldquo;From my initial inquiry to the final handover, the service was
                        top-notch. The agents were transparent, knowledgeable, and always available
                        to answer my questions. I couldn&apos;t have asked for a better experience
                        in buying my new apartment.&rdquo;
                      </p>
                      <div className='testimonial-author'>
                        <h4>Aisha K.</h4>
                        <span>Dubai Resident</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Blog Section */}
          <div className='blog-section animate-section' id='blog'>
            <div className='blog-header'>
              <h2 className='blog-title'>
                BLOGS BY <span>RISHI MALIK</span>
              </h2>
              <p className='section-summary'>
                Dive deep into Dubai&apos;s luxury real estate market with expert analysis,
                investment insights, and exclusive opportunities for discerning investors.
              </p>
            </div>
            <div className='blog-grid'>
              <div className='blog-card'>
                <div className='blog-image'>
                  <Image
                    src='/images/properties/cavali.jpg'
                    alt='Dubai Real Estate Market Trends 2024'
                    width={400}
                    height={300}
                  />
                  <div className='blog-category'>Latest</div>
                </div>
                <div className='blog-content'>
                  <div className='blog-meta'>
                    <span className='blog-date'>15 Jul, 2025</span>
                    <span className='blog-read-time'>5 min read</span>
                  </div>
                  <h3 className='blog-title-card'>
                    Dubai Real Estate Hits $7 Billion in a Week: What’s Driving the Boom?
                  </h3>
                  <p className='blog-excerpt'>
                    Dubai’s real estate sector recorded AED 25.9 billion ($7B) in weekly
                    transactions, with $2.3B in a single day. Explore what’s fueling this surge from
                    luxury deals to tokenized assets and global investor demand.
                  </p>
                  <Link
                    href='https://aceeliteproperties.com/blogs/dubai-real-estate-hits-7-billion-in-a-week-whats-driving-the-boom'
                    className='blog-read-more'
                  >
                    Read More
                    <FontAwesomeIcon icon={faArrowRight} className='blog-icon' />
                  </Link>
                </div>
              </div>

              <div className='blog-card'>
                <div className='blog-image'>
                  <Image
                    src='/images/properties/one-canal.jpg'
                    alt='Luxury Penthouses Investment Guide'
                    width={400}
                    height={300}
                  />
                  <div className='blog-category'>Investment Guide</div>
                </div>
                <div className='blog-content'>
                  <div className='blog-meta'>
                    <span className='blog-date'>02 Jul, 2025</span>
                    <span className='blog-read-time'>7 min read</span>
                  </div>
                  <h3 className='blog-title-card'>Why Invest in Dubai Real Estate?</h3>
                  <p className='blog-excerpt'>
                    Discover why global investors choose Dubai: tax-free income, high rental yields,
                    and future-ready infrastructure. Start building your real estate portfolio
                    today.
                  </p>
                  <Link
                    href='https://aceeliteproperties.com/blogs/why-invest-in-dubai-real-estate'
                    className='blog-read-more'
                  >
                    Read More
                    <FontAwesomeIcon icon={faArrowRight} className='blog-icon' />
                  </Link>
                </div>
              </div>

              <div className='blog-card'>
                <div className='blog-image'>
                  <Image
                    src='/images/properties/the-valley.webp'
                    alt='Emaar Properties Investment Strategy'
                    width={400}
                    height={300}
                  />
                  <div className='blog-category'>Developer Focus</div>
                </div>
                <div className='blog-content'>
                  <div className='blog-meta'>
                    <span className='blog-date'>28 Jul, 2025</span>
                    <span className='blog-read-time'>6 min read</span>
                  </div>
                  <h3 className='blog-title-card'>
                    Dubai Real Estate Market vs. Geopolitical Situation
                  </h3>
                  <p className='blog-excerpt'>
                    In a world constantly shaped by political and economic shifts, investors are
                    always on the lookout for safe, stable, and high-performing markets. Among the
                    few that consistently shine through uncertainty is Dubai&apos;s real estate
                    market &apos;4 a standout performer that not only weathers geopolitical storms
                    but often a standout performer that not only weathers geopolitical storms but
                    often thrives because of them.
                  </p>
                  <Link
                    href='https://aceeliteproperties.com/blogs/dubai-real-estate-market-vs-geopolitical-situation'
                    className='blog-read-more'
                  >
                    Read More
                    <FontAwesomeIcon icon={faArrowRight} className='blog-icon' />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className='contact-section animate-section' id='contact'>
            <div className='contact-form-card'>
              <h2 className='contact-title'>
                Book Your 1 ON 1 Consultation
                <br />
                <span>With Mr Rishi Malik</span>
              </h2>
              {/* Action Buttons */}
              <div className='contact-action-buttons'>
                <a
                  href="https://wa.me/+971555266579?text=Hi%20Rishi%20Malik%2C%20I'm%20interested%20in%20one%20of%20your%20property%20listings.%20Could%20you%20please%20share%20more%20details%3F"
                  aria-describedby='WhatsApp Contact'
                >
                  <button className='whatsapp-button'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M19.2 4.8A10.2 10.2 0 0 0 3.2 17l-1.4 5.3L7.2 21a10.1 10.1 0 0 0 4.8 1 10.2 10.2 0 0 0 7.2-17.3zM12 20.4a8.4 8.4 0 0 1-4.3-1.2h-.3l-3.2.7 1-3.1-.3-.3a8.4 8.4 0 1 1 7.1 4zm4.7-6.3c-.3-.1-1.5-.8-1.8-.8s-.4-.2-.5 0l-.8 1c-.1 0-.3.3-.6.2a7 7 0 0 1-2-1.3 7.7 7.7 0 0 1-1.4-1.8c-.2-.2 0-.4 0-.5l.5-.4a1.7 1.7 0 0 0 .2-.5.5.5 0 0 0 0-.4l-.8-2c-.2-.4-.4-.3-.6-.3h-.4a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-1 2A5 5 0 0 0 8 12.4a11.3 11.3 0 0 0 4.4 4 14.5 14.5 0 0 0 1.4.4 3.4 3.4 0 0 0 1.6 0 2.6 2.6 0 0 0 1.7-1 2.1 2.1 0 0 0 .2-1.3l-.5-.3z'
                      ></path>
                    </svg>
                    WhatsApp
                  </button>
                </a>
                <a href='tel:+971555266579' aria-describedby='Call Now'>
                  <button className='call-now-button'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 16 16'
                    >
                      <path d='M13.3 10.3A7.6 7.6 0 0 1 11 10a.7.7 0 0 0-.7.1l-1 1.4a10.1 10.1 0 0 1-4.6-4.6L6 5.7A.7.7 0 0 0 6 5a7.4 7.4 0 0 1-.3-2.3A.7.7 0 0 0 5 2H2.8c-.4 0-.8.2-.8.7A11.4 11.4 0 0 0 13.3 14a.7.7 0 0 0 .7-.8V11a.7.7 0 0 0-.7-.6z'></path>
                    </svg>
                    Call Now
                  </button>
                </a>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className='form-status success'>
                  <p>
                    Thank you! Your message has been sent successfully. We&apos;ll get back to you
                    soon.
                  </p>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className='form-status error'>
                  <p>
                    Sorry, there was an error sending your message. Please try again or contact us
                    directly.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Row 1: Full Name */}
                <div className='form-group'>
                  <label htmlFor='fullName' className='form-label'>
                    Full Name
                  </label>
                  <input
                    type='text'
                    id='fullName'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder='Enter your full name'
                    className='form-input'
                    required
                  />
                </div>

                {/* Row 2: Phone Number and Email */}
                <div className='form-row'>
                  <div className='form-group'>
                    <label htmlFor='phone' className='form-label'>
                      Phone Number
                    </label>
                    <input
                      type='tel'
                      id='phone'
                      name='phone'
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder='Enter your phone number'
                      className='form-input'
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='email' className='form-label'>
                      Email Address
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder='Enter your email address'
                      className='form-input'
                      required
                    />
                  </div>
                </div>

                {/* Row 3: Tell us your requirement */}
                <div className='form-group'>
                  <label htmlFor='message' className='form-label'>
                    Tell us your requirement
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder='Tell us about your property requirements'
                    className='form-input form-textarea'
                    rows={3}
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className='form-submit'>
                  <button type='submit' className='submit-button' disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <FontAwesomeIcon icon={faArrowRight} className='submit-icon' />
                  </button>
                </div>
              </form>
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
            className={`scroll-to ${activeSection === 'insights' ? 'active' : ''}`}
            onClick={() => scrollToSection('insights')}
          >
            <FontAwesomeIcon icon={faNewspaper} />
            <span className='tooltip text-body-3'>Insights</span>
          </button>
        </li>
        <li>
          <button
            className={`scroll-to ${activeSection === 'testimonials' ? 'active' : ''}`}
            onClick={() => scrollToSection('testimonials')}
          >
            <FontAwesomeIcon icon={faCommentAlt} />
            <span className='tooltip text-body-3'>Testimonials</span>
          </button>
        </li>
        <li>
          <button
            className={`scroll-to ${activeSection === 'blog' ? 'active' : ''}`}
            onClick={() => scrollToSection('blog')}
          >
            <FontAwesomeIcon icon={faNewspaper} />
            <span className='tooltip text-body-3'>Blog</span>
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
            className={`scroll-to ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={() => scrollToSection('contact')}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            <span className='tooltip text-body-3'>Contact</span>
          </button>
        </li>
      </ul>

      {/* Contact Modal */}
      {/* Footer */}
      <footer className='site-footer'>
        <nav className='footer-links'>
          <Link href='#home'>HOME</Link>
          <span className='separator'> | </span>
          <a
            href='https://aceeliteproperties.com/privacy'
            target='_blank'
            rel='noopener noreferrer'
          >
            PRIVACY POLICY
          </a>
          <span className='separator'> | </span>
          <a
            href='https://aceeliteproperties.com/privacy'
            target='_blank'
            rel='noopener noreferrer'
          >
            TERM & CONDITIONS
          </a>
        </nav>
      </footer>

      {isContactModalOpen && (
        <div className='contact-modal-overlay' onClick={closeContactModal}>
          <div className='contact-modal' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h2 className='modal-title'>Contact for {selectedProperty}</h2>
              <button className='modal-close' onClick={closeContactModal}>
                ×
              </button>
            </div>

            <div className='buttons'>
              <a
                href="https://wa.me/+971555266579?text=Hi%20Rishi%20Malik%2C%20I'm%20interested%20in%20one%20of%20your%20property%20listings.%20Could%20you%20please%20share%20more%20details%3F"
                aria-describedby='WhatsApp Contact'
              >
                <button className='whatsapp-button'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fillRule='evenodd'
                      d='M19.2 4.8A10.2 10.2 0 0 0 3.2 17l-1.4 5.3L7.2 21a10.1 10.1 0 0 0 4.8 1 10.2 10.2 0 0 0 7.2-17.3zM12 20.4a8.4 8.4 0 0 1-4.3-1.2h-.3l-3.2.7 1-3.1-.3-.3a8.4 8.4 0 1 1 7.1 4zm4.7-6.3c-.3-.1-1.5-.8-1.8-.8s-.4-.2-.5 0l-.8 1c-.1 0-.3.3-.6.2a7 7 0 0 1-2-1.3 7.7 7.7 0 0 1-1.4-1.8c-.2-.2 0-.4 0-.5l.5-.4a1.7 1.7 0 0 0 .2-.5.5.5 0 0 0 0-.4l-.8-2c-.2-.4-.4-.3-.6-.3h-.4a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-1 2A5 5 0 0 0 8 12.4a11.3 11.3 0 0 0 4.4 4 14.5 14.5 0 0 0 1.4.4 3.4 3.4 0 0 0 1.6 0 2.6 2.6 0 0 0 1.7-1 2.1 2.1 0 0 0 .2-1.3l-.5-.3z'
                    ></path>
                  </svg>
                  WhatsApp
                </button>
              </a>
              <a href='tel:+971555266579' aria-describedby='Call Now'>
                <button className='call-now-button'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                  >
                    <path d='M13.3 10.3A7.6 7.6 0 0 1 11 10a.7.7 0 0 0-.7.1l-1 1.4a10.1 10.1 0 0 1-4.6-4.6L6 5.7A.7.7 0 0 0 6 5a7.4 7.4 0 0 1-.3-2.3A.7.7 0 0 0 5 2H2.8c-.4 0-.8.2-.8.7A11.4 11.4 0 0 0 13.3 14a.7.7 0 0 0 .7-.8V11a.7.7 0 0 0-.7-.6z'></path>
                  </svg>
                  Call Now
                </button>
              </a>
            </div>
            <form onSubmit={handleSubmit} className='modal-content'>
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className='form-status success'>
                  <p>
                    Thank you! Your message has been sent successfully. We&apos;ll get back to you
                    soon.
                  </p>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className='form-status error'>
                  <p>
                    Sorry, there was an error sending your message. Please try again or contact us
                    directly.
                  </p>
                </div>
              )}

              {/* Row 1: Full Name */}
              <div className='form-group'>
                <label htmlFor='modal-fullName' className='form-label'>
                  Full Name
                </label>
                <input
                  type='text'
                  id='modal-fullName'
                  name='name'
                  placeholder='Enter your full name'
                  className='form-input'
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Row 2: Phone Number and Email */}
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='modal-phone' className='form-label'>
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    id='modal-phone'
                    name='phone'
                    placeholder='Enter your phone number'
                    className='form-input'
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='modal-email' className='form-label'>
                    Email Address
                  </label>
                  <input
                    type='email'
                    id='modal-email'
                    name='email'
                    placeholder='Enter your email address'
                    className='form-input'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Row 3: Tell us your requirement */}
              <div className='form-group'>
                <label htmlFor='modal-message' className='form-label'>
                  Tell us your requirement
                </label>
                <textarea
                  id='modal-message'
                  name='message'
                  placeholder='Tell us about your property requirements'
                  className='form-input form-textarea'
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className='contact-action-buttons'>
                <button type='submit' className='submit-button' disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <FontAwesomeIcon icon={faArrowRight} className='submit-icon' />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
