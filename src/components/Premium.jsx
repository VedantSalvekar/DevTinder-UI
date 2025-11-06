import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Premium = () => {
  const user = useSelector((store) => store.user);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const silverPerks = [
    "See who liked your profile",
    "Unlimited Rewinds",
    "1 Boost per month",
    "Priority customer support",
  ];

  const goldPerks = [
    "All Silver features",
    "Unlimited Super Likes",
    "See who viewed your profile",
    "Top profile visibility",
    "5 Boosts per month",
    "Advanced filters",
    "Premium badge on profile",
    "Ad-free experience",
  ];

  const handlePurchase = async (plan) => {
    try {
      const res = await axios.post(
        BASE_URL + "payment/create-checkout-session",
        { plan: plan },
        { withCredentials: true }
      );

      if (res.data.success && res.data.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (err) {
      setToastMessage(
        err.response?.data?.message || "Failed to process payment"
      );
      setToastType("error");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  return (
    <>
      <div className="min-h-screen py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Upgrade to DevTinder Premium
            </h1>
            <p className="text-lg opacity-70">
              Find your perfect match faster with premium features
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Silver Package */}
            <div className="card bg-base-300 shadow-2xl border-2 border-gray-600 hover:border-gray-400 transition-all duration-300">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title text-3xl">
                    <span className="text-gray-400"></span> Silver
                  </h2>
                  <div className="badge badge-lg badge-outline">Popular</div>
                </div>

                <div className="mb-6">
                  <div className="text-4xl font-bold mb-2">
                    $9.99
                    <span className="text-lg font-normal opacity-70">
                      /month
                    </span>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-lg mb-4">
                    What's included:
                  </h3>
                  {silverPerks.map((perk, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div> - </div>

                      <span className="text-base">{perk}</span>
                    </div>
                  ))}
                </div>

                <div className="card-actions justify-center mt-4">
                  <button
                    className="btn btn-primary btn-lg w-full"
                    onClick={() => handlePurchase("silver")}
                  >
                    Get Silver
                  </button>
                </div>
              </div>
            </div>

            {/* Gold Package */}
            <div className="card bg-base-300 shadow-2xl border-2 border-yellow-600 hover:border-yellow-400 transition-all duration-300 relative">
              {/* Best Value Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="badge badge-secondary badge-lg px-6 py-4 text-sm font-bold">
                  BEST VALUE
                </div>
              </div>

              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title text-3xl">
                    <span className="text-yellow-500"></span> Gold
                  </h2>
                  <div className="badge badge-lg badge-warning">Premium</div>
                </div>

                <div className="mb-6">
                  <div className="text-4xl font-bold mb-2">
                    $19.99
                    <span className="text-lg font-normal opacity-70">
                      /month
                    </span>
                  </div>
                  <div className="text-sm opacity-60">
                    Save 33% compared to features
                  </div>
                </div>

                <div className="divider"></div>

                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Everything in Silver, plus:
                  </h3>
                  {goldPerks.map((perk, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div> - </div>
                      <span className="text-base font-medium">{perk}</span>
                    </div>
                  ))}
                </div>

                <div className="card-actions justify-center mt-4">
                  <button
                    className="btn btn-warning btn-lg w-full"
                    onClick={() => handlePurchase("gold")}
                  >
                    Get Gold
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-12 opacity-70">
            <p className="mb-2">
              All plans include a 7-day free trial. Cancel anytime.
            </p>
            <p className="text-sm">
              Secure payment processing. Your data is protected.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast toast-top toast-center pt-20">
          <div className={`alert alert-${toastType}`}>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Premium;
