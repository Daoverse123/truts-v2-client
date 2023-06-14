import fetch from 'node-fetch';


export default async (req, res) => {
    try {
        // Get the image URL from the query parameters
        const imageUrl = req.query.url;

        // Fetch the image data
        const response = await fetch(imageUrl);

        // Get the image data as a Readable stream
        const imageStream = response.body;

        // Set the appropriate headers for the image response
        res.setHeader('Content-Type', response.headers.get('Content-Type') || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Adjust cache control headers as needed

        // Pipe the image data to the response
        imageStream.pipe(res);
    } catch (error) {
        console.error('Error proxying image:', error);
        res.status(500).end();
    }
};
