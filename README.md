# Store Management Panel

This is a full-stack CRUD application built with Next.js and PostgreSQL, designed for managing products in a store. The application provides an admin panel where you can add, edit, delete, and view products. It is built with a modern stack that leverages Next.js for both frontend and backend functionality, along with PostgreSQL for database management.

## Features

- **Product Management**: Add new products, edit existing ones, and delete products.
- **Full-Stack Functionality**: Next.js is used for both server-side rendering and API handling.
- **PostgreSQL Database**: The product data is stored in a PostgreSQL database, providing robust querying and data management.

## Technologies Used

- **Next.js**: Handles both the frontend and backend logic, allowing for a seamless user experience.
- **PostgreSQL**: A powerful and scalable relational database used to store product data.
- **Tailwind CSS**: Provides a modern, responsive UI design for the store management panel.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the Postgres container

````bash
docker-compose up --build
````

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
````

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
