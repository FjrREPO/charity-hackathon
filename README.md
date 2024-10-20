<br/>
<div align="center">
<a href="https://github.com/FjrREPO/charity-hackathon">
<img src="https://res.cloudinary.com/dutlw7bko/image/upload/v1728721738/charity-hackathon/logo-musang_raixov.png" alt="Logo" width="80" height="80">
</a>
<h3 align="center">Musang Charity</h3>
</div>

# Verifiable Donation Platform

A decentralized donation platform built with Next.js that enables transparent and verifiable donations using ZK-TLS proofs. Users can make donations in USDC and generate cryptographic proofs of their transactions.

![Contributors](https://img.shields.io/github/contributors/FjrREPO/charity-hackathon?color=dark-green) ![Issues](https://img.shields.io/github/issues/FjrREPO/charity-hackathon) ![License](https://img.shields.io/github/license/FjrREPO/charity-hackathon)

# Demo

[![Demo Video](https://res.cloudinary.com/dutlw7bko/image/upload/v1729407022/charity-hackathon/WhatsApp_Image_2024-10-19_at_23.59.02_ijrnnr.jpg)](https://res.cloudinary.com/dutlw7bko/video/upload/v1729405439/charity-hackathon/1020_gt50mb.mp4)

## 🌟 Features

### Home Page

- Overview of the platform and its mission
- Real-time donation statistics and impact metrics
- Easy wallet connection using Web3 providers
- Detailed explanation of the verification process

### Donation System

- Browse available donation items
- USDC payment integration
- Real-time price conversion
- Transaction history
- Smart contract interaction for secure donations

### Proof Generation

- ZK-TLS proof generation for each transaction
- Interactive proof verification system
- Transaction proof history
- Proof status monitoring

## 🔧 Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Blockchain**: Base Network
- **Smart Contracts**: Solidity
- **Styling**: Tailwind CSS
- **Web3 Integration**: wagmi, viem
- **Authentication**: Web3 wallet connection
- **Proof System**: ZK-TLS Protocol
- **State Management**: TanStack Query

## 🚀 Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

1. Clone the repository

```bash
git clone https://github.com/FjrREPO/charity-hackathon.git
```

2. Install dependencies

```bash
cd charity-hackathon
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in the required environment variables:

```env
RECLAIM_ID=your_project_id
```

4. Run the development server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 💻 Usage

### Connecting Wallet

1. Click "Connect Wallet" button on the navigation bar
2. Select your preferred Web3 wallet
3. Accept the connection request

### Making a Donation

1. Navigate to the Donation page
2. Select the item you want to donate to
3. Enter the donation amount in USDC
4. Approve USDC spending
5. Confirm the transaction in your wallet

### Generating Proof

1. Go to the Proof page
2. Select the transaction you want to verify
3. Click "Generate Proof"
4. Follow the proof generation steps
5. View and verify your proof

## 🔐 Smart Contract Integration

The platform integrates with the following smart contracts:

1. DonationProof Contract

```solidity
address: [contract_address]
network: Base
```

2. USDC Contract

```solidity
address: [contract_address]
network: Base
```

## 🛠 Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/amazing-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m 'Add amazing feature'
```

5. Push to the branch

```bash
git push origin feature/amazing-feature
```

6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Important Links

- [Smart Contract Documentation](https://book.getfoundry.sh/)
- [Reclaim Documentation](https://docs.reclaimprotocol.org/)

## 🌟 Acknowledgments

- ZK-TLS Protocol
- Reclaim Protocol
- OpenZeppelin Contracts
- Base Network

## ⚠️ Security

If you discover any security issues, please email security@yourplatform.com instead of using the issue tracker.

## 💡 Support

For support, please join our [Discord community](your-discord-link) or open an issue in the repository.
