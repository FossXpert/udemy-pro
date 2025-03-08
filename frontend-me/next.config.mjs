/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com', 'img.icons8.com', 'source.unsplash.com', 'blog-card-gfe.vercel.app', 's.udemycdn.com']
    },
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, // replace with your domain
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
                ]
            }
        ];
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://udemy-pro-backend.vercel.app/api/:path*' // replace with your API URL
            }
        ];
    }
};

export default nextConfig;
