// Animations for sub headings

document.addEventListener("scroll", function() {
    var elements = document.querySelectorAll('.sub-title');
    
    elements.forEach(function(element) {
        var position = element.getBoundingClientRect();

        // Check if the element is in the viewport (even partially)
        if (position.top < window.innerHeight && position.bottom >= 0) {
            // Add the class that triggers the animation
            element.classList.add('visible');
        } else {
            // Remove the class if you want the animation to re-trigger when scrolling back
            element.classList.remove('visible');
        }
    });
});
