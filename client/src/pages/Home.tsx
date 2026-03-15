import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Heart, MapPin, Clock, Star, Phone, Menu, X, LogOut, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";


interface ServiceBox {
  id: string;
  title: string;
  emoji: string;
  description: string;
  priceRange: string;
  color: string;
}

interface BookingData {
  name: string;
  phone: string;
  email: string;
  eventDate: string;
  eventType: string;
  location: string;
  notes: string;
  budget: string;
}

const services: ServiceBox[] = [
  {
    id: "wedding",
    title: "Wedding",
    emoji: "💒",
    description: "Professional decoration packages available",
    priceRange: "₹8,000 - ₹35,000",
    color: "from-amber-50 to-red-50",
  },
  {
    id: "birthday",
    title: "Birthday",
    emoji: "🎂",
    description: "Professional decoration packages available",
    priceRange: "₹1,500 - ₹8,000",
    color: "from-orange-50 to-amber-50",
  },
  {
    id: "anniversary",
    title: "Anniversary",
    emoji: "💕",
    description: "Professional decoration packages available",
    priceRange: "₹2,000 - ₹12,000",
    color: "from-rose-50 to-red-50",
  },
  {
    id: "babyshower",
    title: "Baby Shower",
    emoji: "👶",
    description: "Professional decoration packages available",
    priceRange: "₹1,500 - ₹6,000",
    color: "from-blue-50 to-cyan-50",
  },
  {
    id: "engagement",
    title: "Engagement",
    emoji: "💍",
    description: "Professional decoration packages available",
    priceRange: "₹3,000 - ₹15,000",
    color: "from-purple-50 to-pink-50",
  },
  {
    id: "housewarming",
    title: "Housewarming",
    emoji: "🏠",
    description: "Professional decoration packages available",
    priceRange: "₹2,000 - ₹10,000",
    color: "from-green-50 to-emerald-50",
  },
];

export default function Home() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceBox | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ email: "", password: "", name: "", phone: "" });
  const [bookingData, setBookingData] = useState<BookingData>({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
    eventDate: "",
    eventType: "",
    location: "",
    notes: "",
    budget: "",
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      toast.success("Logged in successfully!");
      setIsLoginOpen(false);
      setLoginData({ email: "", password: "" });
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });

  const signupMutation = trpc.auth.signup.useMutation({
    onSuccess: () => {
      toast.success("Account created successfully!");
      setIsSignupOpen(false);
      setSignupData({ email: "", password: "", name: "", phone: "" });
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message || "Signup failed");
    },
  });

  const createBookingMutation = trpc.bookings.create.useMutation({
    onSuccess: () => {
      toast.success(`Booking request submitted for ${bookingData.eventType}! We'll contact you soon.`);
      setIsBookingOpen(false);
      setBookingData({
        name: user?.name || "",
        phone: "",
        email: user?.email || "",
        eventDate: "",
        eventType: "",
        location: "",
        notes: "",
        budget: "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit booking");
    },
  });

  const handleServiceClick = (service: ServiceBox) => {
    // Open booking form directly without requiring login
    setSelectedService(service);
    setBookingData((prev) => ({
      ...prev,
      eventType: service.title,
      name: user?.name || "",
      email: user?.email || "",
    }));
    setIsBookingOpen(true);
  };

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBudgetChange = (value: string) => {
    setBookingData((prev) => ({ ...prev, budget: value }));
  };

  const handleSubmitBooking = () => {
    if (!bookingData.name || !bookingData.phone || !bookingData.email || !bookingData.eventDate || !bookingData.location) {
      toast.error("Please fill in all required fields");
      return;
    }
    createBookingMutation.mutate({
      clientName: bookingData.name,
      clientEmail: bookingData.email,
      clientPhone: bookingData.phone,
      eventType: bookingData.eventType,
      eventDate: bookingData.eventDate,
      location: bookingData.location,
      budget: bookingData.budget || undefined,
      notes: bookingData.notes || undefined,
    });
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F3] via-white to-[#FAF8F3]">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8D5C4] shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B1538] flex items-center justify-center text-white font-bold text-lg">
              ✨
            </div>
            <h1 className="text-2xl font-bold text-[#2C2C2C]">UtsavMitra</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 flex-wrap">
            <a href="#home" className="text-[#2C2C2C] hover:text-[#D4AF37] transition-colors font-medium text-sm">
              Home
            </a>
            <a href="#about" className="text-[#2C2C2C] hover:text-[#D4AF37] transition-colors font-medium text-sm">
              About
            </a>
            <a href="#why" className="text-[#2C2C2C] hover:text-[#D4AF37] transition-colors font-medium text-sm">
              Why Us
            </a>
            <a href="#contact" className="text-[#2C2C2C] hover:text-[#D4AF37] transition-colors font-medium text-sm">
              Contact
            </a>
            <a href="#services" className="text-[#2C2C2C] hover:text-[#D4AF37] transition-colors font-medium text-sm">
              services
            </a>
            
<Button onClick={() => setLocation("/my-bookings")}>
  My Booking
</Button>
            {user ? (
              <div className="flex items-center gap-2">
                {/* Desktop Burger Menu - Right of Logout - HIDDEN ON DESKTOP */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                    className="text-[#2C2C2C] hover:text-[#D4AF37] transition-colors p-2"
                  >
                    {isDesktopMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                  {isDesktopMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-[#E8D5C4] rounded-lg shadow-lg py-2 z-50">
                      <a href="#home" className="block px-4 py-2 text-[#2C2C2C] hover:bg-[#FAF8F3] hover:text-[#D4AF37] transition-colors" onClick={() => setIsDesktopMenuOpen(false)}>🏠 Home</a>
                      <a href="#about" className="block px-4 py-2 text-[#2C2C2C] hover:bg-[#FAF8F3] hover:text-[#D4AF37] transition-colors" onClick={() => setIsDesktopMenuOpen(false)}>ℹ️ About</a>
                      <a href="#services" className="block px-4 py-2 text-[#2C2C2C] hover:bg-[#FAF8F3] hover:text-[#D4AF37] transition-colors" onClick={() => setIsDesktopMenuOpen(false)}>🎉 Services</a>
                      <a href="#why" className="block px-4 py-2 text-[#2C2C2C] hover:bg-[#FAF8F3] hover:text-[#D4AF37] transition-colors" onClick={() => setIsDesktopMenuOpen(false)}>⭐ Why Us</a>
                      <a href="#contact" className="block px-4 py-2 text-[#2C2C2C] hover:bg-[#FAF8F3] hover:text-[#D4AF37] transition-colors" onClick={() => setIsDesktopMenuOpen(false)}>📞 Contact</a>
                      <a href="#faq" className="block px-4 py-2 text-[#2C2C2C] hover:bg-[#FAF8F3] hover:text-[#D4AF37] transition-colors" onClick={() => setIsDesktopMenuOpen(false)}> FAQ</a>
                      <a href="#faq" className="block px-4 py-2 text-[#2C2C2C] hover:bg-[#FAF8F3] hover:text-[#D4AF37] transition-colors" onClick={() => setIsDesktopMenuOpen(false)}>📋 My Bookings</a>
                      
                      <div className="border-t border-[#E8D5C4] my-2">
                      </div>
                      
                      
                    
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {/* Burger Menu Hidden on Desktop - Only Show on Mobile */}
                <div className="relative md:hidden">
                  <button
                    onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                    className="text-[#2C2C2C] hover:text-[#D4AF37] transition-colors p-2"
                  >
                    {isDesktopMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                  {isDesktopMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-[#E8D5C4] rounded-lg shadow-lg py-2 z-50">

  <a href="#home" className="block px-4 py-2 text-[#2C2C2C] hover:bg-[#FAF8F3] hover:text-[#D4AF37]" onClick={() => setIsDesktopMenuOpen(false)}>🏠 Home</a>

  <a href="#about" className="block px-4 py-2 text-[#2C2C2C] hover:bg-[#FAF8F3] hover:text-[#D4AF37]" onClick={() => setIsDesktopMenuOpen(false)}>ℹ️ About</a>

  <a href="#services" className="block px-4 py-2 text-[#2C2C2C] hover:bg-[#FAF8F3] hover:text-[#D4AF37]" onClick={() => setIsDesktopMenuOpen(false)}>🎉 Services</a>

  <a href="#why" className="block px-4 py-2 text-[#2C2C2C] hover:bg-[#FAF8F3] hover:text-[#D4AF37]" onClick={() => setIsDesktopMenuOpen(false)}>⭐ Why Us</a>

  <a href="#contact" className="block px-4 py-2 text-[#2C2C2C] hover:bg-[#FAF8F3] hover:text-[#D4AF37]" onClick={() => setIsDesktopMenuOpen(false)}>📞 Contact</a>

  <a href="#faq" className="block px-4 py-2 text-[#2C2C2C] hover:bg-[#FAF8F3] hover:text-[#D4AF37]" onClick={() => setIsDesktopMenuOpen(false)}>❓ FAQ</a>

 <a href="#my-bookings" className="block px-4 py-2 text-[#2C2C2C] hover:bg-[#FAF8F3] hover:text-[#D4AF37]" onClick={() => setIsDesktopMenuOpen(false)}>📋 My Bookings</a>


</div>
                  )}
                </div>
                <Button onClick={() => setIsLoginOpen(true)} className="hidden md:block bg-[#D4AF37] text-[#2C2C2C] hover:bg-[#8B1538] hover:text-white transition-all duration-300 font-semibold text-sm py-2 px-3">Sign In</Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Right Section */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#2C2C2C] hover:text-[#D4AF37] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#E8D5C4] py-4">
            <div className="container space-y-2">
              <a
                href="#home"
                className="block text-[#2C2C2C] hover:text-[#D4AF37] transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏠 Home
              </a>
              <a
                href="#about"
                className="block text-[#2C2C2C] hover:text-[#D4AF37] transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ℹ️ About
              </a>
              <div className="relative">
                <button className="w-full text-left text-[#2C2C2C] hover:text-[#D4AF37] transition-colors font-medium py-2">
                  🎉 Services
                </button>
                
              </div>
              <a
                href="#why"
                className="block text-[#2C2C2C] hover:text-[#D4AF37] transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ⭐ Why Us
              </a>
              <a
                href="#contact"
                className="block text-[#2C2C2C] hover:text-[#D4AF37] transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                📞 Contact
              </a>
              <a
                href="#faq"
                className="block text-[#2C2C2C] hover:text-[#D4AF37] transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ❓ FAQ
              </a>

<a
  className="block text-[#2C2C2C] hover:text-[#D4AF37] transition-colors font-medium py-2 cursor-pointer"
  onClick={() => {
    setLocation("/my-bookings");
    setIsMobileMenuOpen(false);
  }}
>
  📋 My Bookings
</a>
              <div className="border-t border-[#E8D5C4] my-2"></div>
              {user ? (

                
                <>
                  <Button
                    onClick={() => {
                      setLocation("/my-bookings");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-[#D4AF37] text-[#2C2C2C] hover:bg-[#8B1538] hover:text-white transition-all duration-300 font-semibold"
                  >
                    My Bookings
                  </Button>
                  {user.role === "admin" && (
                    <Button
                      onClick={() => {
                        setLocation("/admin");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Dashboard
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-[#E8D5C4] text-[#2C2C2C] hover:bg-[#FAF8F3]"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    setLocation("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#D4AF37] text-[#2C2C2C] hover:bg-[#8B1538] hover:text-white transition-all duration-300 font-semibold"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      <section id="home" className="relative overflow-hidden py-20 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-[#2C2C2C] leading-tight">
                  Har Khushi Ka <span className="text-[#D4AF37]">Saathi</span>
                </h1>
                <p className="text-xl text-[#8B8B8B] font-light leading-relaxed">
                  Complete event decoration services for weddings, birthdays, anniversaries, and more. Professional decorators at your doorstep.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#E8D5C4]">
                <div>
                  <p className="text-3xl font-bold text-[#D4AF37]">10K+</p>
                  <p className="text-sm text-[#8B8B8B] font-medium">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#D4AF37]">500+</p>
                  <p className="text-sm text-[#8B8B8B] font-medium">Events Completed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#D4AF37]">4.8★</p>
                  <p className="text-sm text-[#8B8B8B] font-medium">Average Rating</p>
                </div>
              </div>
            </div>
            <div className="relative h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#8B1538]/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-[#D4AF37] to-[#E8745B] rounded-3xl p-8 h-full flex flex-col justify-center items-center text-white shadow-2xl">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold text-center mb-2">Celebrate Every Moment</h3>
                <p className="text-center text-white/90 text-lg">Make your special occasions unforgettable</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 md:py-32 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-4">Events We Decorate</h2>
            <p className="text-lg text-[#8B8B8B] max-w-2xl mx-auto">
              From intimate gatherings to grand celebrations, we have packages for every occasion
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="group cursor-pointer transition-all duration-300 transform hover:scale-105"
              >
                <Card className={`bg-gradient-to-br ${service.color} border-2 border-[#E8D5C4] hover:border-[#D4AF37] h-full p-8 shadow-md hover:shadow-2xl transition-all duration-300`}>
                  <div className="space-y-4">
                    <div className="text-5xl">{service.emoji}</div>
                    <h3 className="text-2xl font-bold text-[#2C2C2C]">{service.title}</h3>
                    <p className="text-[#8B8B8B] text-sm leading-relaxed">{service.description}</p>
                    <div className="pt-4 border-t border-[#E8D5C4]">
                      <p className="text-lg font-semibold text-[#D4AF37]">{service.priceRange}</p>
                    </div>
                    <Button className="w-full bg-[#D4AF37] text-[#2C2C2C] hover:bg-[#8B1538] hover:text-white transition-all duration-300 font-semibold mt-4">
                      Book Now
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-4">About UtsavMitra</h2>
                <div className="w-20 h-1 bg-[#D4AF37] rounded"></div>
              </div>
              <p className="text-lg text-[#8B8B8B] leading-relaxed">
                UtsavMitra is your trusted partner for making every celebration special. With over 10 years of experience in event decoration, we have transformed thousands of occasions into unforgettable memories.
              </p>
              <p className="text-lg text-[#8B8B8B] leading-relaxed">
                Our team of professional decorators brings creativity, attention to detail, and passion to every project. Whether it's a grand wedding, intimate birthday party, or corporate event, we deliver excellence every time.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#E8D5C4]">
                <div>
                  <p className="text-3xl font-bold text-[#D4AF37]">10+</p>
                  <p className="text-sm text-[#8B8B8B] font-medium">Years Experience</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#D4AF37]">500+</p>
                  <p className="text-sm text-[#8B8B8B] font-medium">Events Done</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#D4AF37]">100%</p>
                  <p className="text-sm text-[#8B8B8B] font-medium">Satisfaction</p>
                </div>
              </div>
            </div>
            <div className="relative h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#8B1538]/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-[#8B1538] to-[#D4AF37] rounded-3xl p-8 h-full flex flex-col justify-center items-center text-white shadow-2xl">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-3xl font-bold text-center mb-2">Creative Excellence</h3>
                <p className="text-center text-white/90 text-lg">Bringing your vision to life with professional expertise</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="py-20 md:py-32 bg-gradient-to-br from-[#FAF8F3] to-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-4">Why Choose UtsavMitra?</h2>
            <p className="text-lg text-[#8B8B8B] max-w-2xl mx-auto">
              We bring professional decoration services directly to your home with experienced staff and quality materials
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: "Available in Your Village", description: "Serving decoration needs in villages and small towns" },
              { icon: Star, title: "Professional Team", description: "Experienced decorators trained in latest trends" },
              { icon: Clock, title: "On-Time Guarantee", description: "Real-time tracking ensures on-time arrival" },
              { icon: Heart, title: "Quality Assured", description: "High-quality materials and attention to detail" },
              { icon: Phone, title: "Customizable Packages", description: "Flexible options to match your budget" },
              { icon: Star, title: "Easy Booking", description: "Simple online booking with multiple payment options" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="border-2 border-[#E8D5C4] hover:border-[#D4AF37] p-8 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#E8745B] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2C2C2C]">{item.title}</h3>
                    <p className="text-[#8B8B8B] leading-relaxed">{item.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-4">What Our Customers Say</h2>
            <p className="text-lg text-[#8B8B8B]">Trusted by thousands of happy customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "UtsavMitra made our wedding decoration perfect! The team was professional and delivered exactly what we wanted.", author: "Priya Sharma", event: "Wedding Decoration", rating: 5 },
              { text: "Best decoration service in our village. Affordable prices and excellent quality. Highly recommended!", author: "Rajesh Kumar", event: "Birthday Party", rating: 5 },
              { text: "The attention to detail was amazing. Our anniversary celebration was memorable thanks to UtsavMitra.", author: "Anjali Patel", event: "Anniversary Celebration", rating: 5 },
            ].map((testimonial, index) => (
              <Card key={index} className="border-2 border-[#E8D5C4] p-8 hover:shadow-lg transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-[#D4AF37] text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-[#8B8B8B] italic leading-relaxed">"{testimonial.text}"</p>
                  <div className="pt-4 border-t border-[#E8D5C4]">
                    <p className="font-bold text-[#2C2C2C]">{testimonial.author}</p>
                    <p className="text-sm text-[#D4AF37] font-medium">{testimonial.event}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gradient-to-r from-[#8B1538] to-[#D4AF37]">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Make Your Event Special?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Book your decoration service today and get professional decorators at your doorstep
          </p>
          <Button
            size="lg"
            className="bg-white text-[#8B1538] hover:bg-[#FAF8F3] shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
            onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
          >
            Book Now
          </Button>
        </div>
      </section>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#2C2C2C]">
              {selectedService && `Book ${selectedService.title} Decoration`}
            </DialogTitle>
            <DialogDescription className="text-[#8B8B8B]">
              Fill in your details and we'll get back to you with a customized quote
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#2C2C2C] font-semibold">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={bookingData.name}
                  onChange={handleBookingChange}
                  className="border-[#E8D5C4] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#2C2C2C] font-semibold">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="10-digit phone number"
                  value={bookingData.phone}
                  onChange={handleBookingChange}
                  className="border-[#E8D5C4] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#2C2C2C] font-semibold">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={bookingData.email}
                  onChange={handleBookingChange}
                  className="border-[#E8D5C4] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDate" className="text-[#2C2C2C] font-semibold">
                  Event Date *
                </Label>
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  value={bookingData.eventDate}
                  onChange={handleBookingChange}
                  className="border-[#E8D5C4] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-[#2C2C2C] font-semibold">
                  Location/Village *
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Your location"
                  value={bookingData.location}
                  onChange={handleBookingChange}
                  className="border-[#E8D5C4] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-[#2C2C2C] font-semibold">
                  Budget Range
                </Label>
                <Select value={bookingData.budget} onValueChange={handleBudgetChange}>
                  <SelectTrigger className="border-[#E8D5C4] focus:border-[#D4AF37] focus:ring-[#D4AF37]">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-5000">Under ₹5,000</SelectItem>
                    <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                    <SelectItem value="10000-25000">₹10,000 - ₹25,000</SelectItem>
                    <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
                    <SelectItem value="above-50000">Above ₹50,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-[#2C2C2C] font-semibold">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Tell us about your event, preferences, or special requirements..."
                value={bookingData.notes}
                onChange={handleBookingChange}
                className="border-[#E8D5C4] focus:border-[#D4AF37] focus:ring-[#D4AF37] min-h-24"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1 border-[#E8D5C4] text-[#2C2C2C] hover:bg-[#FAF8F3]"
                onClick={() => setIsBookingOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={createBookingMutation.isPending}
                className="flex-1 bg-[#D4AF37] text-[#2C2C2C] hover:bg-[#8B1538] hover:text-white transition-all duration-300 font-semibold"
                onClick={handleSubmitBooking}
              >
                {createBookingMutation.isPending ? "Submitting..." : "Submit Booking Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Compact Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#2C2C2C]">Sign In</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-[#2C2C2C] font-semibold text-sm">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="your@email.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="border-[#E8D5C4] focus:border-[#D4AF37] focus:ring-[#D4AF37] text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-[#2C2C2C] font-semibold text-sm">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="border-[#E8D5C4] focus:border-[#D4AF37] focus:ring-[#D4AF37] text-sm"
              />
            </div>
            <Button
              onClick={() => {
                if (loginData.email && loginData.password) {
                  loginMutation.mutate({ email: loginData.email, password: loginData.password });
                } else {
                  toast.error("Please enter email and password");
                }
              }}
              disabled={loginMutation.isPending}
              className="w-full bg-[#D4AF37] text-[#2C2C2C] hover:bg-[#8B1538] hover:text-white transition-all duration-300 font-semibold text-sm disabled:opacity-50"
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>
            <div className="text-center text-sm text-[#2C2C2C]">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setIsLoginOpen(false);
                  setIsSignupOpen(true);
                }}
                className="text-[#D4AF37] hover:text-[#8B1538] font-semibold"
              >
                Sign Up
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signup Dialog */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#2C2C2C]">Create Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name" className="text-[#2C2C2C] font-semibold text-sm">Name</Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Your name"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                className="border-[#E8D5C4] focus:border-[#D4AF37] focus:ring-[#D4AF37] text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-[#2C2C2C] font-semibold text-sm">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="your@email.com"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                className="border-[#E8D5C4] focus:border-[#D4AF37] focus:ring-[#D4AF37] text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-phone" className="text-[#2C2C2C] font-semibold text-sm">Phone (Optional)</Label>
              <Input
                id="signup-phone"
                type="tel"
                placeholder="+91 XXXXXXXXXX"
                value={signupData.phone}
                onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                className="border-[#E8D5C4] focus:border-[#D4AF37] focus:ring-[#D4AF37] text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-[#2C2C2C] font-semibold text-sm">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                className="border-[#E8D5C4] focus:border-[#D4AF37] focus:ring-[#D4AF37] text-sm"
              />
            </div>
            <Button
              onClick={() => {
                if (signupData.email && signupData.password && signupData.name) {
                  signupMutation.mutate({
                    email: signupData.email,
                    password: signupData.password,
                    name: signupData.name,
                    phone: signupData.phone || undefined,
                  });
                } else {
                  toast.error("Please fill in all required fields");
                }
              }}
              disabled={signupMutation.isPending}
              className="w-full bg-[#D4AF37] text-[#2C2C2C] hover:bg-[#8B1538] hover:text-white transition-all duration-300 font-semibold text-sm disabled:opacity-50"
            >
              {signupMutation.isPending ? "Creating Account..." : "Sign Up"}
            </Button>
            <div className="text-center text-sm text-[#2C2C2C]">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setIsSignupOpen(false);
                  setIsLoginOpen(true);
                }}
                className="text-[#D4AF37] hover:text-[#8B1538] font-semibold"
              >
                Sign In
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 bg-gradient-to-br from-[#8B1538] to-[#D4AF37]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Contact us today to discuss your event decoration needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Email */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-white/20 transition-all duration-300">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-2xl font-bold text-white mb-2">Email</h3>
              <a href="mailto:pankajmall7398@gmail.com" className="text-white/90 hover:text-white text-lg transition-colors">
                pankajmall7398@gmail.com
              </a>
            </div>
            {/* Phone */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-white/20 transition-all duration-300">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-white mb-2">Phone</h3>
              <a href="tel:+917398302396" className="text-white/90 hover:text-white text-lg transition-colors">
                +91 7398302396
              </a>
            </div>
            {/* Name */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-white/20 transition-all duration-300">
              <div className="text-5xl mb-4">👤</div>
              <h3 className="text-2xl font-bold text-white mb-2">Contact Person</h3>
              <p className="text-white/90 text-lg">
                Pankaj Singh
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-white text-[#8B1538] hover:bg-[#FAF8F3] shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
              onClick={() => setIsBookingOpen(true)}
            >
              Book Your Event Now
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-[#2C2C2C] text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4 text-[#D4AF37]">UtsavMitra</h4>
              <p className="text-gray-300 text-sm">Making every celebration special with professional decoration services</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-[#D4AF37]">Services</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Weddings</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Birthdays</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Anniversaries</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Engagements</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-[#D4AF37]">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#why" className="hover:text-[#D4AF37] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-[#D4AF37]">Contact</h4>
              <p className="text-gray-300 text-sm">
                <a href="mailto:pankajmall7398@gmail.com" className="hover:text-[#D4AF37] transition-colors">Email: pankajmall7398@gmail.com</a>
              </p>
              <p className="text-gray-300 text-sm">
                <a href="tel:+917398302396" className="hover:text-[#D4AF37] transition-colors">Phone: +91 7398302396</a>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 UtsavMitra. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
