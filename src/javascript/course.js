/**
 * EduLearn Course Filtering and Accordion
 * Filters course cards and controls expandable sections.
 */
(function () {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const courseCards = document.querySelectorAll('.course-card');

  if (filterTabs.length > 0 && courseCards.length > 0) {
    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        filterTabs.forEach((item) => item.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        courseCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          const shouldShow = filter === 'all' || category === filter;

          card.style.display = shouldShow ? 'flex' : 'none';
        });
      });
    });
  }

  const accordionHeaders = document.querySelectorAll('.accordion-header');

  if (accordionHeaders.length > 0) {
    accordionHeaders.forEach((header) => {
      header.addEventListener('click', () => {
        header.parentElement.classList.toggle('open');
      });
    });
  }
})();
