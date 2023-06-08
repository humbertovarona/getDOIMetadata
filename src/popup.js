document.addEventListener('DOMContentLoaded', function() {
    var extractButton = document.getElementById('extractButton');
    var doiInput = document.getElementById('doiInput');
    var resultTextarea = document.getElementById('resultTextarea');
    var copyButton = document.getElementById('copyButton');
    var clearButton = document.getElementById('clearButton');
  
    extractButton.addEventListener('click', function() {
      var doi = doiInput.value;
      if (doi) {
        fetchMetadata(doi)
          .then(formatMetadata)
          .then(displayFormattedMetadata)
          .catch(handleError);
      }
    });
  
    copyButton.addEventListener('click', function() {
      resultTextarea.select();
      document.execCommand('copy');
    });
  
    clearButton.addEventListener('click', function() {
      doiInput.value = '';
      resultTextarea.value = '';
    });
  
    doiInput.addEventListener('input', function() {
      if (!doiInput.value && !resultTextarea.value) {
        return; // Do nothing if both the edit box and text area are empty
      }
    });
  
    function fetchMetadata(doi) {
      var url = 'https://api.crossref.org/works/' + encodeURIComponent(doi);
      return fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          return data.message;
        });
    }
  
    function formatMetadata(metadata) {
    var formattedMetadata = 'Author';
  
    // Format the authors in APA style
    if (metadata.author && metadata.author.length > 0) {
      formattedMetadata += ': ';
      var authors = [];
      for (var i = 0; i < metadata.author.length; i++) {
        var author = metadata.author[i];
        if (author.given && author.family) {
          var formattedAuthor = author.family + ', ' + author.given.charAt(0) + '.';
          authors.push(formattedAuthor);
        }
      }
      formattedMetadata += authors.join(', ');
      formattedMetadata += '\n';
    }
  
    // Format the publication date
    if (metadata.published && metadata.published['date-parts'] && metadata.published['date-parts'].length > 0) {
      var dateParts = metadata.published['date-parts'][0];
      var year = dateParts[0];
      var month = dateParts[1] || '';
      var day = dateParts[2] || '';
  
      formattedMetadata += 'Year';
      if (month) {
        formattedMetadata += ', Month';
        if (day) {
          formattedMetadata += ' Day';
        }
      }
      formattedMetadata += ': ' + year;
      if (month) {
        formattedMetadata += ', ' + formatMonth(month);
        if (day) {
          formattedMetadata += ' ' + day;
        }
      }
      formattedMetadata += '\n';
    }
  
    // Format the title
    if (metadata.title && metadata.title.length > 0) {
      formattedMetadata += 'Title: ' + metadata.title[0] + '\n';
    }
  
    // Format the source
    if (metadata['container-title'] && metadata['container-title'].length > 0) {
      formattedMetadata += 'Source: ' + metadata['container-title'][0] + '\n';
    }
  
    // Format the volume
    if (metadata.volume) {
      formattedMetadata += 'Volume: ' + metadata.volume + '\n';
    }
  
    // Format the issue
    if (metadata.issue) {
      formattedMetadata += 'Issue: ' + metadata.issue + '\n';
    }
  
    // Format the pages
    if (metadata.page) {
      formattedMetadata += 'Pages: ' + metadata.page + '\n';
    }
  
    // Format the publisher
    if (metadata.publisher) {
      formattedMetadata += 'Publisher: ' + metadata.publisher + '\n';
    }
  
    // Format the DOI
    if (metadata.DOI) {
      formattedMetadata += 'DOI: ' + metadata.DOI + '\n';
    }
  
    return formattedMetadata;
  }

  function formatMonth(month) {
    var months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ];
    
    return months[month - 1] || '';
  }
    
  function displayFormattedMetadata(formattedMetadata) {
    resultTextarea.value = formattedMetadata;
  }
  
  function handleError(error) {
    resultTextarea.value = 'Error: ' + error.message;
  }
});
  