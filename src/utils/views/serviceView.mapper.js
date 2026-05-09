"use strict";

const { formatPrice } = require("./formatView.util");

function getServiceIcon(serviceName = "") {
  const name = String(serviceName).toLowerCase();

  if (name.includes("wash")) return "🧴";
  if (name.includes("haircut")) return "✂️";
  if (name.includes("cut")) return "✂️";
  if (name.includes("color")) return "💆‍♀️";
  if (name.includes("blow")) return "💨";
  if (name.includes("styling")) return "💇";
  if (name.includes("keratin")) return "✨";
  if (name.includes("beard")) return "🧔";
  if (name.includes("facial")) return "🧖";
  if (name.includes("skin")) return "🧖";
  if (name.includes("massage")) return "💆";
  if (name.includes("doctor")) return "🩺";
  if (name.includes("consult")) return "🩺";
  if (name.includes("therapy")) return "🧘";
  if (name.includes("advisor")) return "💬";

  return "▦";
}

function decorateServicesForView(services = []) {
  return services
    .filter((service) => service && service.is_active !== false)
    .map((service, index) => {
      const serviceName = service.name || service.service_name || "Service";

      const durationMin =
        service.default_duration_min ||
        service.service_default_duration_min ||
        service.duration_min ||
        0;

      const priceValue =
        service.base_price_cents ||
        service.service_base_price_cents ||
        service.default_price_cents ||
        service.price_cents ||
        0;

      return {
        id: service.id || service.service_id,
        categoryId: service.category_id || service.categoryId,
        name: serviceName,
        description:
          service.description ||
          service.service_description ||
          "Professional service with trusted care.",
        durationMin: Number(durationMin) || 0,
        priceLabel: formatPrice(priceValue),
        icon: getServiceIcon(serviceName),
        featured: index === 1,
      };
    });
}

module.exports = { getServiceIcon, decorateServicesForView };
