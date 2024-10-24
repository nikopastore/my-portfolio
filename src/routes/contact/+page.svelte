<!-- src/routes/contact/+page.svelte -->
<script>
    let name = '';
    let email = '';
    let message = '';
  
    function handleSubmit(event) {
      event.preventDefault();
  
      const mailto = `mailto:your-email@example.com?` + new URLSearchParams({
        subject: 'Contact Form Submission',
        body: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      });
  
      console.log('mailto URL:', mailto);
  
      window.location.href = mailto;
    }
  </script>
  
  <h1>Contact Me</h1>
  
  <form on:submit|preventDefault={handleSubmit}>
    <label>
      Name:
      <input type="text" bind:value={name} required />
    </label>
    <br />
    <label>
      Email:
      <input type="email" bind:value={email} required />
    </label>
    <br />
    <label>
      Message:
      <textarea bind:value={message} required></textarea>
    </label>
    <br />
    <button type="submit">Send</button>
  </form>
  
  <style>
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    label {
      display: flex;
      flex-direction: column;
    }
  </style>
  