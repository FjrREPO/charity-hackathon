/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com', 'lh3.googleusercontent.com', 'ramps.normi.es', 'walletconnect.org', 'www.coinbase.com'],
    },
    webpack: config => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding')
        return config
    }
};

export default nextConfig;