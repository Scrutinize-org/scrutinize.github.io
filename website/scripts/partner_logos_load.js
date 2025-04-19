
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector('.press-inline-logos');

    // fallback: add class immediately in case observer misses it
    section.classList.add('in-view');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('in-view');
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);

    // Load articles
    fetch('https://scrutinize-org.github.io/scrutinize.github.io/articles.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(articles => {
        const container = document.getElementById('articles-container');

        articles.slice(0, 3).forEach(article => {
          const card = document.createElement("div");
          card.classList.add("article-card");
          card.innerHTML = `
            <a href="${article.url}" target="_blank" style="text-decoration: none; color: inherit;">
              <img src="${article.image}" alt="${article.title}">
              <div class="article-card-content">
                <h3>${article.title}</h3>
                <p class="publication">${article.publication || 'Unknown Publication'}</p>
              </div>
            </a>`;
          container.appendChild(card);
        });
      })
      .catch(error => console.error('Error loading JSON:', error));
  });
</script>