import React from 'react';
import heroIllustration from '../assets/photo-rename.png';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#fff8f0] overflow-hidden">
      {/* Background subtle shapes (optional decorative elements) */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-200 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 opacity-20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12 z-10">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left max-w-2xl">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-family-Poppins">
            Healthcare<br /> Made 
            <span className="text-red-700"> Simple</span> & <span className="text-red-700"> Secure</span>
          </h1>
          <p className="mt-8 text-xl text-gray-700 leading-relaxed">
            Connecting doctors, pharmacists, and patients in one comprehensive platform.
          </p>
          <button className="mt-10 inline-block px-10 py-5 bg-red-700 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-red-800 transition duration-300">
            Get Started
          </button>
        </div>

        {/* Illustration Placeholder - Easy to replace */}
        <div className="flex-1 flex justify-center lg:justify-end">
          {/* Replace the src with your illustration URL or import a local image */}
          <img
            src={heroIllustration}
            alt="Healthcare professionals illustration"
            className="w-full max-w-lg lg:max-w-xl object-contain drop-shadow-2xl"
          />
          {/* If you prefer a background illustration:
          <div className="w-full h-96 lg:h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/path-to-your-illustration.png)' }}></div>
          */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;