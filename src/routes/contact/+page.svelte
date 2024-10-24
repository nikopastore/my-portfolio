<!-- src/routes/contact/+page.svelte -->
<script>
    let email = '';
    let subject = '';
    let body = '';
  
    function handleSubmit(event) {
      event.preventDefault();
  
      const mailtoLink = `mailto:npastore@ucsd.edu?` + new URLSearchParams({
        subject: subject || 'No Subject',
        body: `From: ${email}\n\n${body}`,
      });
  
      console.log('mailto URL:', mailtoLink);
      window.location.href = mailtoLink;
    }
  </script>
  
  <h1>Contact</h1>
  
  <form on:submit|preventDefault={handleSubmit}>
    <label>
      <span>Your Email:</span>
      <input type="email" name="email" bind:value={email} required />
    </label>
    <label>
      <span>Subject:</span>
      <input type="text" name="subject" bind:value={subject} />
    </label>
    <label>
      <span>Message:</span>
      <textarea name="body" bind:value={body} required></textarea>
    </label>
    <button type="submit">Send Message</button>
  </form>
  
  <style>
    /* Add styles specific to the Contact page here */
    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
      max-width: 400px;
    }
    label {
      display: flex;
      flex-direction: column;
    }
    span {
      margin-bottom: 5px;
      font-weight: bold;
    }
    button {
      width: 150px;
    }
  </style>
  