const handleError = (message) => {
  const errorEl = document.getElementById('errorMessage');
  if (!errorEl) return;

  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
};


const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const result = await response.json();

  const errorEl = document.getElementById('errorMessage');
  if (errorEl) errorEl.classList.add('hidden');

  if (result.redirect) {
    window.location = result.redirect;
  }

  if (result.error) {
    handleError(result.error);
  }

  if (handler) {
    handler(result);
  }
};

const submitScore = async (gameType, score) => {
  try {
    const response = await fetch('/submitScore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        gameType,
        score,
      }),
    });

    return await response.json();
  } catch (err) {
    console.error('submitScore error:', err);
    handleError('Failed to submit score');
  }
};

const hideError = () => {
  const errorEl = document.getElementById('errorMessage');
  if (!errorEl) return;

  errorEl.classList.add('hidden');
};

module.exports = {
  handleError,
  sendPost,
  submitScore,
  hideError,
}