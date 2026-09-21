//#region src/js/animation/avatar.js
var avatar = { init() {
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
	gsap.registerPlugin(ScrollTrigger);
	document.querySelectorAll("[data-ns-avatar]").forEach((el) => {
		const delay = el.dataset.avatarDelay ? Number.parseFloat(el.dataset.avatarDelay) : 0;
		const direction = el.dataset.avatarDirection || "left";
		const scale = el.dataset.avatarScale ? Number.parseFloat(el.dataset.avatarScale) : 0;
		const offset = el.dataset.avatarOffset ? Number.parseFloat(el.dataset.avatarOffset) : 0;
		el.style.opacity = "1";
		const animationProps = {
			duration: 1.5,
			opacity: 0,
			scale,
			filter: "blur(5px)",
			delay,
			ease: "elastic.out(1, 0.7)",
			scrollTrigger: {
				trigger: el,
				start: "top 90%",
				end: "bottom 20%"
			}
		};
		switch (direction) {
			case "left":
				animationProps.x = -offset;
				break;
			case "right":
				animationProps.x = offset;
				break;
			case "down":
				animationProps.y = offset;
				break;
			default: animationProps.y = -offset;
		}
		gsap.from(el, animationProps);
	});
} };
document.addEventListener("DOMContentLoaded", () => {
	avatar.init();
});
//#endregion
//#region src/js/animation/border-expand.js
var borderExpand = { init() {
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
	gsap.registerPlugin(ScrollTrigger);
	document.querySelectorAll("[data-border-expand]").forEach((element) => {
		const delay = element.dataset.delay ? Number.parseFloat(element.dataset.delay) : 0;
		const top = element.dataset.top || "top 100%";
		const markerId = element.dataset.markerId || false;
		const duration = element.dataset.duration ? Number.parseFloat(element.dataset.duration) : 1.6;
		gsap.set(element, {
			scaleX: 0,
			transformOrigin: "center center"
		});
		gsap.to(element, {
			scaleX: 1,
			duration,
			ease: "power3.out",
			delay,
			scrollTrigger: {
				trigger: element,
				start: top,
				end: "top 100%",
				toggleActions: "play none none none",
				markers: Boolean(markerId),
				id: markerId || void 0
			}
		});
	});
} };
document.addEventListener("DOMContentLoaded", () => {
	borderExpand.init();
});
//#endregion
//#region src/js/animation/counter-number-on-scroll.js
var initCounterNumberOnScroll = () => {
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
	gsap.registerPlugin(ScrollTrigger);
	document.querySelectorAll("[data-counter-trigger]").forEach((counterTrigger) => {
		const counterFlow = counterTrigger.querySelector("[data-counter-number]");
		const counterValue = Number(counterTrigger.dataset.counterValue) || 0;
		const counterDuration = Number(counterTrigger.dataset.counterDuration) || 1.8;
		const counterFractionDigits = Number(counterTrigger.dataset.counterFractionDigits) || 0;
		if (!counterFlow || typeof counterFlow.update !== "function") return;
		const isInstant = "instant" in counterTrigger.dataset && counterTrigger.dataset.instant !== "false";
		counterFlow.trend = 0;
		counterFlow.format = {
			useGrouping: counterTrigger.dataset.counterUseGrouping !== "false",
			maximumFractionDigits: counterFractionDigits,
			minimumFractionDigits: counterFractionDigits
		};
		counterFlow.update(0);
		const playCounter = () => {
			counterFlow.transformTiming = {
				duration: counterDuration * 1e3,
				easing: "ease-out"
			};
			counterFlow.spinTiming = {
				duration: counterDuration * 1e3,
				easing: "ease-out"
			};
			counterFlow.opacityTiming = {
				duration: Math.max(250, counterDuration * 450),
				easing: "ease-out"
			};
			counterFlow.update(counterValue);
		};
		if (isInstant) {
			playCounter();
			return;
		}
		ScrollTrigger.create({
			trigger: counterTrigger,
			start: "top 90%",
			once: true,
			onEnter: playCounter
		});
	});
};
document.addEventListener("DOMContentLoaded", () => {
	initCounterNumberOnScroll();
});
//#endregion
//#region src/js/animation/cta.js
var initCta = () => {
	const ctaImg1 = document.querySelector("[data-cta-img-1]");
	const ctaImg2 = document.querySelector("[data-cta-img-2]");
	if (!ctaImg1 || !ctaImg2) return;
	const tl = gsap.timeline({ scrollTrigger: {
		trigger: "[data-cta-img-1]",
		start: "top 85%",
		end: "bottom 50%"
	} });
	tl.from(ctaImg1, {
		translateX: 500,
		scale: 0,
		rotate: 40,
		duration: .7,
		ease: "CustomEase.create(\"custom\", \"M0,0 C0.5,0 0.581,0.047 0.625,0.073 0.72,0.13 0.9,0.23 1,1 \")"
	});
	tl.from(ctaImg2, {
		translateX: -500,
		scale: 0,
		rotate: -40,
		duration: .8,
		ease: "CustomEase.create(\"custom\", \"M0,0 C0.5,0 0.581,0.047 0.625,0.073 0.72,0.13 0.9,0.23 1,1 \")"
	}, "-=0.5");
};
document.addEventListener("DOMContentLoaded", initCta);
//#endregion
//#region src/js/animation/faq-accordion.js
var initFaqAccordion = () => {
	const accordions = document.querySelectorAll("[data-faq-accordion]");
	if (!accordions.length) return;
	const hasGsap = typeof gsap !== "undefined";
	const hasSplitText = typeof SplitText !== "undefined";
	const hasCustomEase = typeof CustomEase !== "undefined";
	if (hasGsap && hasSplitText) gsap.registerPlugin(SplitText);
	if (hasGsap && hasCustomEase) {
		gsap.registerPlugin(CustomEase);
		CustomEase.create("faq-ease", "0.625, 0.05, 0, 1");
	}
	const textEase = "power3.out";
	const heightEase = hasCustomEase ? "faq-ease" : "power2.out";
	const setExpand = (item, action, content, icon, text, expanded) => {
		const value = expanded ? "true" : "false";
		item.dataset.expend = value;
		action.dataset.expend = value;
		content.dataset.expend = value;
		if (icon) icon.dataset.expend = value;
		if (text) text.dataset.expend = value;
		action.setAttribute("aria-expanded", value);
	};
	const getParts = (item) => ({
		button: item.querySelector("[data-faq-action]"),
		content: item.querySelector("[data-faq-content]"),
		icon: item.querySelector("[data-faq-icon]"),
		text: item.querySelector("[data-faq-text-reveal]")
	});
	const getLines = (text) => {
		const lines = text?._faqSplit?.lines;
		return lines?.length ? [...lines] : [];
	};
	const setupTextSplit = (text) => {
		if (!text || text._faqSplit || !hasSplitText) return;
		text._faqSplit = SplitText.create(text, {
			type: "lines",
			mask: "lines",
			linesClass: "line"
		});
	};
	const showFaqText = (text) => {
		if (!text?._faqSplit || !hasGsap) return;
		const lines = getLines(text);
		if (!lines.length) return;
		text._faqTween?.kill();
		gsap.set(lines, { yPercent: 0 });
	};
	const prepareItemText = (content, text) => {
		if (!text) return;
		content.style.height = "auto";
		setupTextSplit(text);
		const lines = getLines(text);
		if (hasGsap && lines.length) gsap.set(lines, { yPercent: 110 });
		content.style.height = "0px";
	};
	const hideFaqText = (text) => {
		if (!text?._faqSplit || !hasGsap) return;
		const lines = getLines(text);
		text._faqTween?.kill();
		gsap.set(lines, { yPercent: 110 });
	};
	const revealFaqText = (text) => {
		if (!text?._faqSplit || !hasGsap) return;
		const lines = getLines(text);
		if (!lines.length) return;
		text._faqTween?.kill();
		text._faqTween = gsap.fromTo(lines, { yPercent: 110 }, {
			yPercent: 0,
			duration: .65,
			stagger: .06,
			ease: textEase
		});
	};
	const measureContentHeight = (content, text) => {
		hideFaqText(text);
		gsap.set(content, { height: "auto" });
		const height = content.offsetHeight;
		gsap.set(content, { height: 0 });
		return height;
	};
	const openItem = (item, action, content, icon, text) => {
		content._faqTimeline?.kill();
		setExpand(item, action, content, icon, text, true);
		const targetHeight = measureContentHeight(content, text);
		content._faqTimeline = gsap.timeline({ onComplete: () => {
			content.style.height = "auto";
		} }).to(content, {
			height: targetHeight,
			duration: .6,
			ease: heightEase
		}).add(() => revealFaqText(text), .08);
	};
	const closeItem = (item, action, content, icon, text) => {
		content._faqTimeline?.kill();
		hideFaqText(text);
		setExpand(item, action, content, icon, text, false);
		content.style.height = `${content.offsetHeight}px`;
		content._faqTimeline = gsap.to(content, {
			height: 0,
			duration: .6,
			ease: heightEase,
			onComplete: () => {
				content.style.height = "0px";
			}
		});
	};
	const handleClick = (item, action, content, icon, text, items) => {
		if (item.dataset.expend === "true") {
			closeItem(item, action, content, icon, text);
			return;
		}
		items.forEach((other) => {
			if (other.dataset.expend !== "true") return;
			const parts = getParts(other);
			if (parts.button && parts.content) closeItem(other, parts.button, parts.content, parts.icon, parts.text);
		});
		openItem(item, action, content, icon, text);
	};
	accordions.forEach((accordion) => {
		const items = [...accordion.querySelectorAll("[data-faq-item]")];
		items.forEach((item) => {
			const { button: action, content, icon, text } = getParts(item);
			if (!action || !content) return;
			const isDefaultOpen = item.dataset.defaultOpen === "true";
			prepareItemText(content, text);
			if (isDefaultOpen) {
				setExpand(item, action, content, icon, text, true);
				content.style.height = "auto";
				showFaqText(text);
			} else {
				setExpand(item, action, content, icon, text, false);
				content.style.height = "0px";
			}
		});
		accordion.addEventListener("click", (event) => {
			const action = event.target.closest("[data-faq-action]");
			if (!action || !accordion.contains(action)) return;
			const item = action.closest("[data-faq-item]");
			if (!item || !accordion.contains(item)) return;
			const { button, content, icon, text } = getParts(item);
			if (!button || !content || button !== action) return;
			handleClick(item, button, content, icon, text, items);
		});
	});
};
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => {
	document.fonts.ready.then(initFaqAccordion);
});
else document.fonts.ready.then(initFaqAccordion);
//#endregion
//#region src/js/animation/header-nav-tabs.js
var initNavTabs = () => {
	if (typeof gsap === "undefined") return;
	if (typeof CustomEase !== "undefined") {
		gsap.registerPlugin(CustomEase);
		CustomEase.create("bouncy-ease", "0.34, 1.42, 0.64, 1");
	}
	const bouncyEase = typeof CustomEase === "undefined" ? "power2.out" : "bouncy-ease";
	const nav = document.querySelector("[data-nav-tabs]");
	const indicator = nav?.querySelector("[data-nav-indicator]");
	const items = nav ? [...nav.querySelectorAll("[data-nav-item]")] : [];
	if (!nav || !indicator || !items.length) return;
	const parentRoutes = {
		"service-details": "services",
		"project-details": "projects",
		"team-detail": "team",
		"blog-details": "blog"
	};
	const getRouteFromPath = () => {
		let route = (window.location.pathname.split("/").pop() || "index.html").replace(/\.html$/i, "") || "home";
		if (route === "index" || route === "") route = "home";
		return parentRoutes[route] || route;
	};
	const route = getRouteFromPath();
	sessionStorage.setItem("activeRoute", route);
	let activeItem = null;
	items.forEach((item) => {
		const isActive = item.closest("a")?.dataset.route === route;
		item.dataset.active = isActive ? "true" : "false";
		if (isActive) activeItem = item;
	});
	let isVisible = false;
	gsap.set(indicator, {
		opacity: 0,
		scale: 0,
		transformOrigin: "center center"
	});
	const getItemBounds = (item) => {
		const { offsetLeft: left, offsetTop: top, offsetWidth: width, offsetHeight: height } = item;
		return {
			left,
			top,
			width,
			height
		};
	};
	const revealAtItem = (item) => {
		const bounds = getItemBounds(item);
		gsap.set(indicator, {
			...bounds,
			opacity: 1,
			scale: 0
		});
		gsap.to(indicator, {
			scale: 1,
			duration: .6,
			ease: bouncyEase
		});
		isVisible = true;
	};
	const moveToItem = (item) => {
		if (!isVisible) {
			revealAtItem(item);
			return;
		}
		gsap.to(indicator, {
			...getItemBounds(item),
			opacity: 1,
			scale: 1,
			duration: .35,
			ease: "power2.out"
		});
	};
	const hideIndicator = () => {
		if (activeItem) {
			moveToItem(activeItem);
			return;
		}
		gsap.to(indicator, {
			opacity: 0,
			scale: 0,
			duration: .25,
			ease: "power2.in",
			onComplete: () => {
				isVisible = false;
			}
		});
	};
	const resetIndicator = () => {
		if (activeItem) {
			const bounds = getItemBounds(activeItem);
			gsap.set(indicator, {
				...bounds,
				opacity: 1,
				scale: 1
			});
			isVisible = true;
			return;
		}
		gsap.set(indicator, {
			opacity: 0,
			scale: 0
		});
		isVisible = false;
	};
	if (activeItem) requestAnimationFrame(() => revealAtItem(activeItem));
	items.forEach((item) => {
		item.addEventListener("mouseenter", () => moveToItem(item));
		const link = item.closest("a");
		link?.addEventListener("click", () => {
			if (link.dataset.route) sessionStorage.setItem("activeRoute", link.dataset.route);
		});
	});
	nav.addEventListener("mouseleave", hideIndicator);
	window.addEventListener("resize", resetIndicator);
};
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initNavTabs);
else initNavTabs();
//#endregion
var headerAnimation$1 = { headerOne() {
	const header = document.querySelector(".header-scroll");
	if (!header) return;
	let lastScrollY = window.scrollY;
	window.addEventListener("scroll", () => {
		const currentScrollY = window.scrollY;
		if (currentScrollY > 100) {
			header.classList.add("header-scrolled");
			if (currentScrollY > lastScrollY && currentScrollY > 150) {
				header.classList.add("header-hidden");
			} else {
				header.classList.remove("header-hidden");
			}
		} else {
			header.classList.remove("header-scrolled", "header-hidden");
		}
		lastScrollY = currentScrollY;
	}, { passive: true });
} };
if (globalThis.window !== void 0) headerAnimation$1.headerOne();
//#endregion
//#region src/js/animation/kinetic-text.js
var initKineticText = () => {
	if (typeof gsap === "undefined" || typeof SplitText === "undefined") return;
	gsap.registerPlugin(SplitText);
	const weights = [
		700,
		580,
		480,
		400
	];
	const scales = [
		1.08,
		1.04,
		1.02,
		1
	];
	document.querySelectorAll("[data-kinetic-text]").forEach((el) => {
		const letters = [...SplitText.create(el, {
			type: "chars",
			charsClass: "kinetic-letter"
		}).chars];
		if (!letters.length) return;
		gsap.set(letters, {
			fontWeight: 400,
			scale: 1,
			transformOrigin: "50% 50%"
		});
		let activeIndex = null;
		const applyState = (hoverIndex) => {
			if (hoverIndex === activeIndex) return;
			activeIndex = hoverIndex;
			letters.forEach((letter, i) => {
				const dist = hoverIndex === null ? 3 : Math.min(Math.abs(i - hoverIndex), 3);
				gsap.to(letter, {
					fontWeight: weights[dist],
					scale: scales[dist],
					duration: .5,
					ease: "back.out(1.7)",
					overwrite: "auto"
				});
			});
		};
		el.addEventListener("pointermove", (e) => {
			const letter = e.target.closest(".kinetic-letter");
			if (!letter || !el.contains(letter)) return;
			const index = letters.indexOf(letter);
			if (index !== -1) applyState(index);
		});
		el.addEventListener("pointerleave", () => applyState(null));
	});
};
var bootKineticText = () => {
	document.fonts.ready.then(initKineticText);
};
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootKineticText);
else bootKineticText();
//#endregion
//#region src/js/animation/mobile-menu.js
var is404Page = () => /\/404(?:\.html)?$/i.test(window.location.pathname);
var initMobileMenu = () => {
	if (typeof gsap === "undefined" || is404Page()) return;
	const toggle = document.querySelector("[data-mobile-menu-toggle]");
	const menu = document.querySelector("[data-mobile-menu]");
	const overlay = document.querySelector("[data-mobile-menu-overlay]");
	const closeBtn = document.querySelector("[data-mobile-menu-close]");
	const headerShell = document.querySelector("[data-header-shell]");
	const revealItems = menu ? [...menu.querySelectorAll("[data-mobile-menu-item]")] : [];
	if (!toggle || !menu || !overlay || !headerShell) return;
	let isOpen = false;
	let isAnimating = false;
	gsap.set(menu, {
		xPercent: 100,
		autoAlpha: 0
	});
	gsap.set(overlay, { autoAlpha: 0 });
	gsap.set(headerShell, {
		transformOrigin: "50% 0%",
		scale: 1
	});
	const setPageLock = (locked) => {
		document.body.style.overflow = locked ? "hidden" : "";
	};
	const canReveal = () => typeof gsap !== "undefined" && typeof SplitText !== "undefined";
	const getRevealDelay = (el) => {
		const parsed = Number.parseFloat(el.dataset.revealDelay);
		return Number.isNaN(parsed) ? .1 : parsed;
	};
	const cleanupReveal = (el) => {
		if (!canReveal()) return;
		el._splitText?.revert?.();
		delete el._splitText;
		gsap.killTweensOf(el.querySelectorAll(".text-reveal-line"));
	};
	let revealInitDone = false;
	const initReveal = () => {
		if (revealInitDone) return;
		revealInitDone = true;
		if (!canReveal()) return;
		if (typeof CustomEase === "undefined") {
			gsap.registerPlugin(SplitText);
			return;
		}
		gsap.registerPlugin(SplitText, CustomEase);
		if (!CustomEase.get?.("custom-ease")) CustomEase.create("custom-ease", "0.625, 0.05, 0, 1");
	};
	const revealElement = (el) => {
		if (!canReveal()) {
			gsap.set(el, { opacity: 1 });
			return;
		}
		initReveal();
		cleanupReveal(el);
		el._splitText = SplitText.create(el, {
			type: "lines",
			mask: "lines",
			linesClass: "text-reveal-line"
		});
		gsap.set(el, { opacity: 1 });
		gsap.fromTo(el._splitText.lines, { yPercent: 110 }, {
			yPercent: 0,
			duration: .8,
			stagger: .08,
			ease: typeof CustomEase === "undefined" ? "power2.out" : "custom-ease",
			delay: getRevealDelay(el)
		});
	};
	const hideReveal = (el) => {
		if (!canReveal()) {
			gsap.set(el, { opacity: 0 });
			return;
		}
		if (!el._splitText?.lines?.length) {
			cleanupReveal(el);
			gsap.set(el, { opacity: 0 });
			return;
		}
		gsap.killTweensOf(el._splitText.lines);
		gsap.to(el._splitText.lines, {
			yPercent: 110,
			duration: .35,
			ease: "power2.in",
			stagger: .03,
			onComplete: () => {
				cleanupReveal(el);
				gsap.set(el, { opacity: 0 });
			}
		});
	};
	const revealMenuItems = () => {
		revealItems.forEach((el) => revealElement(el));
	};
	const hideMenuItems = () => {
		revealItems.forEach((el) => hideReveal(el));
	};
	const open = () => {
		if (isOpen || isAnimating) return;
		isAnimating = true;
		isOpen = true;
		toggle.setAttribute("aria-expanded", "true");
		toggle.setAttribute("aria-label", "Close menu");
		menu.setAttribute("aria-hidden", "false");
		menu.classList.remove("pointer-events-none");
		menu.classList.remove("invisible");
		overlay.classList.remove("pointer-events-none");
		setPageLock(true);
		gsap.timeline({ onComplete: () => {
			isAnimating = false;
		} }).to(headerShell, {
			scale: .95,
			duration: .5,
			ease: "power3.inOut"
		}).to(overlay, {
			autoAlpha: 1,
			duration: .35,
			ease: "power2.out"
		}, "-=0.3").to(menu, {
			xPercent: 0,
			autoAlpha: 1,
			duration: .7,
			ease: "power3.out"
		}, "-=0.15").add(revealMenuItems, "-=0.4");
	};
	const close = () => {
		if (!isOpen || isAnimating) return;
		isAnimating = true;
		hideMenuItems();
		gsap.timeline({ onComplete: () => {
			isOpen = false;
			isAnimating = false;
			toggle.setAttribute("aria-expanded", "false");
			toggle.setAttribute("aria-label", "Open menu");
			menu.setAttribute("aria-hidden", "true");
			menu.classList.add("pointer-events-none");
			menu.classList.add("invisible");
			overlay.classList.add("pointer-events-none");
			setPageLock(false);
		} }).to(menu, {
			xPercent: 100,
			autoAlpha: 0,
			duration: .55,
			ease: "power3.in"
		}, .1).to(overlay, {
			autoAlpha: 0,
			duration: .35,
			ease: "power2.in"
		}, "-=0.35").to(headerShell, {
			scale: 1,
			duration: .5,
			ease: "power3.out"
		}, "-=0.3");
	};
	document.addEventListener("click", (event) => {
		const toggleBtn = event.target.closest("[data-mobile-menu-toggle]");
		if (toggleBtn && toggleBtn === toggle) {
			event.preventDefault();
			if (isOpen) close();
			else open();
			return;
		}
		const menuCloseBtn = event.target.closest("[data-mobile-menu-close]");
		if (menuCloseBtn && closeBtn && menuCloseBtn === closeBtn) {
			event.preventDefault();
			close();
		}
	});
	overlay.addEventListener("click", close);
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && isOpen) close();
	});
	const currentPage = window.location.pathname.split("/").pop() || "index.html";
	menu.querySelectorAll("[data-mobile-menu-link]").forEach((link) => {
		if (link.getAttribute("href")?.replace(/^\.\//, "") === currentPage) link.classList.add("active-menu");
	});
};
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initMobileMenu);
else initMobileMenu();
//#endregion
//#region src/js/animation/process-tabs.js
var initProcessTabs = () => {
	if (typeof gsap === "undefined") return;
	if (typeof CustomEase !== "undefined") {
		gsap.registerPlugin(CustomEase);
		CustomEase.create("bouncy-ease", "0.34, 1.42, 0.64, 1");
	}
	const imageEase = typeof CustomEase === "undefined" ? "power2.out" : "bouncy-ease";
	const nav = document.querySelector("[data-process-tabs]");
	const indicator = nav?.querySelector("[data-process-indicator]");
	const tabs = nav ? [...nav.querySelectorAll("[data-process-tab]")] : [];
	const panels = [...document.querySelectorAll("[data-process-panel]")];
	if (!nav || !indicator || !tabs.length || !panels.length) return;
	let activeTab = tabs.find((tab) => tab.dataset.active === "true") || tabs[0];
	let activeIndex = tabs.indexOf(activeTab);
	let isAnimating = false;
	const setActiveTab = (tab) => {
		tabs.forEach((item) => {
			item.dataset.active = item === tab ? "true" : "false";
		});
	};
	const setItemHover = (tab) => {
		tabs.forEach((item) => {
			if (item === tab) item.dataset.itemHover = "true";
			else delete item.dataset.itemHover;
		});
		if (tab === activeTab) delete activeTab.dataset.forceInactive;
		else activeTab.dataset.forceInactive = "true";
	};
	const clearItemHover = () => {
		tabs.forEach((item) => {
			delete item.dataset.itemHover;
			delete item.dataset.forceInactive;
		});
	};
	const moveIndicator = (tab, immediate = false) => {
		const { offsetLeft: left, offsetTop: top, offsetWidth: width, offsetHeight: height } = tab;
		if (immediate) gsap.set(indicator, {
			left,
			top,
			width,
			height
		});
		else gsap.to(indicator, {
			left,
			top,
			width,
			height,
			duration: .5,
			ease: "power2.out"
		});
	};
	const getPanelText = (panel) => panel.querySelectorAll("[data-process-reveal]");
	const resetPanelText = (panel) => {
		const items = getPanelText(panel);
		gsap.killTweensOf(items);
		gsap.set(items, {
			opacity: 0,
			filter: "blur(12px)",
			y: 24
		});
	};
	const resetImage = (img) => {
		gsap.killTweensOf(img);
		gsap.set(img, {
			autoAlpha: 1,
			scale: 1,
			y: 0,
			filter: "blur(0px)"
		});
	};
	const revealPanelText = (panel) => {
		const items = getPanelText(panel);
		gsap.killTweensOf(items);
		return gsap.fromTo(items, {
			opacity: 0,
			filter: "blur(12px)",
			y: 24
		}, {
			opacity: 1,
			filter: "blur(0px)",
			y: 0,
			duration: .45,
			stagger: .05,
			ease: "power2.out"
		});
	};
	const showPanel = (index) => {
		panels.forEach((panel, i) => {
			const isActive = i === index;
			panel.dataset.active = isActive ? "true" : "false";
			gsap.set(panel, {
				autoAlpha: isActive ? 1 : 0,
				pointerEvents: isActive ? "auto" : "none",
				zIndex: isActive ? 1 : 0
			});
			if (!isActive) resetPanelText(panel);
			resetImage(panel.querySelector("[data-process-img]"));
		});
	};
	panels.forEach((panel) => {
		const img = panel.querySelector("[data-process-img]");
		if (!img?.src) return;
		const preload = new Image();
		preload.src = img.src;
		img.decode?.().catch(() => {});
	});
	const switchPanel = (index) => {
		if (isAnimating || index === activeIndex) return;
		const currentPanel = panels[activeIndex];
		const nextPanel = panels[index];
		const currentImg = currentPanel.querySelector("[data-process-img]");
		const nextImg = nextPanel.querySelector("[data-process-img]");
		isAnimating = true;
		resetPanelText(nextPanel);
		gsap.set(nextPanel, {
			autoAlpha: 1,
			pointerEvents: "auto",
			zIndex: 2
		});
		gsap.set(currentPanel, { zIndex: 1 });
		gsap.set(nextImg, {
			autoAlpha: 0,
			y: -48,
			scale: 1,
			filter: "blur(5px)"
		});
		gsap.timeline({ onComplete: () => {
			gsap.set(currentPanel, {
				autoAlpha: 0,
				pointerEvents: "none",
				zIndex: 0
			});
			resetImage(currentImg);
			resetPanelText(currentPanel);
			gsap.set(nextPanel, { zIndex: 1 });
			activeIndex = index;
			panels.forEach((panel, i) => {
				panel.dataset.active = i === index ? "true" : "false";
			});
			isAnimating = false;
		} }).to(currentImg, {
			autoAlpha: 0,
			scale: .95,
			duration: .55,
			ease: imageEase,
			transformOrigin: "center center"
		}, 0).to(nextImg, {
			autoAlpha: 1,
			y: 0,
			filter: "blur(0px)",
			duration: .8,
			ease: imageEase
		}, 0).add(revealPanelText(nextPanel), .08);
	};
	setActiveTab(activeTab);
	moveIndicator(activeTab, true);
	showPanel(activeIndex);
	tabs.forEach((tab, index) => {
		tab.addEventListener("mouseenter", () => {
			setItemHover(tab);
			moveIndicator(tab);
		});
		tab.addEventListener("click", () => {
			if (index === activeIndex) return;
			activeTab = tab;
			setActiveTab(activeTab);
			clearItemHover();
			moveIndicator(activeTab);
			switchPanel(index);
		});
	});
	nav.addEventListener("mouseleave", () => {
		clearItemHover();
		moveIndicator(activeTab);
	});
	window.addEventListener("resize", () => moveIndicator(activeTab, true));
};
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initProcessTabs);
else initProcessTabs();
//#endregion
//#region src/js/animation/project-reveal.js
function initProjectReveal() {
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
	gsap.registerPlugin(ScrollTrigger);
	document.querySelectorAll("[data-project-reveal]").forEach((container) => {
		const imageMask = container.querySelector("[data-project-img]");
		const image = imageMask?.querySelector("img");
		const content = container.querySelector("[data-project-content]");
		if (!image) return;
		if (content) gsap.set(content, {
			autoAlpha: 0,
			y: 48
		});
		const tl = gsap.timeline({ scrollTrigger: {
			trigger: container,
			once: true
		} });
		tl.set(imageMask, { autoAlpha: 1 });
		tl.addLabel("projectReveal");
		tl.from(imageMask, {
			xPercent: -100,
			duration: 1.5,
			ease: "power2.out"
		}, "projectReveal");
		tl.from(image, {
			xPercent: 100,
			scale: 1.3,
			duration: 1.5,
			ease: "power2.out"
		}, "projectReveal");
		if (content) tl.to(content, {
			autoAlpha: 1,
			y: 0,
			duration: .7,
			ease: "power2.out"
		}, "projectReveal+=0.2");
	});
}
document.addEventListener("DOMContentLoaded", () => {
	requestAnimationFrame(() => {
		initProjectReveal();
		ScrollTrigger.refresh();
	});
});
//#endregion
//#region src/js/animation/reveal-animation.js
var animation = { init() {
	const elements = document.querySelectorAll("[data-block-reveal]");
	const Springer = window.Springer.default;
	elements.forEach((elem) => {
		const duration = elem.getAttribute("data-duration") ? parseFloat(elem.getAttribute("data-duration")) : .6;
		const blur = elem.getAttribute("data-blur") ? parseFloat(elem.getAttribute("data-blur")) : 0;
		const delay = elem.getAttribute("data-delay") ? parseFloat(elem.getAttribute("data-delay")) : 0;
		const offset = elem.getAttribute("data-offset") ? parseFloat(elem.getAttribute("data-offset")) : 60;
		const instant = elem.hasAttribute("data-instant") && elem.getAttribute("data-instant") !== "false";
		const start = elem.getAttribute("data-start") || "top 90%";
		const end = elem.getAttribute("data-end") || "top 50%";
		const direction = elem.getAttribute("data-direction") || "down";
		const useSpring = elem.hasAttribute("data-spring");
		const spring = useSpring ? Springer(.2, .8) : null;
		const rotation = elem.getAttribute("data-rotation") ? parseFloat(elem.getAttribute("data-rotation")) : 0;
		const scale = elem.getAttribute("data-scale") ? parseFloat(elem.getAttribute("data-scale")) : 1;
		const animationType = elem.getAttribute("data-animation-type") || "from";
		elem.style.opacity = "1";
		elem.style.filter = `blur(${blur}px)`;
		let animationProps;
		if (animationType === "to") {
			animationProps = {
				opacity: 1,
				filter: "blur(0)",
				duration,
				delay,
				ease: useSpring ? spring : "power2.out",
				scale
			};
			if (rotation !== 0) animationProps.rotation = rotation;
		} else {
			animationProps = {
				opacity: 0,
				filter: "blur(16px)",
				duration,
				delay,
				ease: useSpring ? spring : "power2.out"
			};
			if (rotation !== 0) animationProps.rotation = rotation;
		}
		if (!instant) animationProps.scrollTrigger = {
			trigger: elem,
			start,
			end,
			scrub: false
		};
		switch (direction) {
			case "left":
				animationProps.x = -offset;
				break;
			case "right":
				animationProps.x = offset;
				break;
			case "down":
				animationProps.y = offset;
				break;
			default: animationProps.y = -offset;
		}
		if (animationType === "to") gsap.to(elem, animationProps);
		else gsap.from(elem, animationProps);
	});
} };
document.addEventListener("DOMContentLoaded", () => {
	animation.init();
});
//#endregion
//#region src/js/animation/service-accordion.js
var setActive = (item, button, content, active) => {
	const value = active ? "true" : "false";
	item.dataset.active = value;
	button.dataset.active = value;
	content.dataset.active = value;
};
var getParts = (item) => ({
	button: item.querySelector("[data-service-accordion-button]"),
	content: item.querySelector("[data-service-accordion-content]")
});
var openItem = (item, button, content) => {
	setActive(item, button, content, true);
	requestAnimationFrame(() => {
		content.style.height = `${content.scrollHeight}px`;
	});
};
var closeItem = (item, button, content) => {
	content.style.height = `${content.scrollHeight}px`;
	content.offsetHeight;
	setActive(item, button, content, false);
	requestAnimationFrame(() => {
		content.style.height = "0px";
	});
};
var handleClick = (item, button, content, items) => {
	if (item.dataset.active === "true") {
		closeItem(item, button, content);
		return;
	}
	items.forEach((other) => {
		if (other.dataset.active !== "true") return;
		const parts = getParts(other);
		if (parts.button && parts.content) closeItem(other, parts.button, parts.content);
	});
	openItem(item, button, content);
};
var setupItem = (item, openOnInit = false) => {
	const { button, content } = getParts(item);
	if (!button || !content) return;
	if (openOnInit) {
		setActive(item, button, content, true);
		content.style.height = `${content.scrollHeight}px`;
	} else {
		setActive(item, button, content, false);
		content.style.height = "0px";
	}
};
var initServiceAccordion = () => {
	document.querySelectorAll("[data-service-accordion]").forEach((accordion) => {
		const items = [...accordion.querySelectorAll("[data-service-accordion-item]")];
		const defaultItem = items.find((item) => item.dataset.defaultOpen === "true");
		items.forEach((item) => setupItem(item, item === defaultItem));
		accordion.addEventListener("click", (event) => {
			const button = event.target.closest("[data-service-accordion-button]");
			if (!button || !accordion.contains(button)) return;
			const item = button.closest("[data-service-accordion-item]");
			if (!item || !accordion.contains(item)) return;
			const { button: itemButton, content } = getParts(item);
			if (!itemButton || !content || itemButton !== button) return;
			handleClick(item, itemButton, content, items);
		});
		if (typeof ScrollTrigger !== "undefined") setTimeout(() => {
			ScrollTrigger.refresh();
		}, 700);
	});
};
document.addEventListener("DOMContentLoaded", initServiceAccordion);
//#endregion
//#region src/js/animation/stack-cards.js
var getStackCardEnd = () => {
	const width = window.innerWidth;
	if (width >= 1024) return "bottom 600";
	if (width >= 768) return "bottom 830";
	if (width >= 425) return "bottom 730";
	if (width >= 375) return "bottom 780";
};
var stackCardAnimation = { init() {
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
	gsap.registerPlugin(ScrollTrigger);
	const cardWrappers = gsap.utils.toArray("[data-stack-card-wrapper]");
	if (cardWrappers.length === 0) return;
	cardWrappers.forEach((wrapper) => {
		const cardItems = wrapper.querySelectorAll("[data-stack-card-item]");
		if (cardItems.length === 0) return;
		const markers = wrapper.dataset.stackCardMarkers || false;
		const scaleValue = Number.parseFloat(wrapper.dataset.scaleValue) || .9;
		const endTrigger = wrapper.closest("section") || wrapper;
		cardItems.forEach((item, i) => {
			let scale = 1;
			if (i !== cardItems.length - 1) scale = scaleValue + .025 * i;
			gsap.to(item, {
				scale,
				transformOrigin: "top center",
				ease: "power3.out",
				scrollTrigger: {
					trigger: item,
					start: () => {
						const width = window.innerWidth;
						if (width >= 768) return "top " + (120 + 10 * i);
						if (width >= 425) return "top " + (140 + 10 * i);
						if (width >= 375) return "top " + (160 + 10 * i);
					},
					end: getStackCardEnd,
					endTrigger: () => {
						const width = window.innerWidth;
						if (width >= 768) return endTrigger;
						if (width >= 425) return wrapper;
						if (width >= 375) return wrapper;
					},
					scrub: 1,
					pin: item,
					pinSpacing: false,
					invalidateOnRefresh: true,
					markers: markers ? {
						indent: 100 * i,
						startColor: "#0ae448",
						endColor: "#e64138",
						fontSize: "14px"
					} : false,
					id: `stack-card-${i + 1}`
				}
			});
		});
	});
} };
document.addEventListener("DOMContentLoaded", () => {
	stackCardAnimation.init();
});
//#endregion
//#region src/js/animation/svg-draw/home-blog-svg.js
var initHomeBlogSvg = () => {
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || typeof DrawSVGPlugin === "undefined") return;
	gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
	const line = document.querySelector("[data-blog-svg]");
	if (!line) return;
	const path = line.querySelector("path");
	if (!path) return;
	gsap.set(path, { drawSVG: "0%" });
	gsap.timeline({ scrollTrigger: {
		trigger: line.closest("section") || line,
		start: () => {
			const width = window.innerWidth;
			if (width >= 768) return "top 20%";
			if (width >= 425) return "top 30%";
			if (width >= 375) return "top 5%";
		},
		end: () => {
			const width = window.innerWidth;
			if (width >= 1024) return "bottom 80%";
			if (width >= 768) return "bottom 80%";
			if (width >= 425) return "bottom 70%";
			if (width >= 375) return "80% 60%";
		},
		scrub: 1,
		invalidateOnRefresh: true
	} }).to(path, {
		drawSVG: "100%",
		ease: "none"
	});
};
document.addEventListener("DOMContentLoaded", () => {
	requestAnimationFrame(() => {
		initHomeBlogSvg();
		ScrollTrigger.refresh();
	});
});
//#endregion
//#region src/js/animation/svg-draw/home-feature-svg.js
var initHomeFeatureSvg = () => {
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || typeof DrawSVGPlugin === "undefined") return;
	gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
	const line = document.querySelector("[data-home-feature-svg]");
	if (!line) return;
	const path = line.querySelector("path");
	if (!path) return;
	gsap.set(path, { drawSVG: "100% 100%" });
	gsap.timeline({ scrollTrigger: {
		trigger: line.closest("section") || line,
		start: () => {
			const width = window.innerWidth;
			if (width >= 768) return "top 20%";
			if (width >= 425) return "top 30%";
			if (width >= 375) return "top 5%";
		},
		end: "bottom 80%",
		scrub: 1,
		invalidateOnRefresh: true
	} }).to(path, {
		drawSVG: "0% 100%",
		ease: "none"
	});
};
document.addEventListener("DOMContentLoaded", () => {
	requestAnimationFrame(() => {
		initHomeFeatureSvg();
		ScrollTrigger.refresh();
	});
});
//#endregion
//#region src/js/animation/svg-draw/home-service-svg.js
var initHomeServicesSvg = () => {
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || typeof DrawSVGPlugin === "undefined") return;
	gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
	const line = document.querySelector("[data-home-services-svg]");
	if (!line) return;
	const path = line.querySelector("path");
	if (!path) return;
	gsap.set(path, { drawSVG: "0%" });
	gsap.timeline({ scrollTrigger: {
		trigger: line.closest("section") || line,
		start: () => {
			const width = window.innerWidth;
			if (width >= 768) return "top 40%";
			if (width >= 425) return "30% 20%";
			if (width >= 375) return "30% 20%";
		},
		end: () => {
			const width = window.innerWidth;
			if (width >= 1024) return "70% 40%";
			if (width >= 768) return "60% 30%";
			if (width >= 425) return "50% 20%";
			if (width >= 375) return "70% 5%";
		},
		scrub: 1,
		invalidateOnRefresh: true
	} }).to(path, {
		drawSVG: "100%",
		ease: "none"
	});
};
document.addEventListener("DOMContentLoaded", () => {
	requestAnimationFrame(() => {
		initHomeServicesSvg();
		ScrollTrigger.refresh();
	});
});
//#endregion
//#region src/js/animation/svg-draw/home-work-svg.js
var initHomeWorkSvg = () => {
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || typeof DrawSVGPlugin === "undefined") return;
	gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
	const line = document.querySelector("[data-home-work-svg]");
	if (!line) return;
	const path = line.querySelector("path");
	if (!path) return;
	gsap.set(path, { drawSVG: "0%" });
	gsap.timeline({ scrollTrigger: {
		trigger: line.closest("section") || line,
		start: () => {
			const width = window.innerWidth;
			if (width >= 768) return "top 40%";
			if (width >= 425) return "30% 20%";
			if (width >= 375) return "30% 20%";
		},
		end: () => {
			const width = window.innerWidth;
			if (width >= 1024) return "70% 40%";
			if (width >= 768) return "60% 30%";
			if (width >= 425) return "50% 20%";
			if (width >= 375) return "70% 5%";
		},
		scrub: 1,
		invalidateOnRefresh: true
	} }).to(path, {
		drawSVG: "100%",
		ease: "none"
	});
};
document.addEventListener("DOMContentLoaded", () => {
	requestAnimationFrame(() => {
		initHomeWorkSvg();
		ScrollTrigger.refresh();
	});
});
//#endregion
//#region src/js/animation/svg-draw/portfolio-svg.js
var initPortfolioSvg = () => {
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || typeof DrawSVGPlugin === "undefined") return;
	gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
	const line = document.querySelector("[data-portfolio-svg]");
	if (!line) return;
	const path = line.querySelector("path");
	if (!path) return;
	gsap.set(path, { drawSVG: "0%" });
	gsap.timeline({ scrollTrigger: {
		trigger: line.closest("section") || line,
		start: () => {
			const width = window.innerWidth;
			if (width >= 768) return "top 20%";
			if (width >= 425) return "top 30%";
			if (width >= 375) return "top 5%";
		},
		end: () => {
			const width = window.innerWidth;
			if (width >= 1024) return "bottom 80%";
			if (width >= 768) return "bottom 80%";
			if (width >= 425) return "bottom 70%";
			if (width >= 375) return "bottom 60%";
		},
		scrub: 1,
		invalidateOnRefresh: true
	} }).to(path, {
		drawSVG: "100%",
		ease: "none"
	});
};
document.addEventListener("DOMContentLoaded", () => {
	requestAnimationFrame(() => {
		initPortfolioSvg();
		ScrollTrigger.refresh();
	});
});
//#endregion
//#region src/js/animation/text-reveal.js
function initMaskedTextReveal() {
	if (typeof gsap === "undefined" || typeof SplitText === "undefined" || typeof ScrollTrigger === "undefined" || typeof CustomEase === "undefined") return;
	const headings = document.querySelectorAll("[data-text-reveal]");
	if (!headings.length) return;
	gsap.registerPlugin(SplitText, ScrollTrigger, CustomEase);
	CustomEase.create("bouncy-ease", "0.34, 1.42, 0.64, 1");
	headings.forEach((heading) => {
		SplitText.create(heading, {
			type: "lines, words, chars",
			mask: "lines",
			linesClass: "line",
			wordsClass: "word",
			charsClass: "letter"
		});
		const targets = heading.querySelectorAll(".line");
		const letters = heading.querySelectorAll(".letter");
		if (!targets.length) return;
		const duration = heading.dataset.duration ? Number.parseFloat(heading.dataset.duration) : .8;
		const delay = heading.dataset.delay ? Number.parseFloat(heading.dataset.delay) : 0;
		gsap.fromTo(targets, { yPercent: 110 }, {
			yPercent: 0,
			duration,
			stagger: .08,
			delay,
			ease: "bouncy-ease",
			onStart: () => {
				gsap.set([heading, letters], { opacity: 1 });
			},
			scrollTrigger: {
				trigger: heading,
				start: "top 90%",
				end: "bottom 20%"
			}
		});
	});
}
document.addEventListener("DOMContentLoaded", () => {
	document.fonts.ready.then(initMaskedTextReveal);
});
//#endregion
//#region src/js/utils/footer.js
var footer = { init() {
	const footerYear = document.querySelector("[data-footer-year]");
	if (!footerYear) return;
	footerYear.textContent = (/* @__PURE__ */ new Date()).getFullYear();
} };
document.addEventListener("DOMContentLoaded", () => {
	footer.init();
});
//#endregion
//#region src/js/utils/header-scroll.js
var headerAnimation = { headerOne() {
	const header = document.querySelector(".header-scroll");
	if (!header) return;
	let lastScrollY = window.scrollY;
	window.addEventListener("scroll", () => {
		const currentScrollY = window.scrollY;
		if (currentScrollY > 100) {
			header.classList.add("header-scrolled");
			if (currentScrollY > lastScrollY && currentScrollY > 150) {
				header.classList.add("header-hidden");
			} else {
				header.classList.remove("header-hidden");
			}
		} else {
			header.classList.remove("header-scrolled", "header-hidden");
		}
		lastScrollY = currentScrollY;
	}, { passive: true });
} };
if (globalThis.window !== void 0) headerAnimation.headerOne();
//#endregion
//#region src/js/utils/modal.js
var ModalAnimation = class {
	config = {
		scrollThreshold: 800,
		storageKey: "joinModalDismissed",
		animation: {
			duration: 300,
			closeDelay: 200
		}
	};
	modal = null;
	content = null;
	isOpen = false;
	isAnimating = false;
	scrollTriggered = false;
	init() {
		this.bindEvents();
		this.setupScrollTrigger();
	}
	bindEvents() {
		document.addEventListener("click", (e) => this.handleClick(e));
		document.addEventListener("keydown", (e) => this.handleKeydown(e));
	}
	handleClick(e) {
		const trigger = e.target.closest(".modal-action");
		if (trigger) {
			e.preventDefault();
			this.open(trigger);
			return;
		}
		const closeBtn = e.target.closest(".modal-close-btn, .close-join-modal");
		const overlay = e.target.classList?.contains("modal-overlay");
		if (closeBtn) this.close(true);
		else if (overlay && e.target === this.modal) this.close(false);
	}
	handleKeydown(e) {
		if (e.key === "Escape" && this.isOpen) this.close(false);
	}
	open(trigger) {
		if (this.isAnimating) return;
		const overlay = trigger.closest(".modal-overlay") || document.querySelector(".modal-overlay");
		if (!overlay) return;
		if (this.isOpen) {
			this.close(false);
			setTimeout(() => {
				this._openWithVideo(overlay, trigger);
			}, this.config.animation.closeDelay + 50);
			return;
		}
		this._openWithVideo(overlay, trigger);
	}
	_openWithVideo(overlay, trigger) {
		this.modal = overlay;
		this.content = overlay.querySelector(".modal-content");
		const videoUrl = trigger.dataset.videoUrl;
		if (videoUrl) this.loadVideo(videoUrl);
		this.show();
	}
	show() {
		this.isOpen = true;
		this.isAnimating = true;
		document.body.style.overflow = "hidden";
		this.modal.classList.add("modal-open");
		this.modal.classList.remove("modal-close");
		this.modal.removeAttribute("aria-hidden");
		if (this.modal.tagName === "DIALOG") this.modal.showModal();
		this.animate("open");
	}
	close(persist = false) {
		if (!this.isOpen || this.isAnimating) return;
		this.isAnimating = true;
		this.isOpen = false;
		if (persist) this.savePreference();
		this.animate("close", () => {
			document.body.style.overflow = "auto";
			this.modal.classList.remove("modal-open");
			this.modal.classList.add("modal-close");
			this.modal.setAttribute("aria-hidden", "true");
			if (this.modal.tagName === "DIALOG") this.modal.close();
			this.clearVideo();
			this.isAnimating = false;
		});
	}
	animate(type, callback) {
		if (!this.content) {
			this.isAnimating = false;
			callback?.();
			return;
		}
		if (typeof gsap === "undefined") {
			if (type === "open") {
				this.content.style.outline = "none";
				this.content.setAttribute("tabindex", "-1");
				this.content.focus();
			}
			this.isAnimating = false;
			callback?.();
			return;
		}
		gsap.killTweensOf(this.content);
		if (type === "open") {
			this.content.style.outline = "none";
			this.content.setAttribute("tabindex", "-1");
			gsap.fromTo(this.content, {
				opacity: 0,
				y: -50
			}, {
				opacity: 1,
				y: 0,
				duration: this.config.animation.duration / 1e3,
				ease: "power3.inOut",
				onComplete: () => {
					this.content.focus();
					this.isAnimating = false;
				}
			});
		} else gsap.to(this.content, {
			opacity: 0,
			y: -50,
			duration: this.config.animation.closeDelay / 1e3,
			ease: "power2.in",
			onComplete: callback
		});
	}
	loadVideo(url) {
		const iframe = this.content?.querySelector("iframe");
		if (!iframe) return;
		iframe.src = "";
		requestAnimationFrame(() => {
			iframe.src = url;
		});
	}
	clearVideo() {
		const iframe = this.content?.querySelector("iframe");
		if (iframe) iframe.src = "";
	}
	setupScrollTrigger() {
		const joinModal = Array.from(document.querySelectorAll(".modal-overlay")).find((m) => m.querySelector(".close-join-modal, #join-modal-title"));
		if (!joinModal || this.wasModalDismissed()) return;
		const handleScroll = () => {
			if (this.scrollTriggered) return;
			if ((window.scrollY || document.documentElement.scrollTop) >= this.config.scrollThreshold) {
				this.scrollTriggered = true;
				this.modal = joinModal;
				this.content = joinModal.querySelector(".modal-content");
				this.show();
				window.removeEventListener("scroll", handleScroll);
			}
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		if (document.readyState !== "loading") handleScroll();
	}
	wasModalDismissed() {
		return localStorage.getItem(this.config.storageKey) === "true";
	}
	savePreference() {
		try {
			localStorage.setItem(this.config.storageKey, "true");
		} catch (e) {
			console.warn("Could not save modal preference", e);
		}
	}
	destroy() {
		if (this.isOpen) this.close(false);
	}
};
if (typeof window !== "undefined") {
	const modal = new ModalAnimation();
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => modal.init(), { once: true });
	else modal.init();
}
//#endregion
//#region src/js/utils/search-modal.js
function createSearchModal(root) {
	const overlay = root.querySelector("[data-search-modal-overlay]");
	const panel = root.querySelector("[data-search-modal-panel]");
	const backdrop = root.querySelector("[data-search-modal-backdrop]");
	const items = root.querySelectorAll("[data-search-modal-item]");
	const input = root.querySelector("input[type=\"search\"]");
	if (!overlay || !panel) return null;
	if (!document.querySelector("[data-search-modal-open]")) return null;
	if (overlay.parentElement !== document.body) document.body.appendChild(overlay);
	let isOpen = false;
	const finishClose = () => {
		overlay.classList.add("hidden");
		overlay.classList.remove("flex");
		overlay.setAttribute("aria-hidden", "true");
		document.body.style.overflow = "";
	};
	const open = () => {
		if (isOpen) return;
		isOpen = true;
		overlay.classList.remove("hidden");
		overlay.classList.add("flex");
		overlay.setAttribute("aria-hidden", "false");
		document.body.style.overflow = "hidden";
		if (typeof gsap === "undefined") {
			input?.focus();
			return;
		}
		gsap.killTweensOf([
			backdrop,
			panel,
			...items
		]);
		gsap.set(backdrop, { opacity: 0 });
		gsap.set(panel, {
			opacity: 0,
			y: 28,
			scale: .94
		});
		gsap.set(items, {
			opacity: 0,
			y: 16
		});
		gsap.timeline({ onComplete: () => input?.focus() }).to(backdrop, {
			opacity: 1,
			duration: .22,
			ease: "power2.out"
		}).to(panel, {
			opacity: 1,
			y: 0,
			scale: 1,
			duration: .32,
			ease: "power3.out"
		}, "-=0.08").to(items, {
			opacity: 1,
			y: 0,
			duration: .28,
			stagger: .045,
			ease: "power2.out"
		}, "-=0.18");
	};
	const close = () => {
		if (!isOpen) return;
		isOpen = false;
		if (typeof gsap === "undefined") {
			finishClose();
			return;
		}
		gsap.killTweensOf([
			backdrop,
			panel,
			...items
		]);
		gsap.timeline({ onComplete: finishClose }).to(items, {
			opacity: 0,
			y: 8,
			duration: .12,
			stagger: .02,
			ease: "power1.in"
		}).to(panel, {
			opacity: 0,
			y: 16,
			scale: .96,
			duration: .18,
			ease: "power2.in"
		}, "-=0.06").to(backdrop, {
			opacity: 0,
			duration: .16,
			ease: "power2.in"
		}, "-=0.1");
	};
	document.addEventListener("click", (event) => {
		if (!event.target.closest("[data-search-modal-open]")) return;
		event.preventDefault();
		open();
	});
	overlay.addEventListener("click", (event) => {
		if (event.target.closest("[data-search-modal-close]")) {
			event.preventDefault();
			close();
			return;
		}
		if (event.target === backdrop || event.target === overlay) close();
	});
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && isOpen) close();
	});
	return {
		open,
		close
	};
}
document.addEventListener("DOMContentLoaded", () => {
	const root = document.querySelector("[data-search-modal-root]");
	if (!root) return;
	const modal = createSearchModal(root);
	globalThis.searchModalInstances = modal ? [modal] : [];
});
//#endregion
//#region src/js/utils/smooth-scrolling.js
var lenis;
var smoothScrolling = () => {
	if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768 || "ontouchstart" in window)) {
		lenis = new Lenis({
			lerp: .08,
			smoothWheel: true
		});
		lenis.on("scroll", () => ScrollTrigger.update());
		gsap.ticker.add((time) => {
			lenis.raf(time * 1e3);
		});
		gsap.ticker.lagSmoothing(0);
	}
};
var resetTocItems = (sidebarList) => {
	sidebarList.querySelectorAll("li").forEach((item) => {
		const icon = item.querySelector("span:last-child");
		const text = item.querySelector("span:first-child, a span");
		if (icon) icon.classList.add("invisible");
		if (text) {
			text.classList.remove("font-medium", "text-white");
			text.classList.add("font-normal", "text-white/60");
		}
	});
};
var activateTocItem = (item) => {
	const icon = item.querySelector("span:last-child");
	const text = item.querySelector("span:first-child, a span");
	if (icon) icon.classList.remove("invisible");
	if (text) {
		text.classList.remove("font-normal", "text-white/60");
		text.classList.add("font-medium", "text-white");
	}
};
var handleTocItemClick = (clickedItem, sidebarList) => {
	resetTocItems(sidebarList);
	activateTocItem(clickedItem);
};
var lenisSmoothScrollLinks = () => {
	document.addEventListener("click", (e) => {
		const ele = e.target.closest(".lenis-scroll-to");
		if (!ele) return;
		e.preventDefault();
		const target = ele.getAttribute("href");
		const sidebarList = document.querySelector(".table-of-contents .table-of-list");
		if (sidebarList) {
			const clickedItem = ele.closest("li");
			if (clickedItem) handleTocItemClick(clickedItem, sidebarList);
		}
		if (target) {
			if (lenis) lenis.scrollTo(target, {
				offset: -100,
				duration: 1.7,
				easing: (t) => 1 - Math.pow(1 - t, 3)
			});
			else {
				const targetElement = document.querySelector(target);
				if (targetElement) {
					targetElement.scrollIntoView({
						behavior: "smooth",
						block: "start"
					});
					setTimeout(() => {
						window.scrollBy(0, -100);
					}, 100);
				}
			}
		}
	});
};
var handleTocListClicks = () => {
	const sidebarList = document.querySelector(".table-of-contents .table-of-list");
	if (!sidebarList) return;
	sidebarList.addEventListener("click", (event) => {
		const item = event.target.closest("li");
		if (!item || !sidebarList.contains(item)) return;
		if (item.querySelector(".lenis-scroll-to")) return;
		handleTocItemClick(item, sidebarList);
	});
};
document.addEventListener("DOMContentLoaded", () => {
	smoothScrolling();
	lenisSmoothScrollLinks();
	handleTocListClicks();
});
//#endregion
//#region src/js/utils/swiper.js
function getSlidesOffsetBefore(el) {
	const offset = el.dataset.offsetBefore;
	if (offset === "container") {
		const container = el.closest("section")?.querySelector(".main-container");
		return container ? Math.round(container.getBoundingClientRect().left) : 20;
	}
	return Number(offset) || 0;
}
function bindSlidesOffsetResize(swiper, el) {
	if (el.dataset.offsetBefore !== "container") return;
	const updateOffset = () => {
		swiper.params.slidesOffsetBefore = getSlidesOffsetBefore(el);
		swiper.update();
	};
	window.addEventListener("resize", updateOffset);
}
var swiperAnimation = {
	instances: {},
	init() {
		if (typeof Swiper === "undefined") return;
		const testimonialEl = document.querySelector(".testimonial-swiper");
		if (testimonialEl) {
			this.instances.testimonial = new Swiper(testimonialEl, {
				slidesPerView: "auto",
				spaceBetween: 12,
				speed: 600,
				grabCursor: true,
				slidesOffsetBefore: getSlidesOffsetBefore(testimonialEl),
				breakpoints: {
					640: {
						slidesPerView: 2,
						spaceBetween: 12
					},
					980: {
						slidesPerView: 3,
						spaceBetween: 20
					},
					1140: { slidesPerView: 4 }
				},
				navigation: {
					nextEl: ".testimonial-next",
					prevEl: ".testimonial-prev"
				}
			});
			bindSlidesOffsetResize(this.instances.testimonial, testimonialEl);
		}
		const scienceLabEl = document.querySelector(".science-lab-testimonial-swiper");
		if (scienceLabEl) this.instances.scienceLabTestimonial = new Swiper(scienceLabEl, {
			initialSlide: 3,
			centeredSlides: true,
			spaceBetween: 0,
			loop: true,
			speed: 1400,
			allowTouchMove: true,
			autoplay: {
				delay: 2e3,
				disableOnInteraction: true
			},
			breakpoints: {
				640: {
					slidesPerView: 1,
					spaceBetween: 0
				},
				980: {
					slidesPerView: 2,
					spaceBetween: 20
				},
				1140: { slidesPerView: 3 }
			},
			navigation: {
				nextEl: ".science-lab-testimonial-next",
				prevEl: ".science-lab-testimonial-prev"
			},
			on: {
				init: function() {
					const activeSlide = this.slides[this.activeIndex];
					if (activeSlide) {
						activeSlide.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
						activeSlide.style.transform = "scale(1)";
						activeSlide.style.opacity = "1";
						activeSlide.style.filter = "blur(0)";
					}
				},
				slideChange: function() {
					this.slides.forEach((slide) => {
						slide.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
						slide.style.transform = "scale(0.8)";
					});
				},
				slideChangeTransitionStart: function() {
					const activeSlide = this.slides[this.activeIndex];
					if (activeSlide) {
						activeSlide.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
						activeSlide.style.transform = "scale(1)";
					}
				}
			}
		});
	}
};
document.addEventListener("DOMContentLoaded", () => {
	swiperAnimation.init();
});
//#endregion
