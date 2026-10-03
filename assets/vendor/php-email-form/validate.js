/**
* PHP Email Form Validation - v3.6
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      // hCaptcha를 풀지 않았으면 보내지 않는다 (Web3Forms 스팸 방지)
      let captchaMessage = thisForm.querySelector('.captcha-message');
      if (captchaMessage) captchaMessage.classList.remove('d-block');
      let captcha = thisForm.querySelector('textarea[name=h-captcha-response]');
      if (thisForm.querySelector('.h-captcha') && (!captcha || !captcha.value)) {
        if (captchaMessage) captchaMessage.classList.add('d-block');
        return;
      }

      thisForm.querySelector('.loading').classList.add('d-block');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    // Web3Forms는 {"success": true/false, "message": "..."} JSON으로 답한다
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'Accept': 'application/json'}
    })
    .then(response => response.json())
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data.success) {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset();
        if (typeof hcaptcha !== "undefined") hcaptcha.reset();
      } else {
        throw new Error(data.message || 'Form submission failed');
      }
    })
    .catch((error) => {
      displayError(thisForm, 'Please contact us directly at tedsskim@hanmail.net or astmengineering1@gmail.com');
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
