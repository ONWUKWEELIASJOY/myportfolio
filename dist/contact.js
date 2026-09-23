const contactForm=document.querySelector('.contact-form');
contactForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!contactForm.reportValidity())return;
  const data=new FormData(contactForm);
  const status=document.querySelector('#contact-status');
  const button=contactForm.querySelector('button[type="submit"]');
  if(button.disabled)return;
  button.disabled=true;
  button.textContent='Sending…';
  status.hidden=false;
  status.textContent='Sending your message…';
  try{
    const response=await fetch('https://formsubmit.co/ajax/joyelias199@gmail.com',{
      method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({name:data.get('name'),email:data.get('email'),message:data.get('message'),_subject:'New portfolio enquiry',_template:'table'}),
      signal:AbortSignal.timeout(20000)
    });
    const result=await response.json();
    if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('Submission failed');
    button.textContent='Submitted';
    status.replaceChildren(document.createTextNode('Your message has been submitted. Redirecting you to the booking calendar in 3 seconds. '));
    const link=document.createElement('a');link.href='https://calendar.app.google/GkufeMipmunsUhBU8';link.textContent='Open calendar now';status.append(link);
    setTimeout(()=>window.location.assign(link.href),3000);
  }catch(error){
    status.textContent='Your message could not be submitted. Please try again, or email joyelias199@gmail.com. Your details are still here.';
    button.disabled=false;button.textContent='Submit';
  }
});
