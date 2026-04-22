const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchFromApi(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;

    // Default headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Automatically stringify body if it's an object
    let body = options.body;
    if (body && typeof body === 'object') {
        body = JSON.stringify(body);
    }

    const response = await fetch(url, {
        ...options,
        headers,
        body
    });

    // Safely parse JSON — avoid the "Unexpected token '<'" error on HTML responses
    const contentType = response.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
        data = await response.json();
    } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response (${response.status}): ${text.substring(0, 100)}`);
    }

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}
