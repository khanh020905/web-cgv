import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

import { Armchair } from 'lucide-react';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const formatImageRef = useRef<HTMLImageElement>(null);

  const [preloaderVisible, setPreloaderVisible] = useState(true);

  // Setup Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      wheelMultiplier: 0.9,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  // Main GSAP Animations
  useGSAP(
    () => {
      // 1. Mouse/Cursor
      const onMouseMove = (e: MouseEvent) => {
        gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.18, ease: 'power3.out' });
        gsap.to(cursorTextRef.current, { x: e.clientX, y: e.clientY, duration: 0.26, ease: 'power3.out' });

        const x = (e.clientX / window.innerWidth - 0.5) * 24;
        const y = (e.clientY / window.innerHeight - 0.5) * 24;
        gsap.to('.poster-wall', { rotateY: x, rotateX: -y, duration: 0.8, ease: 'power3.out' });
      };
      window.addEventListener('mousemove', onMouseMove);

      document.querySelectorAll('[data-cursor]').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          if (cursorTextRef.current) cursorTextRef.current.textContent = (el as HTMLElement).dataset.cursor || '';
          gsap.to(cursorTextRef.current, { opacity: 1, duration: 0.2 });
          gsap.to(cursorRef.current, { scale: 1.8, duration: 0.2 });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(cursorTextRef.current, { opacity: 0, duration: 0.2 });
          gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
        });
      });

      // 3. Main Animations setup
      const ease = 'power4.out';
      const heroTl = gsap.timeline({ paused: true });
      
      heroTl
        .from('.nav', { y: -90, opacity: 0, duration: 1, ease })
        .from('.hero-kicker', { y: 40, opacity: 0, duration: 0.7, ease }, '-=0.6')
        .from(
          '.hero-title .char',
          {
            yPercent: 120,
            rotate: 10,
            opacity: 0,
            stagger: 0.014,
            duration: 0.85,
            ease,
          },
          '-=0.25'
        )
        .from('.hero-desc', { y: 44, opacity: 0, duration: 0.8, ease }, '-=0.35')
        .from('.hero-meta', { y: 32, opacity: 0, stagger: 0.08, duration: 0.7, ease }, '-=0.35')
        .from('.hero-actions .btn', { y: 26, opacity: 0, stagger: 0.12, duration: 0.65, ease }, '-=0.4')
        .from(
          '.poster',
          {
            y: 140,
            rotateY: -26,
            rotateZ: 9,
            opacity: 0,
            stagger: 0.14,
            duration: 1.05,
            ease,
          },
          '-=0.9'
        )
        .from('.ticket-slab', { x: -90, opacity: 0, duration: 0.8, ease }, '-=0.55');

      // ScrollTrigger animations setup
      gsap.to('.hero-noise-video img', {
        scale: 1,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.poster-a', { y: 130, rotateZ: 1, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.poster-b', { y: -90, rotateZ: -2, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.poster-c', { y: 80, rotateZ: -12, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.ticket-slab', { y: -110, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

      gsap.utils.toArray('.reveal').forEach((el: any) => {
        gsap.from(el, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease,
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      gsap.to('.manifesto-main img', {
        scale: 1.16,
        scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: true },
      });

      const reelTrack = document.querySelector('.reel-track') as HTMLElement;
      function getReelDistance() {
        return -(reelTrack.scrollWidth - window.innerWidth + 90);
      }
      gsap.to(reelTrack, {
        x: getReelDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: '.reel',
          start: 'top top',
          end: () => '+=' + Math.abs(getReelDistance()),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.from('.reel-card', {
        y: 120,
        opacity: 0,
        rotate: 4,
        stagger: 0.12,
        duration: 1,
        ease,
        scrollTrigger: { trigger: '.reel', start: 'top 72%' },
      });

      gsap.utils.toArray('.reel-card img').forEach((img: any) => {
        gsap.to(img, {
          scale: 1.24,
          scrollTrigger: { trigger: img, start: 'left right', end: 'right left', scrub: true, horizontal: true },
        });
      });

      gsap.from('.format-row', {
        x: 90,
        opacity: 0,
        stagger: 0.14,
        duration: 0.9,
        ease,
        scrollTrigger: { trigger: '.format-list', start: 'top 78%' },
      });

      gsap.to('.lab-screen img', {
        scale: 1.18,
        scrollTrigger: { trigger: '.format-lab', start: 'top bottom', end: 'bottom top', scrub: true },
      });

      gsap.to('.seat-map .seat.hot', {
        y: -8,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        stagger: { each: 0.05, from: 'center' },
        ease: 'power1.inOut',
      });

      gsap.from('.booking-layout', {
        scale: 0.94,
        opacity: 0,
        duration: 1,
        ease,
        scrollTrigger: { trigger: '.booking', start: 'top 75%' },
      });

      gsap.from('.footer-big', {
        y: 120,
        opacity: 0,
        duration: 1,
        ease,
        scrollTrigger: { trigger: '.footer', start: 'top 78%' },
      });

      // 2. Preloader Animation
      const loadObj = { value: 0 };
      gsap.to(loadObj, {
        value: 100,
        duration: 1.4,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (countRef.current) {
            countRef.current.textContent = String(Math.floor(loadObj.value)).padStart(2, '0');
          }
        },
        onComplete: () => {
          gsap.to(preloaderRef.current, {
            yPercent: -100,
            duration: 1,
            ease: 'power4.inOut',
            onComplete: () => {
              setPreloaderVisible(false);
            },
          });
          // start the hero animation as the preloader goes up
          setTimeout(() => heroTl.play(), 400); 
        },
      });

      return () => window.removeEventListener('mousemove', onMouseMove);
    },
    { scope: containerRef }
  );

  const formats = [
    {
      id: '01',
      title: 'IMAX',
      desc: 'Màn hình lớn, âm thanh mạnh, hợp phim bom tấn.',
      price: '180K',
      img: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=90',
    },
    {
      id: '02',
      title: '4DX',
      desc: 'Ghế chuyển động và hiệu ứng môi trường cho phim hành động.',
      price: '220K',
      img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=90',
    },
    {
      id: '03',
      title: 'Gold Class',
      desc: 'Không gian premium, ghế rộng, riêng tư và thoải mái.',
      price: '350K',
      img: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1200&q=90',
    },
  ];

  const [activeFormatIdx, setActiveFormatIdx] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleFormatEnter = (idx: number, img: string) => {
    if (idx === activeFormatIdx) return;
    setActiveFormatIdx(idx);
    gsap.to(formatImageRef.current, {
      opacity: 0,
      scale: 1.08,
      duration: 0.22,
      onComplete: () => {
        if (formatImageRef.current) {
          formatImageRef.current.src = img;
          gsap.to(formatImageRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: 'power4.out' });
        }
      },
    });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    gsap.to('.submit', { scale: 0.96, duration: 0.08, yoyo: true, repeat: 1 });
    alert('Đã nhận yêu cầu đặt vé xem phim!');
  };

  const splitLine = (text: string) =>
    text.split('').map((char, i) => {
      if (char === ' ') {
        return <span key={i} className="char" dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />
      }
      return <span key={i} className="char">{char}</span>
    });

  return (
    <div ref={containerRef}>
      <div className="grain"></div>
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-text" ref={cursorTextRef}>
        VIEW
      </div>

      {preloaderVisible && (
        <div className="preloader" ref={preloaderRef}>
          <div className="preloader-left">
            <div className="preloader-title">
              CGV <span>Signal</span>
            </div>
            <div className="eyebrow">Initializing cinema interface</div>
          </div>
          <div className="preloader-right">
            <div className="preloader-code">
              Loading movie reel / Loading seat map / Syncing trailer wall / Preparing red carpet /
              Calibrating IMAX screen / Unlocking ticket slab
            </div>
            <div className="preloader-count" id="count" ref={countRef}>
              00
            </div>
          </div>
        </div>
      )}

      <nav className="nav">
        <a href="#home" className="nav-brand" data-cursor="HOME">
          <strong>CGV</strong> <span>Cinema Vietnam</span>
        </a>
        <div className="nav-links">
          <a href="#manifesto" data-cursor="OPEN">Manifesto</a>
          <a href="#reel" data-cursor="SCROLL">Reel</a>
          <a href="#formats" data-cursor="FORMAT">Formats</a>
          <a href="#seats" data-cursor="SEATS">Seats</a>
          <a href="#booking" data-cursor="BOOK">Booking</a>
        </div>
        <div className="nav-action">
          <a href="#booking" data-cursor="BUY">Buy Ticket</a>
        </div>
      </nav>

      {/* SECTION 1 */}
      <section id="home" className="hero">
        <div className="hero-grid-bg"></div>
        <div className="hero-noise-video">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=90"
            alt="Cinema hall"
          />
        </div>
        <div className="scanner"></div>

        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow hero-kicker">CGV cinematic campaign</div>
            <h1 className="display hero-title">
              <span className="line">{splitLine('The screen')}</span>
              <span className="line">{splitLine('is alive.')}</span>
            </h1>
            <p className="desc hero-desc">
              Một landing page phim không chỉ “đẹp” mà phải có cảm giác như trailer: typo khổng lồ,
              poster wall 3D, chuyển động theo scroll và CTA đặt vé ngay trong hero.
            </p>

            <div className="hero-meta-row">
              <div className="hero-meta">
                <strong>95K</strong>
                <span>2D ticket from</span>
              </div>
              <div className="hero-meta">
                <strong>IMAX</strong>
                <span>premium screen</span>
              </div>
              <div className="hero-meta">
                <strong>4DX</strong>
                <span>motion seat</span>
              </div>
            </div>

            <div className="btn-row hero-actions">
              <a href="#reel" className="btn btn-primary" data-cursor="PLAY">
                Explore movies
              </a>
              <a href="#booking" className="btn" data-cursor="BOOK">
                Book your night
              </a>
            </div>
          </div>

          <div className="stage">
            <div className="side-vertical">MOVIE NIGHT</div>
            <div className="poster-wall">
              <div className="poster poster-a">
                <img
                  src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=90"
                  alt="Movie poster"
                />
              </div>
              <div className="poster poster-b">
                <img
                  src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=90"
                  alt="IMAX"
                />
              </div>
              <div className="poster poster-c">
                <img
                  src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1000&q=90"
                  alt="Cinema"
                />
              </div>
              <div className="poster poster-d">
                <img
                  src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1000&q=90"
                  alt="Seats"
                />
              </div>
            </div>
            <div className="ticket-slab">
              <small>Tonight deal</small>
              <strong>FROM 95K</strong>
              <span>standard 2D ticket / demo UI</span>
            </div>
          </div>
        </div>

        <div className="hero-marquee">
          <div className="marquee-track">
            CGV CINEMA · NOW SHOWING · IMAX · GOLD CLASS · POPCORN · 4DX · MOVIE NIGHT · CGV CINEMA
            · NOW SHOWING ·
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section id="manifesto" className="section manifesto">
        <div className="container manifesto-layout">
          <div className="manifesto-visual">
            <div className="manifesto-main reveal">
              <img
                src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1200&q=90"
                alt="Movie production"
              />
            </div>
            <div className="manifesto-red reveal">
              <strong>4DX</strong>
              <p>
                Ghế chuyển động, rung, gió và hiệu ứng môi trường biến phim hành động thành trải
                nghiệm vật lý.
              </p>
            </div>
          </div>
          <div className="manifesto-copy">
            <div className="eyebrow reveal">Cinema ritual</div>
            <h2 className="display reveal">Not just watching. Entering.</h2>
            <p className="desc reveal">
              UI này được dựng như một chiến dịch bán vé: không kể lể quá nhiều, mà tạo cảm giác
              “muốn đi xem ngay” bằng nhịp typography, ảnh lớn và animation có lực.
            </p>
            <div className="manifesto-lines">
              <div className="manifesto-line reveal">
                <span>01</span>
                <div>
                  <h3>Trailer-first hero</h3>
                  <p>
                    Hero dùng poster 3D, scanline, text reveal và ticket slab để tạo cảm giác điện
                    ảnh ngay từ màn đầu.
                  </p>
                </div>
              </div>
              <div className="manifesto-line reveal">
                <span>02</span>
                <div>
                  <h3>Scroll as direction</h3>
                  <p>
                    Cuộn trang không chỉ reveal mà còn điều khiển poster, horizontal reel, timeline
                    và seat map.
                  </p>
                </div>
              </div>
              <div className="manifesto-line reveal">
                <span>03</span>
                <div>
                  <h3>Conversion-focused</h3>
                  <p>
                    Giá vé, định dạng, ghế và combo được đưa vào dòng trải nghiệm thay vì để thành
                    bảng thông tin khô.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section id="reel" className="section reel">
        <div className="reel-head">
          <div>
            <div className="eyebrow reveal">Now showing</div>
            <h2 className="display reveal" style={{ fontSize: 'clamp(50px, 9vw, 140px)' }}>Scroll the reel.</h2>
          </div>
          <p className="desc reveal">
            Cuộn ngang để khám phá các siêu phẩm đang có mặt tại rạp.
          </p>
        </div>
        <div className="reel-track">
          <article className="reel-card">
            <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1000&q=90" alt="" />
            <div className="reel-meta">
              <small>2D Standard · 95K</small>
              <h3>After Dark</h3>
              <p>Suất chiếu tối, phù hợp date night hoặc nhóm bạn cuối tuần.</p>
            </div>
          </article>
          <article className="reel-card">
            <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1000&q=90" alt="" />
            <div className="reel-meta">
              <small>IMAX · 180K</small>
              <h3>Big Frame</h3>
              <p>Màn hình lớn cho bom tấn hành động, sci-fi và siêu anh hùng.</p>
            </div>
          </article>
          <article className="reel-card">
            <img src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1000&q=90" alt="" />
            <div className="reel-meta">
              <small>Couple Seat · 220K</small>
              <h3>Two Seats</h3>
              <p>Ghế đôi cho cặp đôi hoặc bạn thân muốn có không gian riêng tư hơn.</p>
            </div>
          </article>
          <article className="reel-card">
            <img src="https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=1000&q=90" alt="" />
            <div className="reel-meta">
              <small>Gold Class · 350K</small>
              <h3>Premium</h3>
              <p>Không gian cao cấp, ghế rộng, phù hợp sinh nhật hoặc dịp đặc biệt.</p>
            </div>
          </article>
          <article className="reel-card">
            <img src="https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=1000&q=90" alt="" />
            <div className="reel-meta">
              <small>Combo · 139K</small>
              <h3>Popcorn</h3>
              <p>Bắp rang, nước ngọt và snack cho một buổi xem phim trọn vẹn.</p>
            </div>
          </article>
        </div>
      </section>

      {/* SECTION 4 */}
      <section id="formats" className="section format-lab">
        <div className="container lab-layout">
          <div className="lab-screen reveal">
            <img
              ref={formatImageRef}
              src={formats[0].img}
              alt="Format screen"
            />
          </div>
          <div className="lab-copy">
            <div className="eyebrow reveal">Format lab</div>
            <h2 className="display reveal">Choose your screen.</h2>
            <p className="desc reveal">
              Hover từng định dạng để đổi màn hình preview. Section này bán cảm giác xem phim, không
              chỉ liệt kê tính năng.
            </p>
            <div className="format-list">
              {formats.map((format, idx) => (
                <div
                  key={format.id}
                  className={`format-row ${idx === activeFormatIdx ? 'active' : ''}`}
                  onMouseEnter={() => handleFormatEnter(idx, format.img)}
                >
                  <span>{format.id}</span>
                  <div>
                    <h3>{format.title}</h3>
                    <p>{format.desc}</p>
                  </div>
                  <strong>{format.price}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 */}
      <section id="seats" className="section seats">
        <div className="container">
          <div className="seat-head">
            <div className="eyebrow">Seat system</div>
            <h2 className="display">Lock the best seat.</h2>
            <p className="desc">
              Seat map tạo cảm giác đặt vé thật hơn. Các ghế hot được animate theo scroll để tăng
              nhịp tương tác.
            </p>
          </div>
          <div className="screen-shape">Cinema Screen</div>
          <div className="seat-layout">
            <div className="seat-map seat-grid">
              <div className="seat-row" style={{ marginBottom: '10px' }}>
                <div className="seat-label"></div>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="seat-label" style={{ textAlign: 'center' }}>{i + 1}</div>
                ))}
              </div>
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((rowLabel, rowIndex) => (
                <div key={rowLabel} className="seat-row">
                  <div className="seat-label">{rowLabel}</div>
                  {Array.from({ length: 12 }).map((_, i) => {
                    const seatNum = i + 1;
                    const seatId = `${rowLabel}${seatNum}`;
                    const isHot = rowIndex >= 3 && rowIndex <= 5 && seatNum >= 5 && seatNum <= 8;
                    const isSelected = selectedSeats.includes(seatId);
                    
                    return (
                      <div 
                        key={seatNum} 
                        className={`seat ${isHot ? 'hot' : ''} ${isSelected ? 'selected' : ''}`}
                        title={`Seat ${seatId}`}
                        style={{ opacity: 1, visibility: 'visible', pointerEvents: 'auto' }}
                        onClick={() => {
                          setSelectedSeats(prev => 
                            prev.includes(seatId) 
                              ? prev.filter(id => id !== seatId) 
                              : [...prev, seatId]
                          );
                        }}
                      >
                         <Armchair size={18} strokeWidth={1.5} color={isSelected ? '#000' : 'rgba(255,255,255,0.85)'} />
                      </div>
                    );
                  })}
                </div>
              ))}
              
              <div className="seat-legend" style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="seat" style={{ width: '34px', height: '34px', borderRadius: '4px' }}></div>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Standard</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="seat hot" style={{ width: '34px', height: '34px', borderRadius: '4px' }}></div>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Hot Seat</span>
                </div>
              </div>
            </div>
            <div className="seat-panel">
              <div>
                <div className="eyebrow">
                  {selectedSeats.length > 0 ? `${selectedSeats.length} Seats Selected` : 'Selected zone'}
                </div>
                <h3>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Center\nPremium'}</h3>
                <p>
                  {selectedSeats.length > 0 
                    ? 'Bạn đã chọn các vị trí ghế phía trên. Vui lòng kiểm tra lại trước khi thanh toán.'
                    : 'Vị trí trung tâm, góc nhìn cân bằng, phù hợp phim bom tấn, IMAX và những suất chiếu tối cuối tuần.'}
                </p>
              </div>
              <div className="seat-price">
                {selectedSeats.length > 0 ? `${selectedSeats.length * 95}K` : '220K'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 */}
      <section id="booking" className="section booking">
        <div className="container">
          <div className="booking-layout">
            <div className="booking-left">
              <h2>Book your movie night.</h2>
              <div className="info-box">
                <div className="info-item">
                  <strong>Rạp</strong>
                  <span>CGV Vincom, CGV Aeon, CGV Crescent Mall, CGV Đà Nẵng...</span>
                </div>
                <div className="info-item">
                  <strong>Gợi ý</strong>
                  <span>Đặt vé trước cuối tuần để giữ vị trí ghế đẹp.</span>
                </div>
                <div className="info-item">
                  <strong>Phù hợp</strong>
                  <span>Date night, đi nhóm, gia đình, sinh nhật hoặc ra mắt phim mới.</span>
                </div>
              </div>
            </div>
            <form className="booking-form" onSubmit={handleBookingSubmit}>
              <div className="eyebrow">Fast booking</div>
              <h2 className="display">Đặt vé nhanh.</h2>
              <p className="desc">
                Form demo UI. Có thể nối API đặt vé, CRM, Google Sheet hoặc backend riêng.
              </p>
              <div className="form-grid">
                <div className="field">
                  <label>Họ tên</label>
                  <input type="text" placeholder="Nguyễn Văn A" required />
                </div>
                <div className="field">
                  <label>Số điện thoại</label>
                  <input type="tel" placeholder="0900 000 000" required />
                </div>
                <div className="field">
                  <label>Ngày xem</label>
                  <input type="date" required />
                </div>
                <div className="field">
                  <label>Số vé</label>
                  <select required>
                    <option value="">Chọn số vé</option>
                    <option>1 vé</option>
                    <option>2 vé</option>
                    <option>3 - 4 vé</option>
                    <option>Trên 4 vé</option>
                  </select>
                </div>
                <div className="field">
                  <label>Định dạng</label>
                  <select required>
                    <option value="">Chọn định dạng</option>
                    <option>2D Standard</option>
                    <option>IMAX</option>
                    <option>4DX</option>
                    <option>Gold Class</option>
                  </select>
                </div>
                <div className="field">
                  <label>Combo</label>
                  <select required>
                    <option value="">Chọn combo</option>
                    <option>Không cần</option>
                    <option>Bắp + nước</option>
                    <option>Combo cặp đôi</option>
                    <option>Combo nhóm</option>
                  </select>
                </div>
                <div className="field full">
                  <label>Ghi chú</label>
                  <textarea placeholder="Tên phim, rạp muốn xem, giờ chiếu mong muốn..."></textarea>
                </div>
              </div>
              <button className="submit" type="submit">
                Gửi yêu cầu đặt vé
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer id="footer" className="section footer">
        <div className="container">
          <div className="footer-big">CGV Cinema</div>
          <div className="footer-box">
            <div>
              <h3>Concept UI</h3>
              <p>
                Landing page mẫu chủ đề CGV/phim chiếu rạp tại Việt Nam. Đây là bản concept phục vụ
                thiết kế giao diện, không phải website chính thức.
              </p>
            </div>
            <div>
              <h3>Điều hướng</h3>
              <a href="#home">Trang chủ</a>
              <a href="#manifesto">Manifesto</a>
              <a href="#reel">Movie Reel</a>
              <a href="#formats">Formats</a>
              <a href="#seats">Seat Map</a>
            </div>
            <div>
              <h3>Liên hệ mẫu</h3>
              <p>TP. Hồ Chí Minh, Việt Nam</p>
              <p>Hotline: 1900 0000</p>
              <p>Email: hello@cinema-concept.vn</p>
              <p>Instagram: @movie.night.vn</p>
            </div>
          </div>
          <div className="copyright">
            <span>© 2026 CGV Movie Landing Page Concept</span>
            <span>Designed for cinema campaign / movie booking UI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
