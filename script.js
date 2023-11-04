// --- GLOBAL ---
const MAX_CHARS = 150;

const formEl = document.querySelector('.form');
const textAreaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const feedback = document.querySelector('.feedbacks');
const submitBtnEl = document.querySelector('.submit-btn');


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
    const upVoteCounter = 0;
    const daysAgo = 0;



     //new html item

     const listItemHTML = `<li class="feedback">
     <button class="upvote">
         <i class="fa-solid fa-caret-up upvote__icon"></i>
         <span class="upvote__count">${upVoteCounter}</span>
     </button>
     <section class="feedback__badge">
     <p class="feedback__letter">${badgeLetter}</p>
     </section>
     <div class="feedback__content">
         <p class="feedback__company">${company}</p>
         <p class="feedback__text">${text}</p>
     </div>
     <p class="feedback__date">${daysAgo === 0 ? 'NEW' : `${daysAgo}d`}</p>
 </li>`;

 // inset the li into the feedback class
 feedback.insertAdjacentHTML('beforeend', listItemHTML);

 //clear text area

 textAreaEl.value = '';

 //blur button
 submitBtnEl.blur();

 // reset counter
 
 counterEl.textContent = MAX_CHARS;

}

formEl.addEventListener('submit', submitHandler);




