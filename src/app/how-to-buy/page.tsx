import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "How to Buy",
  description:
    "Learn how to buy premium accounts easily at DigiShop — from login to payment and account delivery.",
};

export default function HowToBuyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          How to Buy from{" "}
          <span className="logo-highlight">
            DigiShop
          </span>
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Follow these simple steps to purchase your favorite premium accounts securely and quickly.
        </p>

        <div className="space-y-10">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-shrink-0 bg-blue-100 text-blue-700 font-bold rounded-full w-12 h-12 flex items-center justify-center text-lg">
                {step.number}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{step.title}</h2>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Explore Our Products
          </Link>
        </div>
      </section>
    </main>
  );
}

const steps = [
  {
    number: 1,
    title: "Log In",
    description: "Sign in to your DigiShop account to start your purchase. If you don’t have one, please register first.",
  },
  {
    number: 2,
    title: "Choose Your Account Type",
    description: "Select the type of account you want to buy. Note: only one account of each app type can be purchased per order.",
  },
  {
    number: 3,
    title: "Check Cart Details",
    description: "Review your cart to confirm product type, quantity, and total price before proceeding.",
  },
  {
    number: 4,
    title: "Choose Payment Method",
    description: "Select your preferred payment method — MoMo or VNPay — to complete your purchase.",
  },
  {
    number: 5,
    title: "Confirm the Order",
    description: "Double-check all information and confirm your order before payment.",
  },
  {
    number: 6,
    title: "Complete Payment Within 30 Minutes",
    description: "Make your payment within 30 minutes. Unpaid orders after this time will be automatically canceled.",
  },
  {
    number: 7,
    title: "Check Your Email",
    description: "Once payment is successful, check your registered email to get the username and password for your purchased account.",
  },
];
