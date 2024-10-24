<!-- src/routes/cv/+page.svelte -->
<script>
    // No additional JavaScript needed for this page
  </script>
  
  <h1>Resume</h1>
  
  <section>
    <h2>Personal Information</h2>
    <p>
      Nikolai Pastore<br />
      Email: <a href="mailto:npastore@ucsd.edu">npastore@ucsd.edu</a><br />
    </p>
  </section>
  
  <section>
    <h2>Education</h2>
    <article>
      <h3>Bachelor of Psychology in Business Psychology</h3>
      <p>University of California, San Diego</p>
      <p>
        <time datetime="2020-09">September 2020</time> to
        <time datetime="2022-06">June 2022</time>
      </p>
    </article>
    <article>
      <h3>Master of Science in Applied Data Science</h3>
      <p>University of California, San Diego</p>
      <p>
        <time datetime="2023-09">September 2023</time> to
        <time datetime="2025-06">June 2025</time>
      </p>
    </article>
  </section>
  
  <section>
    <h2>Work Experience</h2>
    <article>
      <h3>Data Engineering Internship at Routeware, Inc.</h3>
      <p>Built company-wide data dictionary and completed customer ad-hoc tasks</p>
      <p>
        <time datetime="2023-05">May 2023</time> to
        <time datetime="2023-08">August 2023</time>
      </p>
    </article>
    <article>
      <h3>Data Engineer at Routeware, Inc.</h3>
      <p>Currently working on scalable data solutions.</p>
      <p>
        <time datetime="2023-08">August 2023</time> to Present
      </p>
    </article>
  </section>
  
  <style>
    /* Add styles specific to the CV page here */
    h1 {
      margin-bottom: 20px;
    }
    section {
      margin-bottom: 30px;
    }
    h2 {
      margin-bottom: 15px;
    }
    article {
      margin-bottom: 20px;
    }
  </style>
  