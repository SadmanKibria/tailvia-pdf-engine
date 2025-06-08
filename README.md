# Typst PDF Compiler API

A simple API that takes a Typst template with `{{placeholders}}` and JSON data, fills it in, compiles the Typst code to PDF and returns the result as a downloadable file.

## Features
- No logging or rate limits
- Works with Render.com free tier
- Fully isolated and private

## Usage
1. Deploy this repo to Render
2. Make a POST request to `/compile`

### Request Example
```json
{
  "template": "Hello, {{name}}!",
  "data": { "name": "Sadman" }
}
```

### Response
- A downloadable PDF with your injected content.

## Why?
You can’t use Supabase edge functions because they don’t allow installing custom CLI tools like Typst. This microservice is standalone and perfect for SaaS tools like Tailvia.

## License
MIT
