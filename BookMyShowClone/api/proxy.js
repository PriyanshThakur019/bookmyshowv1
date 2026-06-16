export default async function handler(req, res) {
  const { endpoint } = req.query;
  const baseUrl = 'https://spring-boot-tutorial-8yy3.onrender.com';
  
  try {
    const url = `${baseUrl}/${endpoint}`;
    
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // If there's a body, include it
    if (req.body && Object.keys(req.body).length > 0) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
