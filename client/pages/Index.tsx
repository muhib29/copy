import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/store/ProductCard";
import { products } from "@/data/products";
import { Link } from "react-router-dom";

export default function Index() {
  const heroSlides = [
    {
      image:
        "https://www.sokamal.com/cdn/shop/files/Cotton_Web_Banner_Option_1_838ed26b-f8a7-47f8-83d4-aaceef7fb13a.jpg?v=1759310943&width=1400",
    },
    {
      image:
        "https://www.sokamal.com/cdn/shop/files/Chikankari-Banner-Web_dc5b30f1-15a0-4222-89b4-091bac7936c8.jpg?v=1759564838&width=1600",
    },
    {
      image:
        "https://www.sokamal.com/cdn/shop/files/Cotton_Web_Banner_Option_1_838ed26b-f8a7-47f8-83d4-aaceef7fb13a.jpg?v=1759310943&width=1600",
    },
  ];

  return (
    <div className="flex flex-col mt-0">
      {/* 🖼️ Full Banner Image Carousel (No Text) */}
      <section className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {heroSlides.map((s, idx) => (
              <CarouselItem key={idx}>
                <div className="w-full overflow-hidden">
                  <img
                    src={s.image}
                    alt={`Slide ${idx + 1}`}
                    className="w-full h-[90vh] object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation arrows (optional, you can remove if you want auto-slide only) */}
          <CarouselPrevious className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-black rounded-full" />
          <CarouselNext className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-black rounded-full" />
        </Carousel>
      </section>

      {/* 🛍️ Featured Products (keep your sections below unchanged if needed) */}
      <section className="container pb-6 pt-10 md:py-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl md:text-3xl">Featured</h2>
            <p className="text-sm text-muted-foreground">
              Curated pieces our customers love
            </p>
          </div>
          <Button asChild variant="link" className="px-0">
            <Link to="/shop">Shop all</Link>
          </Button>
        </div>
        <ProductGrid items={products.slice(0, 8)} />
      </section>







      <section className="container py-12">
        <p className="text-xs tracking-widest text-accent">Ladies Unstitched</p>
        <h2 className="mb-4 mt-2 font-display text-2xl md:text-3xl">
          Shop by Collection
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Summer Collection",
              image:
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
              href: "/collection/summer",
            },
            {
              title: "Winter Collection",
              image:
                "https://images.unsplash.com/photo-1515542706656-8e6ef17df6f1?q=80&w=1600&auto=format&fit=crop",
              href: "/collection/winter",
            },
          ].map((c) => (
            <Link
              key={c.title}
              to={c.href}
              className="group relative overflow-hidden rounded-md"
            >
              <img
                src={c.image}
                alt={c.title}
                className="aspect-[5/3] w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="font-display text-2xl text-white">{c.title}</h3>
                <span className="mt-1 inline-block text-xs tracking-widest text-white/80">
                  EXPLORE
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* Banner */}
      <section className="container py-12">
        <div className="relative overflow-hidden rounded-md bg-muted">
          <img
            src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=2000&auto=format&fit=crop"
            alt="Sale"
            className="h-64 w-full object-cover opacity-90 md:h-80"
          />
          <div className="absolute inset-0 grid place-items-center bg-black/30">
            <div className="text-center text-white">
              <p className="text-xs tracking-widest text-white/80">
                LIMITED TIME
              </p>
              <h3 className="mt-2 font-display text-3xl md:text-4xl">
                Mid-Season Sale
              </h3>
              <p className="mt-1 text-white/90">
                Up to 40% off selected styles
              </p>
              <div className="mt-4">
                <Button asChild variant="secondary">
                  <Link to="/sale">Shop Sale</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-y bg-muted/30">
        <div className="container grid items-center gap-8 py-12 md:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl md:text-3xl">
              Join Nasir All Fabrics Circle
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Be the first to know about new drops, exclusive offers and more.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const input = form.elements.namedItem(
                "email",
              ) as HTMLInputElement;
              if (input?.value) {
                alert("Thanks for subscribing!");
                input.value = "";
              }
            }}
            className="flex w-full gap-3"
          >
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
