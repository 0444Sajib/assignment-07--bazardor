import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import ProductSections from "@/components/ProductSections";

export default function Home() {
  return (
    <div>
      <Navbar />
      <PriceTicker />
      <Hero />
      <ProductSections />
    </div>
  );
}