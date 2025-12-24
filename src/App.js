import Navbar from "./components/Navbar";
import HeroSection from "./components/HomePage/HeroSection";
import RoleSection from "./components/HomePage/RoleSection";
import FeaturesSection from "./components/HomePage/FeaturesSection";
import WhatWeDoSection from "./components/HomePage/WhatWeDoSection";

function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <RoleSection />
      <FeaturesSection />
      <WhatWeDoSection /> 
      <main>
        <h1>Welcome to Medicus</h1>
          <h1 className="text-3xl font-bold underline text-blue-600">
      Hello world!
    </h1>
      </main>
    </>
  );
}

export default App;
