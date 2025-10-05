import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Search, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useEffect, useState } from "react";

export default function SiteHeader() {
  const { items, totalQty, totalPrice, removeItem } = useCart();
  const [index, setIndex] = useState(0);

  const messages = [
    "Complimentary shipping on orders over $150",
    "New Winter Collection just dropped!",
    "Get 10% off your first order — use code WELCOME10",
    "Free returns within 30 days",
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000); // every 4 seconds
    return () => clearInterval(interval);
  }, []);
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="bg-primary text-primary-foreground text-xs sm:text-sm">
        <div className="bg-primary text-primary-foreground text-xs sm:text-sm overflow-hidden">
          <div className="container flex items-center justify-center py-2 text-center transition-all duration-500">
            <p
              key={index}
              className="animate-fadeIn text-center text-sm"
            >
              {messages[index]}
            </p>
          </div>
        </div>

      </div>

      <div className="container flex h-16 items-center justify-between">

        <Link to="/" className="font-display text-2xl tracking-wider">
          Nasir All Fabrics
        </Link>
        <nav className="hidden md:flex gap-6 text-sm">
          {[
            ["Summer Collection", "/collection/summer"],
            ["Winter Collection", "/collection/winter"],
            ["Shop All", "/shop"],
          ].map(([label, href]) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `hover:text-foreground/80 ${isActive ? "text-foreground" : "text-foreground/60"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Account">
            <User className="h-5 w-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Cart"
                className="relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalQty > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-accent-foreground">
                    {totalQty}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[360px] sm:w-[420px]">
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {items.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Your cart is empty.
                  </p>
                )}
                {items.map((i) => (
                  <div key={i.id} className="flex gap-3">
                    <img
                      src={i.image}
                      alt={i.name}
                      className="h-20 w-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium">{i.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty {i.qty}
                          </p>
                        </div>
                        <p className="text-sm">
                          ${(i.qty * i.price).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0 text-destructive"
                        onClick={() => removeItem(i.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {items.length > 0 && (
                <div className="mt-6 space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <Button className="w-full">Checkout</Button>
                  <Link
                    to="/shop"
                    className="block text-center text-sm underline"
                  >
                    Continue shopping
                  </Link>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
