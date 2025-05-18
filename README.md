# Payment Confirmation Interface

A web application that handles payment confirmations from ESP32 devices via QR codes. This project is built with Next.js, React, and TypeScript.

## Features

- 🔍 QR Code URL Processing
- 💰 Transaction Details Display
- ✅ Payment Confirmation Flow
- 🔒 Challenge-Response Verification
- 💼 Mock Transaction Processing

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd es-assignment
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing the Application

1. Visit the home page for instructions and documentation.

2. Use the sample QR code URL format:
   ```
   http://localhost:3000/pay?tx=TX1001&ch=abc123&amt=9.99
   ```

3. Parameters:
   - `tx`: Transaction ID
   - `ch`: Cryptographic challenge
   - `amt`: Payment amount

## API Endpoints

### POST /api/confirm

Confirms a payment transaction.

Request body:
```json
{
  "tx": "TX1001",
  "challenge": "abc123",
  "response": "signed_abc123",
  "user": "user@example.com"
}
```

Response:
```json
{
  "success": true,
  "transaction": {
    "id": "TX1001",
    "status": "confirmed",
    "amount": 9.99
  }
}
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── confirm/
│   │       └── route.ts
│   ├── pay/
│   │   └── page.tsx
│   ├── success/
│   │   └── page.tsx
│   ├── cancelled/
│   │   └── page.tsx
│   └── page.tsx
└── ...
```

## Development

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint

## Security Considerations

- The current implementation uses a mock signature verification system
- In production, implement proper cryptographic verification
- Add rate limiting and request validation
- Use secure session management
- Implement proper error handling and logging

## License

MIT
