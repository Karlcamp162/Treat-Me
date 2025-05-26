import React from 'react';
import MyNavbar from '../components/Navbar';

const AboutUs = () => {
  return (
    <div className="font-sans bg-yellow-50 text-gray-800 min-h-screen">
      {/* Navbar */}
      <MyNavbar />

      {/* Hero Section */}
      <div className="relative bg-blue-500 text-white">
        <div className="bg-black bg-opacity-50 h-full w-full absolute top-0 left-0" />
        <div className="relative z-10 text-center py-20 px-6 md:px-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Welcome to Treat Me!</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Delivering joy through flavor – Treat yourself to the ultimate comfort food experience.
          </p>
        </div>
      </div>

      {/* About Us Content */}
      <div className="py-16 px-4 md:px-16 bg-yellow-300">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-yellow-800">Our Mission</h2>
            <p className="text-lg text-gray-700">
              At Treat Me, we’re dedicated to serving meals that are not only delicious but made with love, care, and quality ingredients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
              <div className="text-yellow-600 text-4xl mx-auto mb-4">🍗</div>
              <h3 className="text-xl font-semibold mb-2">Crispy Chicken</h3>
              <p className="text-sm text-gray-600">Golden, crunchy, and seasoned to perfection.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
              <div className="text-yellow-600 text-4xl mx-auto mb-4">🍦</div>
              <h3 className="text-xl font-semibold mb-2">Sweet Treats</h3>
              <p className="text-sm text-gray-600">Satisfy your sweet tooth with our rich desserts.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
              <div className="text-yellow-600 text-4xl mx-auto mb-4">🥤</div>
              <h3 className="text-xl font-semibold mb-2">Cool Drinks</h3>
              <p className="text-sm text-gray-600">Refresh with our chill beverages and sodas.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
              <div className="text-yellow-600 text-4xl mx-auto mb-4">🍖</div>
              <h3 className="text-xl font-semibold mb-2">Tasty Pork Dishes</h3>
              <p className="text-sm text-gray-600">Savor hearty pork meals, slow-cooked with love.</p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-yellow-800 mb-3">Join the Treat Me Family</h2>
            <p className="text-lg text-gray-700">
              Whether you're grabbing a snack, sharing a meal with friends, or celebrating with ice cream, Treat Me brings joy to your table.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-yellow-600 text-white text-center py-4 mt-8">
        <p>&copy; {new Date().getFullYear()} Treat Me. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
