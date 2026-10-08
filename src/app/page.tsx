import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";

export default function Home() {
  return (
    <div>
      <Navbar />
      <PriceTicker />
      <Hero />
    </div>
  );
}