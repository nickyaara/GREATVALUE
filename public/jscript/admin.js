// Js to show and hide menu option in admin panel

// import { name } from "ejs";

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


  // Admin logout functionality
  // document.querySelector("#admin-Logout").addEventListener('click', () => {
  //   window.location.assign(`http://localhost:3000`);
  // });

// Javascript to content on dashboard section as per click

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

  // Add new job on website

  // if(document.querySelector('#op-4')){
  async function addJob() {
    const jobName = document.querySelector('#jobTitle').value;
    const experience = document.querySelector('#experience').value;
    const location = document.querySelector('#jobLocation').value;
    const salary = document.querySelector('#salary').value;
    const description = document.querySelector('#description').value;
    const jobDetailObj =  {
      name:jobName,
      experience:experience,
      location:location,
      salary:salary,
      description:description
    };
    if(jobName==='' || experience==='' || location==='' || salary==='' || description===''){
      showMsg('Please fill all the details', 'Error');
    } else {
    try {
      const responce = await fetch('http://localhost:3000/admin/add-job', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type
      },
        body: JSON.stringify(jobDetailObj),
      });
      if(responce.ok) {
        const displayData = await responce.json();
        jobName=''; experience='';location='';salary='';description='';
        showMsg(displayData,'Success');
      } else {
        console.error('Error fetching data:', response.status);
        showMsg(displayData,'Error');
    }
    } catch (err){
      console.log(err)
    }
  }
  }
// }

function showMsg(msg,type){
  const div =document.createElement('div');
  const adminPage = document.querySelector('.admin-page-c');
  div.setAttribute('id','message-div');
  div.innerText=msg;
  if(type=='Error'){
    div.setAttribute('class','error');
  } else {
    div.setAttribute('class','success');
  }
  adminPage.appendChild(div);
  setTimeout(() =>{
    div.style.display = 'none';
}, 2000);
}

// edit job click functionality

function editJob(id){
  let jobId = id.slice(3);
  alert('edit job with id '+jobId);
}

// Delete job click functionality

function deleteJob(id){
  let jobId = id.slice(3);
  alert('Delete job with id '+jobId);
}

// Edit product click functionality

function editProduct(id){
  let productId = id.slice(3);
  alert('Edit product with id '+productId);
}

// Delete product click functionality

function deleteProduct(id){
  let productId = id.slice(3);
  alert('Delete product with id '+productId);
}