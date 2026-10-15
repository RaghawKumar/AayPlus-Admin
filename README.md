# AayPlus admin

Next.js administrator panel for the separate AayPlus Node.js API. Review members, listings, bookings, private inspection evidence, disputes and accounting intentions.

## Run

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Preserve an existing `.env.local` instead of overwriting it. Open `http://localhost:3000`. Set `NEXT_PUBLIC_API_BASE_URL` to the backend's `/api/v1` address and restart Next.js after changes.

## First administrator

Register/sign in with a mobile number first. From the **backend checkout**, grant the account admin access:

```sh
npm run admin:promote -- promote-admin +91YOUR_MOBILE_NUMBER
```

Return to the panel and request a new OTP. Admin accounts are never created from a frontend role field.

## Validate

```sh
npm run lint
npm run build
```

## Guides

- [Full setup](docs/INTEGRATION.md)
- [Product and review flow](docs/APP-FLOW.md)
- [UI review](docs/UX-REVIEW.md)
- [Three-repository workspace](docs/REPOSITORIES.md)

Sessions stay in tab memory. Verification is development-only until a real provider is configured. Ledger entries are accounting intentions, not executed payments.
