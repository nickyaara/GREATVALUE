// Js to show and hide menu option in admin panel

function toggleOption(value) {
    let elementId = value.slice(-1);
    const upArrow = document.querySelector(`#up-arrow-${elementId}`);
    const downArrow = document.querySelector(`#down-arrow-${elementId}`);
    const optionLink = document.querySelector(`#option-link-${elementId}`);
    const options = document.querySelector(`#option-${elementId}`);
    const highlightValue = optionLink.classList.contains('highlight');
    if (highlightValue == false) {
      optionLink.classList.add('highlight');
      options.classList.remove('hide');
      downArrow.style.display = 'none';
      upArrow.style.display = 'block';
    } else {
      optionLink.classList.remove('highlight');
      options.classList.add('hide');
      downArrow.style.display = 'block';
      upArrow.style.display = 'none';
    }
  }

  document.querySelector("#admin-Logout").addEventListener('click', () => {
    window.location.assign(`http://localhost:3000`);
  });

  function showSection(option){
    var sections = document.querySelectorAll('#admin-window > div');
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].id === option) {
        sections[i].style.display = 'block';
      } else {
        sections[i].style.display = 'none';
      }
    }
  }