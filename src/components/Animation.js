'use client';

import {useEffect} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useAnimation = () => {
    useEffect(() => {
        const display1Elements = document.querySelectorAll(".display-animation-1");
        display1Elements.forEach((element, i) => {
            gsap.fromTo(element, {
                y: 40, opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1.5,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 60%',
                },
                ease: 'power2.out'
            });
            if (element) {
                element.style.willChange = 'transform, opacity';
            }
        });

        return () => {
            // Clean up if necessary
        };
    }, []);
};

export default useAnimation;
