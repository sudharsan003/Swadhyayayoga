// index.js - interactivity for Swadhyay Yoga site

document.addEventListener('DOMContentLoaded', function(){
	// mobile nav toggle
	const navToggle = document.getElementById('nav-toggle');
	const nav = document.getElementById('nav');
	navToggle.addEventListener('click', function(){
		nav.classList.toggle('open');
		const open = nav.classList.contains('open');
		navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
	});

	// smooth scroll for internal links
	document.querySelectorAll('a[href^="#"]').forEach(link=>{
		link.addEventListener('click', function(e){
			const href = this.getAttribute('href');
			if(href.length>1 && document.querySelector(href)){
				e.preventDefault();
				document.querySelector(href).scrollIntoView({behavior:'smooth',block:'start'});
				// close mobile nav after click
				if(nav.classList.contains('open')) nav.classList.remove('open');
			}
		});
	});

	// sticky header small effect on scroll
	const header = document.getElementById('site-header');
	let lastScroll = 0;
	window.addEventListener('scroll', function(){
		const sc = window.scrollY;
		if(sc>50){
			header.classList.add('scrolled');
		} else {
			header.classList.remove('scrolled');
		}
		lastScroll = sc;
	});

	// set year in footer
	const yearEl = document.getElementById('year');
	if(yearEl) yearEl.textContent = new Date().getFullYear();

	// Typing animation for hero heading
	(function(){
		const h1 = document.querySelector('.hero-content h1');
		if(!h1) return;
		const text = 'DISCOVER INNER PEACE AND STRENGTH';
		const speed = 110; // ms per character
		// clear existing text and prepare cursor
		h1.textContent = '';
		const cursor = document.createElement('span');
		cursor.className = 'type-cursor';
		h1.appendChild(cursor);

		let i = 0;
		function type(){
			if(i < text.length){
				// insert char before cursor
				cursor.insertAdjacentText('beforebegin', text.charAt(i));
				i++;
				setTimeout(type, speed);
			} else {
				// typing complete; keep cursor blinking for a short while then remove or keep as desired
				// (keeping it for visual effect)
			}
		}
		// small delay so users see hero visuals first
		setTimeout(type, 400);
	})();

	// Testimonial left-only slider: A (0%) -> B (-100%) -> A(clone) (-200%) then reset to 0% and repeat
	(function(){
		const slider = document.getElementById('testimonial-slider');
		if(!slider) return;
		const track = slider.querySelector('.slides-track');
		const groups = Array.from(track.querySelectorAll('.group-slide'));
		if(groups.length < 2) return;

		// append clone of first group so we can slide to -200% and then snap back to 0%
		const firstGroup = groups[0];
		const clone = firstGroup.cloneNode(true);
		track.appendChild(clone);

	let index = 0; // 0 -> 1 -> 2 -> 3(clone)
	const transitionMs = 1200; // transition time 1.2s for smooth sliding
	const interval = 4000; // visible time for each group (unchanged)
		let timer = null;

		function goTo(i){
			index = i;
			track.style.transition = `transform ${transitionMs}ms cubic-bezier(0.25,0.1,0.25,1)`;
			track.style.transform = `translateX(${ -index * 100 }%)`;
		}

		function next(){
			// advance index by 1
			goTo(index + 1);
		}

		// when we reach the cloned slide (index === 2), snap back to 0 without transition
		track.addEventListener('transitionend', ()=>{
			if(index >= groups.length){
				// we've moved to the cloned first group at -200%; snap back to 0 instantly
				track.style.transition = 'none';
				index = 0;
				track.style.transform = 'translateX(0%)';
			}
		});

	function start(){ if(timer) clearInterval(timer); timer = setInterval(next, interval + transitionMs); }
		function stop(){ if(timer) clearInterval(timer); timer = null; }

		// init position
		track.style.transition = 'none';
		track.style.transform = 'translateX(0%)';
		// small delay then start
		setTimeout(()=> start(), 160);

		slider.addEventListener('mouseenter', stop);
		slider.addEventListener('mouseleave', start);
		document.addEventListener('visibilitychange', ()=>{ if(document.hidden) stop(); else start(); });

		// on resize ensure we snap to correct visual position without transition
		window.addEventListener('resize', ()=>{ track.style.transition='none'; track.style.transform = `translateX(${ -index * 100 }%)`; });
	})();

	// Scroll animations using Intersection Observer
	(function(){
		const elems = document.querySelectorAll('.animate-on-scroll');
		if(!elems.length) return;
		const baseDelay = 400; // wait 300-500ms after entering viewport
		const obs = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if(entry.isIntersecting){
					const el = entry.target;
					const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
					setTimeout(()=> el.classList.add('in-view'), baseDelay + delay);
					observer.unobserve(el);
				}
			});
		},{threshold:0.15});

		elems.forEach(el=> obs.observe(el));
	})();
});

