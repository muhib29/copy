"use client";

import { Button } from "@/components/ui/button";
import {
  Facebook,
  Instagram,
  Phone,
  MapPin,
  MessageCircle,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-700">
      <div className="container grid gap-12 py-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div className="space-y-5 -mr-10">
          <h3 className="font-display text-2xl font-semibold text-gray-900">
            Nasir All Fabrics
          </h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-gray-500 shrink-0" />
              <span>
                Email:{" "}
                <a
                  href="mailto:nasirallfabric@gmail.com"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  nasirallfabric@gmail.com
                </a>
              </span>
            </p>
            <p className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-gray-500 shrink-0" />
              <span>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/923702539707"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  +92 370 2539707
                </a>
              </span>
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
              <span>
                Clifton Do Talwar, The Plaza Shopping Mall, Shop #82 & 84,
                Karachi, Pakistan 75600
              </span>
            </p>
          </div>
        </div>
        <div>
          <p className="mb-4 font-semibold text-gray-900 tracking-wide">Shop</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              ["Summer Collection", "/collection/summer"],
              ["Winter Collection", "/collection/winter"],
              ["Shop All", "/shop"],
              ["Sale", "/sale"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 font-semibold text-gray-900 tracking-wide">
            Categories
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              ["Lawn", "/category/lawn"],
              ["Linen", "/category/linen"],
              ["Karandi", "/category/karandi"],
              ["Cotton", "/category/cotton"],
              ["Embroidered", "/category/embroidered"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 font-semibold text-gray-900 tracking-wide">
            Company
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              ["About", "/about"],
              ["Journal", "/journal"],
              ["Contact", "/contact"],
              ["Privacy Policy", "/privacy-policy"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 font-semibold text-gray-900 tracking-wide">
            Join Our Newsletter
          </p>
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
            className="space-y-3"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring focus:ring-primary/30"
            />
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
            >
              Subscribe
            </Button>
          </form>
          <p className="mt-4 font-semibold text-gray-900 tracking-wide">
            Follow Us
          </p>
          <div className="flex gap-3 pt-3">
            {[
              {
                href: "https://www.instagram.com",
                icon: Instagram,
                color: "hover:bg-pink-500",
              },
              {
                href: "https://www.facebook.com",
                icon: Facebook,
                color: "hover:bg-blue-600",
              },
              {
                href: "https://wa.me/923702539707",
                icon: MessageCircle,
                color: "hover:bg-green-500",
              },
            ].map(({ href, icon: Icon, color }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={`rounded-full bg-gray-100 p-2 text-gray-600 transition hover:text-white ${color}`}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t bg-gray-50 py-6 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-gray-900">Nasir All Fabrics</span> —
          All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
