import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ChooseRoleSection from "./components/RoleSection";


function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ChooseRoleSection />
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
