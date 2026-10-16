# AayPlus admin

Next.js administrator panel for the separate AayPlus Node.js API. Review members, listings, bookings, private inspection evidence, disputes and accounting intentions.

## Run

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Preserve an existing `.env.local` instead of overwriting it. Open `http://localhost:3000`. The default API is `https://aayplus-backend.onrender.com/api/v1`; set `NEXT_PUBLIC_API_BASE_URL` to override it, then restart Next.js.

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

## Local admin with the live backend

`npm run dev` sends browser API requests through the local `/api/v1` route to
NEXT_PUBLIC_API_BASE_URL. This works on localhost and LAN URLs such as
http://192.168.1.29:3000 without adding each address to Render CORS. The proxy
forwards the user's bearer token and preserves backend authorization and OTP
behavior. It is disabled in production; the live admin keeps its direct API URL.
Restart Next.js after changing `.env.local`. In static OTP mode, request a code
and enter the configured test code (currently 123456); no SMS is sent and the
backend does not return the static code.
