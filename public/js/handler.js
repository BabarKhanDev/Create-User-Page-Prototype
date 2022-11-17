var currentSel = null;
var username = '';

$(document).ready(function(){
    checkIfIPExist();
})

function checkIfIPExist(){
    $.post("http://192.168.0.86:3000/checkIfIPExist",{}, function(data){

        if(data != 'false'){
            username = data.split('/')[0];
            currentSel = data.split('/')[1];
            generateUserDisplay();
        }
        else{
            generateUsernameSel();
        }

    });
}

function generateUserDisplay(){
    document.getElementById('carousel').parentNode.removeChild(document.getElementById('carousel'));
    document.getElementById('dots').parentNode.removeChild(document.getElementById('dots'));
    document.getElementById('submitPP').parentNode.removeChild(document.getElementById('submitPP'));
    document.getElementById('username').parentNode.removeChild(document.getElementById('username'));
    document.getElementById('submitUsername').parentNode.removeChild(document.getElementById('submitUsername'));
    
    document.getElementById('title').innerHTML = 'Welcome ' + username;
    document.getElementById('waiting').innerHTML = 'Thank You For Signing Up';

    document.getElementById('submitNewUser').hidden = false;
}

function clearSavedUser(){
    $.post("http://192.168.0.86:3000/clearExistingUser",{username:username}, function(data){

        console.log(data)
        if(data == 'user cleared'){
            location.reload();
        }
        else{
            alert('An error has occured')
        }

    });
}

function generateUsernameSel(){
    document.getElementById('title').innerHTML = 'Choose A Username'
}


function submitUsername(){
    let usernameChoice = document.getElementById('username').value.toUpperCase();
    if(usernameChoice.length==0){
        alert('username cannot be blank')
        return;
    }
    if(usernameChoice.match(/[a-z0-9A-Z]*/)[0] != usernameChoice){
        alert('username can only contain letters and numbers')
        return
    }
    
    checkUsernameTaken(usernameChoice);
}

function checkUsernameTaken(usernameChoice){
    $.post("http://192.168.0.86:3000/checkUsernameTaken",{username: usernameChoice}, function(data){
        console.log(data)
        if(data == 'true'){
            alert('username taken')
        }
        else{
            username = usernameChoice;
            generatePPSel();
            
        }
        return

    });
}

function generatePPSel(){

    document.getElementById('username').hidden = true
    document.getElementById('submitUsername').hidden = true
    document.getElementById('carousel').hidden = false
    document.getElementById('dots').hidden = false
    document.getElementById('title').innerHTML = 'Choose A Profile Picture'

    let imageList = getImages();
    for(var i = 0; i<imageList.length; i++){
        document.getElementById('carousel').appendChild(genImage(imageList[i]));
    }
    generateDots(imageList.length);
    addDotEventListeners();
}

function getImages(){
    return ['images/banana.jpg', 'images/apple.png', 'images/grapes.jpg','images/kiwi.jpg','images/orange.jpg','images/peach.jpg','images/pineapple.jpg']
}

function genImage(src){
    let image = document.createElement('img')
    image.setAttribute('src',src)
    image.setAttribute('class','imageSelection')
    image.setAttribute('onclick', 'changeSelection("'+src.slice(7,-4)+'")')
    return image
}

function changeSelection(img_name){
    currentSel = img_name;
    img_name = img_name[0].toUpperCase() + img_name.slice(1);
    document.getElementById('submitPP').hidden = false;
    document.getElementById('submitPP').innerHTML = 'Submit: ' + img_name;

}

function submitUserData(){
    $.post("http://192.168.0.86:3000/postPP",{image:currentSel, username:username}, function(data){

        if(data == 'true'){
            generateUserDisplay();
        }
        else{
            alert('something went wrong')
        }

    });
}

function generateDots(count){
    dotContainer = document.getElementById('dots')
    for(var i = 0; i<count; i++){
        dot = document.createElement('button')
        dot.setAttribute('class','dot')
        dotContainer.appendChild(dot)
    }
}

function addDotEventListeners(){
    const dots = document.getElementById('dots');
    dots.addEventListener('click', e => {
      const target = e.target;
      if (!target.matches('.dot')) {
          return;
      }
      
      const index = Array.from(dots.children).indexOf(target);
      const selector = `.imageSelection:nth-child(${index + 1})`;
      const box = document.querySelector(selector)

      changeSelection(box.src.split('/')[4].slice(0,-4))
      box.scrollIntoView({
        behavior: 'smooth',
        inline: 'start'
      })
    })
}