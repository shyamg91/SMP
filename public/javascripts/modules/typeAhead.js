const axios = require('axios');

function searchResultsHTML(projects) {
  return projects.map(project => {
    return `
      <a href="/project/${project.slug}" class="search__result">
        <strong>${project.name}</strong>
      </a>
    `;
  }).join('');
}

function typeAhead(search) {
  if (!search) return;
  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function () {
    if (!this.value) {
      searchResults.style.display = 'none';
      return;
    }

    searchResults.style.display = 'block';
    searchResults.innerHTML = '';

    axios.get(`/api/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          const html = searchResultsHTML(res.data);
          searchResults.innerHTML = html;
        }
        else {
          searchResults.innerHTML = `
            <a class="search__result">
        <strong>No results found</strong>
      </a>
          `
        }
      })
      .catch(err => {
        console.log(err);
      })
  })
}

export default typeAhead;