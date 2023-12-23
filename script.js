// --- GLOBAL ---
const MAX_CHARS = 150;
const BASE_API_URL = 'https://bytegrad.com/course-assets/js/1/api';

const formEl = document.querySelector('.form');
const textAreaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const feedback = document.querySelector('.feedbacks');
const submitBtnEl = document.querySelector('.submit-btn');
const spinneEl = document.querySelector('.spinner');
const hashtagsListEl = document.querySelector('.hashtags')

const renderFeedbackItem = (feedbackItem) => {
     // new html item
     const listItemHTML = `<li class="feedback">
     <button class="upvote">
         <i class="fa-solid fa-caret-up upvote__icon"></i>
         <span class="upvote__count">${feedbackItem.upvoteCount}</span>
     </button>
     <section class="feedback__badge">
     <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
     </section>
     <div class="feedback__content">
         <p class="feedback__company">${feedbackItem.company}</p>
         <p class="feedback__text">${feedbackItem.text}</p>
     </div>
     <p class="feedback__date">${feedbackItem.daysAgo === 0 ? 'NEW' : `${feedbackItem.daysAgo}d`}</p>
 </li>`;

  // inset the li into the feedback class
  feedback.insertAdjacentHTML('beforeend', listItemHTML);


}


// --- COUNTER COMPONENTS ---
textAreaEl.addEventListener('input', inputHandler);

// if I use the classic funcion i can express its after the event
function inputHandler(){

    //max character number
    const maxChars = MAX_CHARS;

    //determinate number of characters already written
    const charsWritten = textAreaEl.value.length;

    //number of character remain
    CharsLeft = maxChars - charsWritten;

    counterEl.textContent = CharsLeft;
}

// --- FORM COMPONENTS ---


const showVisualIndicator = (check) => {

    const className = check === 'valid' ? 'form--valid' : 'form--invalid';
    //sjow visual indicator
    formEl.classList.add(className);
        //remove visual indicator after 2s
        setTimeout( function(){
            formEl.classList.remove(className);
        } , 2000);
}

//if i use the arrow function i have to express before the event
const submitHandler = (event) => {
    //prevent the default action (normally load the page action is referred to)
    event.preventDefault();

    //get text from the textarea
    const text = textAreaEl.value;

    //validate text (if hashtag is present and if text is long enough)
    if(text.includes('#') && text.length >= 5){
        showVisualIndicator('valid');
    } else {
        showVisualIndicator('invalid');

        textAreaEl.focus();

        //use return to stop the function
        return
    }

    //submit the actual text into the textarea
    const hashtag = text.split(' ').find(word => word.includes('#'));
    const company = hashtag.substring(1).replace(',', '');
    const badgeLetter = company.substring(0,1).toUpperCase();
    const upvoteCount = 0;
    const daysAgo = 0;

    //create an object for render all the item via function

    const feedbackItem = {
        upvoteCount: upvoteCount,
        company: company,
        badgeLetter: badgeLetter,
        daysAgo: daysAgo,
        text: text
    }
    //render feedback item via function
    renderFeedbackItem(feedbackItem);

    //send feedback item to server
    fetch(`${BASE_API_URL}/feedbacks`, {
        method: 'POST',
        body: JSON.stringify(feedbackItem),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if(!response.ok){
            console.log('Something went wrong');
            // use return for close the function and not use else in the if statement
            return;
        }
            console.log('Successfly submitted');
    }).catch(error =>  console.log(error));
    


 //clear text area
 textAreaEl.value = '';

 //blur button
 submitBtnEl.blur();

 // reset counter
 counterEl.textContent = MAX_CHARS;

}

formEl.addEventListener('submit', submitHandler);

// --- FEEDBACK LIST COMPONENT --
const clickHandler = (event) => {
    //get the target of the click
    const clickedEl = event.target;

    //determinated if user want to upvote or expand
    const upVoteIntention = clickedEl.className.includes('upvote');

    // upvote the clicked element
    if(upVoteIntention) {
        const upvoteBtnEl = clickedEl.closest('.upvote');
        upvoteBtnEl.disabled = true;
        let upVoteCountEl = upvoteBtnEl.querySelector('.upvote__count');
        upVoteCount = +upVoteCountEl.textContent;
        upVoteCountEl.textContent = ++upVoteCount;

        //send upvote Counter item to server
        
        fetch(`${BASE_API_URL}/feedbacks`, {
        method: 'POST',
        body: JSON.stringify(upVoteCount),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
         }).then(response => {
        if(!response.ok){
            console.log('Something went wrong');
            // use return for close the function and not use else in the if statement
            return;
        }
            console.log('Successfly submitted');
     }).catch(error =>  console.log(error));
     
    

    } else {
        //expand the clicked feedback item
        clickedEl.closest('.feedback').classList.toggle('feedback--expand');
    }

}

feedback.addEventListener('click', clickHandler);


fetch(`${BASE_API_URL}/feedbacks`)
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        //after all the json loaded we remove the spinner animation
        spinneEl.remove();


        //iterate over each elements in feedbacks array and the render it.
        data.feedbacks.forEach(feedbackItem => {
            renderFeedbackItem(feedbackItem);
            
        })


    }).catch(error => {
        feedback.innerHTML = `
        <div class="message-error">Failed to fech the data. Error message: ${error.message}</div>`;
    });


    // hashtag list component

    const clickHandlerHashtags = event => {
        //get the element clicked
        const clickedEl = event.target;

        //stop function if click happened outside btn
        if(clickedEl.className === 'hashtags'){
            return ;
        }

        //extract company name of the target el, then take away # and lowercase for comparison
       const companyNameFromHashtag = clickedEl.textContent.substring(1).toLowerCase().trim();
       console.log(companyNameFromHashtag);

       //company name from feedback
       feedback.childNodes.forEach(childNode => {
            //stop if child has text node (empty text)
            if(childNode.nodeType === 3) return;
       
            //extract company name
            const companyNameFromFeedbackItem = childNode.querySelector('.feedback__company').textContent.toLowerCase().trim();
            
          
          if(companyNameFromHashtag !== companyNameFromFeedbackItem){
            childNode.remove();
          }
       });
        
    }

    hashtagsListEl.addEventListener('click', clickHandlerHashtags);


