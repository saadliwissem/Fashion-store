# Checkout Prompt — Required & Optional Inputs

Use this brief sheet to provide the data needed for the `#sym:Checkout` component. Give values as plain text or JSON where useful.

## Required fields
- `firstName`: Customer first name (string)
- `lastName`: Customer last name (string)
- `email`: Valid email (string)
- `phone`: Tunisian phone number (8 digits, starting with 2-9) (string)
- `governorate`: One of the Tunisian governorates (string)
- `city`: City name (string)
- `address`: Street address (string)
- `shippingMethod`: One of `standard`, `express`, `pickup`
- `paymentMethod`: One of `card`, `cod`, `mobile`, `bank`

## Conditional required fields
- If `paymentMethod` is `card`:
  - `cardName` (string)
  - `cardNumber` (string, 16-digit preferred; spaces allowed)
  - `cardExpiry` (MM/YY)
  - `cardCVC` (3-digit)

## Optional fields
- `zipCode` (string)
- `address2` (string)
- `saveAddress` (boolean) — whether to save address to profile
- `saveCard` (boolean) — whether to save card (demo only)
- `notes` (string) — customer order notes

## Cart context
- `cart.items`: Array of cart items (each item should include `product.id`, `product.price`, `quantity`).
- `cart.summary` (optional): `{ subtotal, itemCount, totalItems }` — if present, the component will use it.

## Validation hints
- `email` must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- `phone` should be normalized (remove non-digits) and match `^[2-9][0-9]{7}$`.
- `cardNumber` should be numeric (spaces allowed) and at least 16 digits when stripped.
- `cardExpiry` must be `MM/YY`.

## Example minimal JSON (required only)
{
  "firstName": "Ali",
  "lastName": "Ben",
  "email": "ali@example.tn",
  "phone": "21650123456",
  "governorate": "Tunis",
  "city": "Tunis",
  "address": "123 Habib Bourguiba",
  "shippingMethod": "standard",
  "paymentMethod": "cod",
  "cart": {
    "items": [ { "product": { "id": "p1", "price": 25 }, "quantity": 2 } ]
  }
}

## Example full JSON (card payment)
{
  "firstName": "Amina",
  "lastName": "Saad",
  "email": "amina@example.tn",
  "phone": "21629765432",
  "governorate": "Sfax",
  "city": "Sfax",
  "zipCode": "3000",
  "address": "Rue de la Republique 10",
  "address2": "Apt 5",
  "shippingMethod": "express",
  "paymentMethod": "card",
  "cardName": "Amina Saad",
  "cardNumber": "4242 4242 4242 4242",
  "cardExpiry": "12/26",
  "cardCVC": "123",
  "saveAddress": true,
  "saveCard": false,
  "notes": "Leave at reception if not home",
  "cart": {
    "items": [ { "product": { "id": "p2", "price": 80 }, "quantity": 1 } ],
    "summary": { "subtotal": 80, "itemCount": 1, "totalItems": 1 }
  }
}

## Usage notes
- Provide phone either with or without country code; the component strips non-digits.
- For testing card payments use dummy data; real payments are not processed here.
- If you need to force a shipping price, set `shippingMethod` accordingly: `standard` (7.0), `express` (15.0), `pickup` (0.0).

---
File created to support quick inputs for `#sym:Checkout` during testing or prompts.
