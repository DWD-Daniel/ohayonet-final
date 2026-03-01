# Ohayonet Pharmacy - E-Commerce Platform

A modern, responsive pharmacy e-commerce website with integrated Paystack payment processing, built with React, TypeScript, and Tailwind CSS.

## Features

### Core Functionality
- 🛍️ Product catalog with categories (Drugs, Non-Drugs, Medical Devices)
- 🔍 Real-time product search
- 🏷️ Product filtering by subcategories
- 📱 Fully responsive design (mobile, tablet, desktop)
- 💳 Secure payment processing with Paystack
- 🗄️ Transaction recording in Neon PostgreSQL database

### Payment Integration
- **Paystack Inline Popup** for seamless checkout experience
- **Server-side verification** for security
- **Real-time transaction recording**
- Loading states and user feedback
- Test mode for development

### User Interface
- Clean, professional design
- Smooth animations and transitions
- Category carousels
- New arrivals and special discounts sections
- Product cards with images, prices, and badges
- Success/error modal dialogs

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **Netlify Functions** - Serverless backend
- **Neon PostgreSQL** - Database
- **Paystack API** - Payment processing

### Infrastructure
- **Netlify** - Hosting and deployment
- **Neon** - Managed PostgreSQL database
- **GitHub/GitLab** - Version control

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Paystack account ([sign up here](https://paystack.com))
- Netlify account ([sign up here](https://netlify.com))

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ohayonet2/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Paystack keys
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## Documentation

Comprehensive guides are available:

1. **[QUICK_START.md](./QUICK_START.md)** - Get up and running in minutes
2. **[PAYSTACK_SETUP.md](./PAYSTACK_SETUP.md)** - Detailed Paystack configuration
3. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Step-by-step deployment to Netlify

## Project Structure

```
ohayonet2/project/
├── netlify/
│   └── functions/
│       └── verify-payment.js       # Payment verification endpoint
├── src/
│   ├── components/
│   │   ├── Carousel.tsx           # Product carousel
│   │   ├── Navigation.tsx         # Main navigation
│   │   ├── SearchBar.tsx          # Search functionality
│   │   └── PaystackCheckout.tsx   # Payment integration
│   ├── data/
│   │   └── categories.ts          # Product data
│   ├── pages/
│   │   ├── HomePage.tsx           # Landing page
│   │   ├── NewProductsPage.tsx    # Products listing
│   │   └── ContactPage.tsx        # Contact form
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html                      # HTML template
├── netlify.toml                    # Netlify configuration
├── package.json                    # Dependencies
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
└── .env.example                    # Environment variables template
```

## Environment Variables

Required environment variables:

```env
# Frontend (Vite - must have VITE_ prefix)
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx

# Backend (Netlify Functions)
PAYSTACK_SECRET_KEY=sk_test_xxxxx
DATABASE_URL=postgresql://...
```

**Security Note:** Never commit `.env` file to version control. Always use `.env.example` as a template.

## Database Schema

### Transactions Table

```sql
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  email text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  verified_at timestamptz DEFAULT now()
);
```

**Security:** Row Level Security (RLS) enabled with policies for authenticated access.

## Payment Flow

1. User clicks "Buy" button on product
2. Paystack Inline popup opens
3. User completes payment with card details
4. Frontend receives payment reference
5. Backend verifies transaction with Paystack API
6. Transaction saved to Neon database
7. User receives confirmation

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type checking
npm run typecheck
```

### Testing Payments

Use Paystack test cards in development:

**Successful Payment:**
- Card: 4084084084084081
- CVV: 123
- Expiry: Any future date
- PIN: 1234

## Deployment

### Deploy to Netlify

1. Push code to GitHub/GitLab
2. Import project in Netlify
3. Add Neon database integration
4. Configure environment variables
5. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Security

- ✅ Server-side payment verification
- ✅ Environment variables for secrets
- ✅ HTTPS encryption (Netlify)
- ✅ Database RLS policies
- ✅ No hardcoded API keys
- ✅ Input validation and sanitization

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions:
- Payment issues: Check [PAYSTACK_SETUP.md](./PAYSTACK_SETUP.md)
- Deployment issues: Check [DEPLOYMENT.md](./DEPLOYMENT.md)
- Paystack support: support@paystack.com
- Technical documentation: See docs/ folder

## Acknowledgments

- Paystack for payment processing
- Netlify for hosting and serverless functions
- Neon for managed PostgreSQL database
- Unsplash/Pexels for product images

---

Built with ❤️ for Ohayonet Pharmacy
