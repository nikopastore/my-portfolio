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

    console.log('Generated mailto URL:', mailtoLink);
    window.location.href = mailtoLink;
  }
</script>

<section class="contact-container max-w-2xl mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">Contact Me</h1>

  <form on:submit|preventDefault={handleSubmit} class="contact-form">
    <label class="form-label">
      <span class="form-label-text">Your Email:</span>
      <input
        type="email"
        name="email"
        bind:value={email}
        required
        placeholder="Enter your email"
        class="form-input"
      />
    </label>
    <label class="form-label">
      <span class="form-label-text">Subject:</span>
      <input
        type="text"
        name="subject"
        bind:value={subject}
        placeholder="Enter the subject"
        class="form-input"
      />
    </label>
    <label class="form-label">
      <span class="form-label-text">Message:</span>
      <textarea
        name="body"
        bind:value={body}
        required
        placeholder="Enter your message"
        class="form-textarea"
      ></textarea>
    </label>
    <button
      type="submit"
      class="w-full bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-200"
    >
      Send Message
    </button>
  </form>
</section>

<style>
  .contact-container {
    background-color: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-label {
    display: flex;
    flex-direction: column;
  }

  .form-label-text {
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #4b5563; /* Tailwind's gray-600 */
  }

  .form-input,
  .form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db; /* Tailwind's gray-300 */
    border-radius: 0.375rem;
    background-color: #f9fafb; /* Tailwind's gray-50 */
    color: #111827; /* Tailwind's gray-900 */
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #6366f1; /* Tailwind's indigo-500 */
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3); /* Indigo focus ring */
  }

  .form-textarea {
    resize: vertical;
    min-height: 6rem;
  }

  button {
    padding: 0.75rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
  }

  button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3); /* Indigo focus ring */
  }
</style>
