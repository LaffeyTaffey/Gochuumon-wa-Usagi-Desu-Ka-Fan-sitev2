particlesJS("particles-js", {
   "particles": {
       "number": {
           "value": 30, // Reduced particle count for better performance
           "density": {
               "enable": false // Disable density to simplify calculations
           }
       },
       "color": {
           "value": ["#FFB6C1", "#D8BFD8", "#ADD8E6"] // Pastel color palette
       },
       "shape": {
           "type": "circle", // Simplified to just circles for better performance
           "stroke": {
               "width": 0
           }
       },
       "opacity": {
           "value": 0.7, // Solid opacity to eliminate transparency overhead
           "random": false,
           "anim": {
               "enable": false // Disable opacity animation
           }
       },
       "size": {
           "value": 5, // Smaller particle size
           "random": true,
           "anim": {
               "enable": false // Disable size animation
           }
       },
       "line_linked": {
           "enable": false // Keep lines disabled
       },
       "move": {
           "enable": true,
           "speed": 1, // Slower movement
           "direction": "none",
           "random": true,
           "straight": false,
           "out_mode": "out",
           "bounce": false
       }
   },
   "interactivity": {
       "detect_on": "canvas",
       "events": {
           "onhover": {
               "enable": false
           },
           "onclick": {
               "enable": false
           }
       }
   },
   "retina_detect": false, // Disable retina detection to reduce complexity
   "fps_limit": 30 // Explicitly limit frames per second
});

// Optional: Add performance optimization for the particles container
document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.getElementById('particles-js');
    particlesContainer.style.willChange = 'transform'; // Hint to browser for GPU acceleration
    particlesContainer.style.transform = 'translateZ(0)'; // Force GPU compositing
});