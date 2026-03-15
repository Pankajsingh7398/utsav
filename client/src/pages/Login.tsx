import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F3] via-white to-[#FAF8F3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-[#E8D5C4] p-8 shadow-lg">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B1538] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              ✨
            </div>

            <h1 className="text-3xl font-bold text-[#2C2C2C] mb-2">
              UtsavMitra
            </h1>

            <p className="text-[#8B8B8B]">Har Khushi Ka Saathi</p>
          </div>

          <div className="space-y-6">

            <p className="text-center text-[#2C2C2C] font-medium">
              Continue to access your bookings and manage events
            </p>

            <Button
              onClick={() => setLocation("/my-bookings")}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E8745B] text-white hover:from-[#8B1538] hover:to-[#D4AF37] transition-all duration-300 font-semibold py-6 text-lg"
            >
              Continue
            </Button>

          </div>

          <div className="mt-8 pt-6 border-t border-[#E8D5C4]">
            <p className="text-xs text-[#8B8B8B] text-center">
              Welcome to UtsavMitra
            </p>
          </div>

        </Card>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#D4AF37]">10K+</p>
            <p className="text-xs text-[#8B8B8B]">Happy Customers</p>
          </div>

          <div>
            <p className="text-2xl font-bold text-[#D4AF37]">500+</p>
            <p className="text-xs text-[#8B8B8B]">Events Completed</p>
          </div>

          <div>
            <p className="text-2xl font-bold text-[#D4AF37]">4.8★</p>
            <p className="text-xs text-[#8B8B8B]">Average Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}