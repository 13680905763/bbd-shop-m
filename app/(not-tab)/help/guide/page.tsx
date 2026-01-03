"use client";

import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiShoppingCart,
  FiCreditCard,
  FiUsers,
  FiPackage,
  FiBox,
  FiTruck,
  FiGift,
} from "react-icons/fi";

type StepItem = {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

export default function BeginnerGuide() {
  const router = useRouter();

  const steps: StepItem[] = [
    {
      title: "Step 1: Choose Products",
      icon: <FiSearch />,
      content: (
        <>
          <p>
            Method 1: Copy a product link from Taobao / Tmall / 1688 and paste
            it into the bbdbuy search bar.
          </p>
          <p>Method 2: Search by product name and select recommended items.</p>
          <p>Method 3: Use image search to find similar products.</p>

          <div className="tip">
            If the link opens a DIY order page, the product requires manual
            purchase. Fill in details and click “Buy Now” or “Add to Cart”.
          </div>
        </>
      ),
    },
    {
      title: "Step 2: Submit Order",
      icon: <FiShoppingCart />,
      content: (
        <>
          <p>
            bbdbuy supports auto-fetching product details for most platforms.
          </p>
          <p>Select options, quantity, then add to cart or buy directly.</p>
          <p>You can also submit orders from the cart.</p>
        </>
      ),
    },
    {
      title: "Step 3: Pay for the Order",
      icon: <FiCreditCard />,
      content: (
        <>
          <p>
            Pay for the product and domestic shipping within China after
            submitting the order.
          </p>
          <div className="tip">
            Multiple currencies supported. Choose destination country, services,
            and submit.
          </div>
        </>
      ),
    },
    {
      title: "Step 4: Purchasing by bbdbuy",
      icon: <FiUsers />,
      content: (
        <>
          <p>
            The bbdbuy purchasing team will contact the seller and buy the
            product.
          </p>
          <div className="tip">
            Order status: Pending Purchase → Ordered → Shipped → Delivered →
            Arrived → Warehoused.
          </div>
        </>
      ),
    },
    {
      title: "Step 5: Inspection and Storage",
      icon: <FiPackage />,
      content: (
        <>
          <p>Products are inspected, weighed, and photographed upon arrival.</p>
          <p>3 free photos included, 90 days free storage.</p>
          <div className="tip">
            Items stored over 180 days will be discarded automatically.
          </div>
        </>
      ),
    },
    {
      title: "Step 6: Submit Parcel",
      icon: <FiBox />,
      content: (
        <>
          <p>
            Go to the Warehouse page, select items, submit parcel, and fill in
            shipping details.
          </p>
          <div className="tip">
            Shipping routes depend on item restrictions and destination.
          </div>
        </>
      ),
    },
    {
      title: "Step 7: Pay International Shipping Deposit",
      icon: <FiCreditCard />,
      content: (
        <>
          <p>
            Pay international shipping deposit including customs and service
            fees.
          </p>
          <div className="tip">
            Shipping cost will be recalculated; differences will be refunded or
            charged.
          </div>
        </>
      ),
    },
    {
      title: "Step 8: bbdbuy Ships the Parcel",
      icon: <FiTruck />,
      content: (
        <>
          <p>The warehouse packs, weighs, labels, and ships the parcel.</p>
          <div className="tip">
            Track parcel status in the Package Details page.
          </div>
        </>
      ),
    },
    {
      title: "Step 9: Confirm Receipt & Rewards",
      icon: <FiGift />,
      content: (
        <>
          <p>Confirm receipt after delivery to earn reward points.</p>
          <div className="tip">
            Reach 500 points to redeem rewards. Contact customer service for
            help.
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <NavBar onBack={() => router.push("/")}>
        <span className="text-lg font-bold text-gray-900">
          How to Purchase via bbdbuy
        </span>
      </NavBar>
      <div className="mx-auto max-w-[420px] flex-1 space-y-6 overflow-auto bg-[#f5f5f5] p-4 px-4 py-6">
        <div className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2 text-primary">
                <span className="text-lg">{step.icon}</span>
                <h2 className="font-medium">{step.title}</h2>
              </div>

              <div className="flex flex-col gap-2 text-sm text-gray-700">
                {step.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
